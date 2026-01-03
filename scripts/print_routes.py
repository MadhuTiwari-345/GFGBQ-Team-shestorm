import sys
sys.path.insert(0, r"C:\Users\merino\Downloads\GFGBQ-Team-shestorm")
import sys
sys.path.insert(0, r"C:\Users\merino\Downloads\GFGBQ-Team-shestorm")
import importlib, traceback

try:
    mod = importlib.import_module('backend.routes.auth')
    print('imported auth module, has router:', hasattr(mod, 'router'))
except Exception:
    traceback.print_exc()

from backend.app.main import app
print('app routes:', [r.path for r in app.routes])
