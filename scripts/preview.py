"""Build RobotLab and serve it on this computer for local preview."""
import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from build import build

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--port', type=int, default=8000)
    parser.add_argument('--host', default='127.0.0.1', help='use 0.0.0.0 to open it from an iPad on the same Wi-Fi')
    args = parser.parse_args()
    folder = build('http://localhost:' + str(args.port))
    handler = partial(SimpleHTTPRequestHandler, directory=str(folder))
    with ThreadingHTTPServer((args.host, args.port), handler) as server:
        print('Open http://localhost:' + str(args.port) + '/ — Ctrl+C stops the server.', flush=True)
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass
