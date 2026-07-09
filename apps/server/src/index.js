const express = require("express");
const cors = require("cors");
const os = require("os");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

const messages = new Map();

// Helper to get local IP (useful for local network testing if running locally)
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

// 1. Endpoint to get network info (mostly for local dev compatibility)
app.get("/api/network-info", (req, res) => {
  res.json({ ip: getLocalIP(), port });
});

// 2. Health check for Railway
app.get("/", (req, res) => {
  res.send("Live Looper Signaling Server is running!");
});

// 3. Signaling endpoints
app.post("/api/signal/:sessionCode/:senderId", (req, res) => {
  const { sessionCode, senderId } = req.params;
  
  let body = "";
  req.on("data", (chunk) => (body += chunk.toString()));
  req.on("end", () => {
    if (!messages.has(sessionCode)) messages.set(sessionCode, []);
    messages.get(sessionCode).push({ senderId, data: JSON.parse(body) });
    res.sendStatus(200);
  });
});

app.get("/api/signal/:sessionCode/:senderId", (req, res) => {
  const { sessionCode, senderId } = req.params;

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    // CORS headers for SSE
    "Access-Control-Allow-Origin": "*",
  });

  // Start from 0 so the client receives the offer that the host ALREADY sent
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
    
    // Optional: cleanup memory when both parties disconnect
    // To keep it simple, we don't aggressively clear it here, 
    // but in a production setup you'd want a TTL for inactive sessions.
  });
});

app.listen(port, () => {
  console.log(`Live Looper Signaling server listening on port ${port}`);
});
