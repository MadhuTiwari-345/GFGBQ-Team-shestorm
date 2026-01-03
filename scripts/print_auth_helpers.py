import sys
sys.path.insert(0, r"C:\Users\merino\Downloads\GFGBQ-Team-shestorm")
import importlib
mod = importlib.import_module('backend.routes.auth')
print('has _test_helpers:', hasattr(mod, '_test_helpers'))
print('helpers:', getattr(mod, '_test_helpers', None))
