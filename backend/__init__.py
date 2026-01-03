
from __future__ import annotations

import json
from pathlib import Path
import logging
from typing import Optional

__all__ = [
    "app",
    "ai_ml",
    "models",
    "routes",
    "utils",
    "__version__",
    "logger",
    "app_instance",
]

# Configure a package-level logger
logger = logging.getLogger("backend")
logger.addHandler(logging.NullHandler())

# Try to read package version from the repository metadata.json
try:
    _meta_path = Path(__file__).resolve().parents[1] / "metadata.json"
    with _meta_path.open("r", encoding="utf-8") as _f:
        __version__ = json.load(_f).get("version", "0.0.0")
except Exception:
    __version__ = "0.0.0"

# Expose the FastAPI `app` instance if available
try:
    from .app.main import app as app_instance  # type: ignore
except Exception:
    app_instance: Optional[object] = None

# Re-export common subpackages for convenience, but avoid import-time errors
# if optional dependencies are missing (use lazy import to keep test collection
# and simple imports lightweight).

def _import_optional(name: str):
    try:
        module = __import__(f"backend.{name}", fromlist=[name])
    except Exception:
        module = None
    return module

app = _import_optional("app")
ai_ml = _import_optional("ai_ml")
models = _import_optional("models")
routes = _import_optional("routes")
utils = _import_optional("utils")
