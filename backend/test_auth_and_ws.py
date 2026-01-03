import json
import uuid
import pytest

try:
    import sqlalchemy  # type: ignore
    SQLALCHEMY_AVAILABLE = True
except Exception:
    SQLALCHEMY_AVAILABLE = False

from fastapi.testclient import TestClient
from backend.app.main import app

pytestmark = pytest.mark.skipif(not SQLALCHEMY_AVAILABLE, reason="SQLAlchemy not available in environment; skip auth tests")

client = TestClient(app)


def test_signup_and_login_roundtrip():
    username = f"user_{uuid.uuid4().hex[:6]}"
    email = f"{username}@example.com"
    password = "secret123"

    # Sign up
    r = client.post("/auth/signup", json={"username": username, "email": email, "password": password})
    assert r.status_code == 200
    data = r.json()
    assert "access_token" in data

    # Login
    r2 = client.post("/auth/login", data={"username": username, "password": password})
    assert r2.status_code == 200
    data2 = r2.json()
    assert "access_token" in data2


def test_websocket_accepts_valid_jwt():
    username = f"user_{uuid.uuid4().hex[:6]}"
    email = f"{username}@example.com"
    password = "secret123"

    r = client.post("/auth/signup", json={"username": username, "email": email, "password": password})
    token = r.json()["access_token"]

    session_id = str(uuid.uuid4())
    uri = f"/call/stream?session_id={session_id}&create_if_missing=true"

    headers = {"Authorization": f"Bearer {token}"}
    with client.websocket_connect(uri, headers=headers) as ws:
        ws.send_text(json.dumps({"transcript": "Please wire transfer money urgently"}))
        data = json.loads(ws.receive_text())
        assert data.get("user") == username


def test_websocket_rejects_invalid_jwt():
    bad_token = "this.is.not.a.jwt"
    session_id = str(uuid.uuid4())
    uri = f"/call/stream?session_id={session_id}&create_if_missing=true"
    headers = {"Authorization": f"Bearer {bad_token}"}

    with pytest.raises(Exception):
        with client.websocket_connect(uri, headers=headers) as ws:
            # connection should be closed immediately by the server
            pass
