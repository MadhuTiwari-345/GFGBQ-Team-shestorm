from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import SQLAlchemyError
from backend.routes import auth, calls, alerts, analytics

# Import DB & models resiliently (tests may run without SQLAlchemy installed)
try:
    from backend.app.database import engine
    from backend.app import models
    # Try to create tables if possible
    try:
        if engine is not None and getattr(models, "Base", None) is not None:
            models.Base.metadata.create_all(bind=engine)
    except Exception:
        pass
except Exception:
    engine = None

from backend.app.error_handlers import http_exception_handler, sqlalchemy_exception_handler, general_exception_handler
from backend.app.logging import logger

app = FastAPI(title="Fraud Detection API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add exception handlers
app.add_exception_handler(HTTPException, http_exception_handler)
app.add_exception_handler(SQLAlchemyError, sqlalchemy_exception_handler)
app.add_exception_handler(Exception, general_exception_handler)

if getattr(auth, "router", None):
    app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
if getattr(calls, "router", None):
    app.include_router(calls.router, prefix="/call", tags=["Calls"])
if getattr(alerts, "router", None):
    app.include_router(alerts.router, prefix="/alert", tags=["Alerts"])
if getattr(analytics, "router", None):
    app.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])

# Ensure routes are included even if the routes module changed after import
try:
    import importlib
    # Try to import auth router directly
    try:
        auth_mod = importlib.import_module("backend.routes.auth")
        if getattr(auth_mod, "router", None):
            app.include_router(auth_mod.router, prefix="/auth", tags=["Authentication"])
    except Exception:
        pass

    # Try to import calls router (fallback to calls_minimal)
    try:
        calls_mod = importlib.import_module("backend.routes.calls")
        if getattr(calls_mod, "router", None):
            app.include_router(calls_mod.router, prefix="/call", tags=["Calls"])
    except Exception:
        try:
            calls_min = importlib.import_module("backend.routes.calls_minimal")
            if getattr(calls_min, "router", None):
                app.include_router(calls_min.router, prefix="/call", tags=["Calls"])
        except Exception:
            pass

    # Try alerts and analytics
    try:
        alerts_mod = importlib.import_module("backend.routes.alerts")
        if getattr(alerts_mod, "router", None):
            app.include_router(alerts_mod.router, prefix="/alert", tags=["Alerts"])
    except Exception:
        pass

    try:
        analytics_mod = importlib.import_module("backend.routes.analytics")
        if getattr(analytics_mod, "router", None):
            app.include_router(analytics_mod.router, prefix="/analytics", tags=["Analytics"])
    except Exception:
        pass
except Exception as e:
    # Log import errors to aid debugging route registration (kept permissive for tests)
    try:
        from backend.app.logging import logger
        logger.exception("Failed to include some routers during startup: %s", e)
    except Exception:
        pass

@app.get("/")
def read_root():
    logger.info("Root endpoint accessed")
    return {"message": "Fraud Detection API is running"}
