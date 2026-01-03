import importlib
import traceback

try:
    mod = importlib.import_module('backend.routes.auth')
    print('imported auth, has router:', hasattr(mod, 'router'))
except Exception:
    traceback.print_exc()
    raise
