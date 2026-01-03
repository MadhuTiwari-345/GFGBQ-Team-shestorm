# Lazily import routers to avoid requiring optional dependencies at import time.
try:
    from .auth import router as auth
except Exception:
    auth = None

try:
    from .calls import router as calls
except Exception:
    # Fallback: use a minimal calls router (no DB/SQLAlchemy dependencies) for
    # environments where SQLAlchemy or other heavy deps are unavailable.
    try:
        from .calls_minimal import router as calls  # type: ignore
    except Exception:
        calls = None

try:
    from .alerts import router as alerts
except Exception:
    alerts = None

try:
    from .analytics import router as analytics
except Exception:
    analytics = None
