import json
import uuid
import time
import logging

from fastapi.testclient import TestClient
from backend.app.main import app
import pytest

from backend.routes import calls_minimal

client = TestClient(app)


def test_reconnection_replaces_sender():
    session_id = str(uuid.uuid4())
    uri = f"/call/stream?session_id={session_id}&create_if_missing=true"

    # First connection
    with client.websocket_connect(uri) as ws:
        ws.send_text(json.dumps({"transcript": "First message urgent"}))
        resp1 = json.loads(ws.receive_text())
        assert "risk_score" in resp1

    # Reconnect with same session_id
    with client.websocket_connect(uri) as ws2:
        ws2.send_text(json.dumps({"transcript": "Second message urgent"}))
        resp2 = json.loads(ws2.receive_text())
        assert "risk_score" in resp2


def test_backpressure_causes_send_queue_drops(caplog):
    # Capture warnings from the app logger ('fraud_detection') specifically
    caplog.set_level(logging.WARNING, logger='fraud_detection')
    session_id = str(uuid.uuid4())
    uri = f"/call/stream?session_id={session_id}&create_if_missing=true"

    # Temporarily reduce queue size and increase send timeout to make it easier
    # to trigger queue-full behavior deterministically.
    old_max = getattr(calls_minimal, "SEND_QUEUE_MAXSIZE", None)
    old_timeout = getattr(calls_minimal, "SEND_TIMEOUT", None)
    calls_minimal.SEND_QUEUE_MAXSIZE = 2
    calls_minimal.SEND_TIMEOUT = 5

    try:
        with client.websocket_connect(uri) as ws:
            # Wait up to 1s for the connection to be registered in the manager
            start = time.time()
            conn = None
            while time.time() - start < 1.0:
                conn = calls_minimal.manager._conns.get(session_id)
                if conn is not None:
                    break
                time.sleep(0.05)
            assert conn is not None, "manager connection not registered"
            queue = conn["queue"]

            # Fill the queue to capacity
            import asyncio as _asyncio
            while True:
                try:
                    queue.put_nowait("__fill__")
                except _asyncio.QueueFull:
                    break

            qsize_before = queue.qsize()
            assert qsize_before == queue.maxsize

            # Directly invoke manager.send to deterministically trigger QueueFull handling
            import asyncio as _asyncio
            _asyncio.run(calls_minimal.manager.send(session_id, "drop-trigger"))

            # Give the server a moment to log
            time.sleep(0.1)

            qsize_after = queue.qsize()
            # The queue must still be full (no new item inserted)
            assert qsize_before == qsize_after, f"Queue size changed: before {qsize_before} after {qsize_after}"

    finally:
        # Restore values
        if old_max is not None:
            calls_minimal.SEND_QUEUE_MAXSIZE = old_max
        if old_timeout is not None:
            calls_minimal.SEND_TIMEOUT = old_timeout

    # Assert that server logged a queue-full warning at least once
    assert any("Send queue full" in rec.getMessage() for rec in caplog.records), f"No 'Send queue full' in logs: {caplog.records}"


if __name__ == "__main__":
    pytest.main(["-q", "backend/test_websocket_backpressure_e2e.py"])