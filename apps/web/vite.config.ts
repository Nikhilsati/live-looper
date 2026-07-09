import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import os from "os";

// Helper to get local IP for the QR code
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "localhost";
}

// A simple in-memory signaling relay for local network testing
function localSignalingPlugin() {
  const messages = new Map<string, any[]>();
  const localIp = getLocalIP();

  return {
    name: "local-signaling",
    configureServer(server: any) {
      server.middlewares.use((req: any, res: any, next: any) => {
        // 1. Endpoint to get the host's local IP so the QR code uses a real network address
        if (req.url === "/api/network-info") {
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ ip: localIp, port: server.config.server.port || 5175 }));
          return;
        }

        // 2. Signaling endpoint
        if (req.url?.startsWith("/api/signal/")) {
          const parts = req.url.split("/");
          const sessionCode = parts[3];
          const senderId = parts[4]; // e.g. "host" or "client"

          // POST: send a message
          if (req.method === "POST") {
            let body = "";
            req.on("data", (chunk: any) => (body += chunk.toString()));
            req.on("end", () => {
              if (!messages.has(sessionCode)) messages.set(sessionCode, []);
              messages.get(sessionCode)!.push({ senderId, data: JSON.parse(body) });
              res.statusCode = 200;
              res.end("ok");
            });
            return;
          }

          // GET: listen for messages via Server-Sent Events (SSE)
          if (req.method === "GET") {
            res.writeHead(200, {
              "Content-Type": "text/event-stream",
              "Cache-Control": "no-cache",
              Connection: "keep-alive",
            });

            // Start from 0 so the client receives the offer that the host ALREADY sent!
            let lastIndex = 0;

            const interval = setInterval(() => {
              const msgs = messages.get(sessionCode) || [];
              if (msgs.length > lastIndex) {
                for (let i = lastIndex; i < msgs.length; i++) {
                  // Only send messages from the OTHER party
                  if (msgs[i].senderId !== senderId) {
                    res.write(`data: ${JSON.stringify(msgs[i].data)}\n\n`);
                  }
                }
                lastIndex = msgs.length;
              }
            }, 200);

            req.on("close", () => {
              clearInterval(interval);
            });
            return;
          }
        }
        next();
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  return {
    plugins: [react(), localSignalingPlugin()],
    server: {
      host: true, // Listen on all network interfaces for mobile access
    },
    base: mode === "production" ? "/live-looper/" : "/",
  };
});
