try:
    import backend.routes.calls as calls_mod
    print('imported calls_mod OK:', hasattr(calls_mod, 'router'))
    print('router present?', getattr(calls_mod, 'router', None))
except Exception as e:
    print('calls import error:', e)

try:
    import backend.routes as routes_pkg
    print('routes.calls attr:', getattr(routes_pkg, 'calls', None))
except Exception as e:
    print('routes import error:', e)
