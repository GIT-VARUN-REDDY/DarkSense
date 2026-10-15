import http.server
import socketserver
import urllib.request
import json
import os

PORT = int(os.environ.get("PORT", 8080))
NGROK_TARGET = "https://cupid-elope-plaything.ngrok-free.dev"

class ProxyHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Prevent aggressive browser caching of app.js/index.html
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_POST(self):
        # Proxy /api/chat requests directly to the ngrok server to eliminate all browser CORS blocks
        if self.path.startswith('/api/chat'):
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)

            targets = [
                f"http://127.0.0.1:11434{self.path}",
                f"{NGROK_TARGET}{self.path}"
            ]

            success = False
            last_err = None

            for target_url in targets:
                print(f"[PROXY] Trying {target_url} ({len(body)} bytes)...")
                req = urllib.request.Request(
                    target_url,
                    data=body,
                    headers={
                        'Content-Type': 'application/json',
                        'ngrok-skip-browser-warning': 'true',
                        'User-Agent': 'DarkSenseClient/1.0'
                    },
                    method='POST'
                )

                try:
                    with urllib.request.urlopen(req, timeout=45) as resp:
                        resp_data = resp.read()
                        print(f"[PROXY] Received {len(resp_data)} bytes from {target_url}")
                        self.send_response(resp.status)
                        self.send_header('Content-Type', 'application/json; charset=utf-8')
                        self.end_headers()
                        self.wfile.write(resp_data)
                        success = True
                        break
                except Exception as e:
                    print(f"[PROXY WARN] {target_url} failed: {e}")
                    last_err = e

            if not success:
                print(f"[PROXY ERROR] All endpoints failed: {last_err}")
                self.send_response(502)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                err_payload = json.dumps({"error": str(last_err)}).encode('utf-8')
                self.wfile.write(err_payload)
        else:
            super().do_POST()

if __name__ == '__main__':
    # Serve current directory files
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), ProxyHandler) as httpd:
        print(f"DarkSense server running at http://localhost:{PORT}")
        httpd.serve_forever()
