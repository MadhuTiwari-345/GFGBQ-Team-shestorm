try:
    from .user import User
except Exception:
    class User:
        def __init__(self, *args, **kwargs):
            pass

try:
    from .call import Call
except Exception:
    class Call:
        def __init__(self, *args, **kwargs):
            pass

try:
    from .alert import Alert
except Exception:
    class Alert:
        def __init__(self, *args, **kwargs):
            pass
