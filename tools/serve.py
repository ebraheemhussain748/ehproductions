import http.server, os, sys
from urllib.parse import urlsplit
ROOT = sys.argv[1]
class H(http.server.SimpleHTTPRequestHandler):
    def __init__(s, *a, **k): super().__init__(*a, directory=ROOT, **k)
    def log_message(s, *a): pass
    def send_head(s):
        u = urlsplit(s.path); p = u.path
        if not p.startswith('/ehproductions/'):
            s.send_error(404); return None
        rel = p[len('/ehproductions/'):] or 'index.html'
        if rel.endswith('/'): rel += 'index.html'
        f = os.path.join(ROOT, rel)
        if not os.path.exists(f) and os.path.exists(f + '.html'): rel += '.html'
        elif not os.path.exists(f): rel = '404.html'
        s.path = '/' + rel + ('?' + u.query if u.query else '')
        return super().send_head()
http.server.ThreadingHTTPServer(('127.0.0.1', 8765), H).serve_forever()
