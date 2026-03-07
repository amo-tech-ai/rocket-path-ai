#!/usr/bin/env python3
"""Simple HTTP server with no-cache headers."""
import http.server
import os

class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

os.chdir('/home/sk/startupai16L/packages/remotion/out')
http.server.HTTPServer(('0.0.0.0', 9999), NoCacheHandler).serve_forever()
