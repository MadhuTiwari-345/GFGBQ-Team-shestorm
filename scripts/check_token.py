import sys, json
sys.path.insert(0, r"C:\Users\merino\Downloads\GFGBQ-Team-shestorm")
from jose import jwt, JWTError
try:
    from backend.app.config import settings
except Exception:
    class _Dummy:
        secret_key = "test-secret"
        algorithm = "HS256"
    settings = _Dummy()

token = sys.argv[1]
try:
    payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
    print('decoded payload:', payload)
except JWTError as e:
    print('decode error:', e)
except Exception as e:
    print('other error:', e)
