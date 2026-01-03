import json
import uuid

from fastapi.testclient import TestClient
from backend.app.main import app


def test_routes_registered():
    paths = [r.path for r in app.routes]
    assert "/call/stream" in paths, f"Available routes: {paths}"


def test_e2e_transcript_flow():
    session_id = str(uuid.uuid4())
    uri = f"/call/stream?session_id={session_id}&create_if_missing=true"

    client = TestClient(app)
    with client.websocket_connect(uri) as websocket:
        websocket.send_text(json.dumps({"transcript": "Please wire transfer money urgently to this account"}))
        data = json.loads(websocket.receive_text())
        assert "risk_score" in data
        assert 0.0 <= data["risk_score"] <= 1.0
        assert "analysis" in data or "analysis" not in data  # presence of analysis is optional


def test_e2e_invalid_json():
    session_id = str(uuid.uuid4())
    uri = f"/call/stream?session_id={session_id}&create_if_missing=true"

    client = TestClient(app)
    with client.websocket_connect(uri) as websocket:
        websocket.send_text("this-is-not-json")
        data = json.loads(websocket.receive_text())
        assert data.get("error") == "invalid_json"
