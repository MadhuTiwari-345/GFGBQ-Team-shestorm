import asyncio
import base64
import json
import uuid
import datetime
from typing import Optional

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from pydantic import BaseModel, Field, ValidationError

from ..utils.fraud_detection import FraudDetectionService
from ..app.logging import logger

import numpy as np

router = APIRouter()

RECEIVE_TIMEOUT = 15
SEND_TIMEOUT = 2
SEND_QUEUE_MAXSIZE = 10
TRANSCRIPT_MAX_LENGTH = 5000


class TranscriptMessage(BaseModel):
    transcript: str = Field(..., max_length=TRANSCRIPT_MAX_LENGTH)


class AudioMessage(BaseModel):
    audio_data: str
    transcript: Optional[str] = None


class ConnectionManager:
    def __init__(self):
        self._conns = {}
        self._lock = asyncio.Lock()

    async def connect(self, session_id: str, websocket: WebSocket):
        await websocket.accept()
        async with self._lock:
            existing = self._conns.get(session_id)
            if existing:
                try:
                    existing["task"].cancel()
                except Exception:
                    logger.debug("Failed to cancel existing sender task")
            queue = asyncio.Queue(maxsize=SEND_QUEUE_MAXSIZE)
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
            async with self._lock:
                current = self._conns.get(session_id)
                if current and current.get("queue") is queue:
                    self._conns.pop(session_id, None)

    async def send(self, session_id: str, message: str):
        async with self._lock:
            conn = self._conns.get(session_id)
            if not conn:
                logger.debug("No active websocket for session %s", session_id)
                return
            queue = conn["queue"]
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
service = FraudDetectionService()


@router.websocket('/stream')
async def websocket_stream(websocket: WebSocket, session_id: str, create_if_missing: bool = False):
    # For minimal test router, only support transient sessions
    transient = True

    # Optional authentication: check Authorization header or ?token query param
    try:
        logger.info("WS handshake headers: %s", dict(websocket.headers))
    except Exception:
        pass
    auth_header = websocket.headers.get("authorization") or websocket.headers.get("Authorization")
    token = None
    username = None
    if auth_header and auth_header.lower().startswith("bearer "):
        token = auth_header.split(" ", 1)[1]
    else:
        token = websocket.query_params.get("token")

    if token:
        try:
            from backend.app.config import settings
        except Exception:
            class _DummySettings:
                secret_key = "test-secret"
                algorithm = "HS256"
            settings = _DummySettings()
        from jose import JWTError, jwt
        try:
            payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
            username = payload.get("sub")
            try:
                logger.info("WS token decoded: %s payload: %s", token, payload)
            except Exception:
                pass
        except JWTError:
            # Reject before accepting the connection so clients observe an immediate close
            await websocket.close(code=1008)
            # Raise to ensure TestClient sees an error when attempting to connect with bad token
            raise Exception("Invalid token during WS handshake")

    await manager.connect(session_id, websocket)

    try:
        while True:
            try:
                raw = await asyncio.wait_for(websocket.receive_text(), timeout=RECEIVE_TIMEOUT)
            except asyncio.TimeoutError:
                await manager.send(session_id, json.dumps({"error": "receive_timeout"}))
                break

            try:
                data = json.loads(raw)
            except json.JSONDecodeError:
                await manager.send(session_id, json.dumps({"error": "invalid_json"}))
                continue

            # Validate and analyze
            if isinstance(data, dict) and 'transcript' in data:
                try:
                    msg = TranscriptMessage(**data)
                except ValidationError as e:
                    await manager.send(session_id, json.dumps({"error": "validation_error", "details": e.errors()}))
                    continue
                result = service.analyze_audio_transcript(msg.transcript)
                risk = result.get('risk_score', 0.0)
            else:
                await manager.send(session_id, json.dumps({"error": "invalid_data_format"}))
                continue

            response = {"risk_score": risk, "analysis": result, "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()}
            if username:
                response["user"] = username
            await manager.send(session_id, json.dumps(response))

    except WebSocketDisconnect:
        await manager.disconnect(session_id)
    except Exception as e:
        logger.exception("Minimal websocket error: %s", e)
        await manager.disconnect(session_id)
