import asyncio
import base64
import json
import uuid
import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from pydantic import BaseModel, Field, ValidationError
from sqlalchemy.orm import Session

from ..app.database import get_db
from ..models.call import Call
from ..models.user import User
from ..routes.auth import get_current_user
from ..utils.fraud_detection import FraudDetectionService
from ..app.logging import logger

import numpy as np

router = APIRouter()
fraud_service = FraudDetectionService()

# Configurable timeouts and queue sizes (can be overridden via env in future)
RECEIVE_TIMEOUT = 15  # seconds
SEND_TIMEOUT = 2  # seconds
SEND_QUEUE_MAXSIZE = 10
TRANSCRIPT_MAX_LENGTH = 5000


class TranscriptMessage(BaseModel):
    transcript: str = Field(..., max_length=TRANSCRIPT_MAX_LENGTH)


class AudioMessage(BaseModel):
    audio_data: str
    transcript: Optional[str] = None


class ConnectionManager:
    """Manage active websocket connections per session with a bounded send queue
    to avoid unbounded memory growth and provide backpressure semantics.
    """

    def __init__(self):
        self._conns: dict[str, dict] = {}
        self._lock = asyncio.Lock()

    async def connect(self, session_id: str, websocket: WebSocket):
        """Register or replace the websocket for a given session_id."""
        await websocket.accept()
        async with self._lock:
            # If a connection already exists for the session, replace it (allowing
            # clients to reconnect transparently).
            existing = self._conns.get(session_id)
            if existing:
                try:
                    existing["task"].cancel()
                except Exception:
                    logger.debug("Failed to cancel existing sender task")
            queue: asyncio.Queue = asyncio.Queue(maxsize=SEND_QUEUE_MAXSIZE)
            task = asyncio.create_task(self._sender(session_id, websocket, queue))
            self._conns[session_id] = {"websocket": websocket, "queue": queue, "task": task}

    async def _sender(self, session_id: str, websocket: WebSocket, queue: asyncio.Queue):
        try:
            while True:
                message = await queue.get()
                try:
                    await asyncio.wait_for(websocket.send_text(message), timeout=SEND_TIMEOUT)
                except asyncio.TimeoutError:
                    logger.warning("Send timed out for session %s", session_id)
                except Exception as e:
                    logger.error("Send error for session %s: %s", session_id, e)
                    break
                finally:
                    queue.task_done()
        except asyncio.CancelledError:
            logger.debug("Sender task cancelled for session %s", session_id)
        finally:
            # Clean up on exit
            async with self._lock:
                current = self._conns.get(session_id)
                if current and current.get("queue") is queue:
                    self._conns.pop(session_id, None)

    async def send(self, session_id: str, message: str):
        """Enqueue a message for sending; if the queue is full, drop the message
        and log a warning (backpressure handling).
        """
        async with self._lock:
            conn = self._conns.get(session_id)
            if not conn:
                logger.debug("No active websocket for session %s", session_id)
                return
            queue: asyncio.Queue = conn["queue"]
            try:
                queue.put_nowait(message)
            except asyncio.QueueFull:
                logger.warning("Send queue full for session %s; dropping message", session_id)

    async def disconnect(self, session_id: str):
        async with self._lock:
            conn = self._conns.pop(session_id, None)
            if conn:
                try:
                    conn["task"].cancel()
                except Exception:
                    logger.debug("Error cancelling sender task on disconnect")


manager = ConnectionManager()


@router.post("/start")
def start_call(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    session_id = str(uuid.uuid4())
    db_call = Call(user_id=current_user.id, session_id=session_id)
    db.add(db_call)
    db.commit()
    db.refresh(db_call)
    return {"session_id": session_id, "message": "Call started"}


@router.websocket("/stream")
async def websocket_endpoint(websocket: WebSocket, session_id: str, create_if_missing: bool = False):
    # Acquire DB session if available; be resilient in test environments where
    # the DB dependency may not be resolvable.
    db = None
    try:
        _gen = get_db()
        db = next(_gen)
    except Exception:
        db = None

    # Validate call existence first
    call = None
    if db is not None:
        try:
            call = db.query(Call).filter(Call.session_id == session_id).first()
        except Exception:
            call = None

    transient = False
    if not call:
        if create_if_missing:
            # Create a transient in-memory call object for testing/demo purposes (not persisted)
            class _TransientCall:
                def __init__(self, session_id):
                    self.id = 0
                    self.user_id = None
                    self.session_id = session_id
                    self.risk_score = 0.0
                    self.status = "active"

            call = _TransientCall(session_id)
            transient = True
        else:
            await websocket.accept()
            await websocket.send_text(json.dumps({"error": "Invalid session"}))
            await websocket.close()
            return

    await manager.connect(session_id, websocket)

    try:
        while True:
            try:
                raw = await asyncio.wait_for(websocket.receive_text(), timeout=RECEIVE_TIMEOUT)
            except asyncio.TimeoutError:
                # No data received in time — notify and continue (client may still be alive)
                await manager.send(session_id, json.dumps({"error": "receive_timeout"}))
                # Optionally close if desired: break
                break

            # Basic JSON validation
            try:
                data = json.loads(raw)
            except json.JSONDecodeError:
                await manager.send(session_id, json.dumps({"error": "invalid_json"}))
                continue

            # Handle different data types (text or audio)
            analysis_result = None
            risk_score = 0.0

            if isinstance(data, dict):
                if 'transcript' in data:
                    try:
                        msg = TranscriptMessage(**data)
                    except ValidationError as e:
                        await manager.send(session_id, json.dumps({"error": "validation_error", "details": e.errors()}))
                        continue

                    # Text analysis
                    analysis_result = fraud_service.analyze_audio_transcript(msg.transcript)
                    risk_score = analysis_result.get('risk_score', 0.0)

                elif 'audio_data' in data:
                    try:
                        msg = AudioMessage(**data)
                        audio_bytes = base64.b64decode(msg.audio_data)
                        audio_array = np.frombuffer(audio_bytes, dtype=np.float32)
                    except Exception:
                        await manager.send(session_id, json.dumps({"error": "invalid_audio_data"}))
                        continue

                    transcript = msg.transcript
                    analysis_result = fraud_service.analyze_audio_data(audio_array, transcript)
                    risk_score = analysis_result.get('overall_risk_score', 0.0)

                else:
                    await manager.send(session_id, json.dumps({"error": "invalid_data_format"}))
                    continue
            else:
                # Fallback to text analysis
                analysis_result = fraud_service.analyze_audio_transcript(str(data))
                risk_score = analysis_result.get('risk_score', 0.0)

            # Update call risk score and persist if not transient
            call.risk_score = float(risk_score)
            if not transient:
                db.commit()

            # Send comprehensive analysis update (use manager to handle backpressure)
            response = {
                "risk_score": call.risk_score,
                "analysis": analysis_result,
                "timestamp": str(datetime.datetime.utcnow())
            }
            await manager.send(session_id, json.dumps(response))

            # Trigger alert if high risk
            if call.risk_score > 0.8:
                alert_data = {
                    "call_id": call.id,
                    "alert_type": "HIGH_RISK_DETECTED",
                    "message": f"High risk score detected: {call.risk_score:.2f}",
                    "risk_score": call.risk_score
                }
                logger.warning(f"Auto-alert triggered for call {call.id}: {alert_data}")

    except WebSocketDisconnect:
        call.status = "ended"
        if not transient:
            db.commit()
        await manager.disconnect(session_id)
    except Exception as e:
        logger.exception("WebSocket error: %s", e)
        call.status = "error"
        if not transient:
            db.commit()
        await manager.disconnect(session_id)


@router.get("/risk-score")
def get_risk_score(session_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    call = db.query(Call).filter(Call.session_id == session_id, Call.user_id == current_user.id).first()
    if not call:
        raise HTTPException(status_code=404, detail="Call not found")
    return {"risk_score": call.risk_score}
