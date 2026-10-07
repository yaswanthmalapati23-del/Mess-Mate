from http.server import BaseHTTPRequestHandler, HTTPServer
import sys

class CaptivePortalHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Intercept every single request and force-feed the custom payload
        self.send_response(200)
        self.send_header("Content-type", "text/html")
        # Prevent the device from caching the page
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate")
        self.end_headers()
        
        # The raw visual payload that forces itself onto their screens
        html_payload = """
        <!DOCTYPE html>
        <html>
        <head>
            <title>Security Alert</title>
            <style>
                body { background-color: #050505; color: #00FF00; font-family: 'Courier New', monospace; text-align: center; padding-top: 15%; margin: 0; overflow: hidden; }
                .matrix { font-size: 2.5rem; font-weight: bold; animation: blink 1s infinite; }
                @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
            </style>
        </head>
        <body>
            <div class="matrix">⚠️ MESA SECURITY OVERRIDE ⚠️</div>
            <p style="font-size: 1.2rem; color: #888;">UNAUTHORIZED ACCESS DETECTED ON THIS WI-FI SEGMENT</p>
            <p>Device Handshake: Successful. Screen Lock: Inhibited.</p>
        </body>
        </html>
        """
        self.wfile.write(bytes(html_payload, "utf-8"))

    # Silence internal terminal logging to keep the script running fast
    def log_message(self, format, *args):
        return

if __name__ == "__main__":
    # Standard HTTP port for web traffic interception
    server = HTTPServer(('0.0.0.0', 80), CaptivePortalHandler)
    print("Captive Portal Hijack Active... Awaiting autonomous device handshakes.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        sys.exit(0)