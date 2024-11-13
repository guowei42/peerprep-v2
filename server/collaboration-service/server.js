const { Server } = require("socket.io");
const http = require("http");

const port = process.env.PORT || 3004;

const server = http.createServer();
const io = new Server(server, {
  path: "/collaboration",
  cors: {
    origin: ["http://localhost:3000", "https://peerprep-nine.vercel.app"],
    methods: "GET, POST, DELETE, PUT, PATCH",
    allowedHeaders:
      "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cookie",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.on("match_found", async ({ userId, partnerId, roomId }) => {
    const roomName = `${roomId}`;
    console.log(`User ${userId} joined room ${roomName}`);
    socket.join(roomName);
  });

  socket.on("code_change", ({ roomId, code }) => {
    const roomName = `${roomId}`;
    console.log(`Code update in room ${roomName}: ${code}`);
    socket.to(roomName).emit("code_update", code);
  });

  socket.on("disconnect", (reason, details) => {
    console.log("Client disconnected");
    if (socket.active) {
      console.log("Reconnecting Attempt", socket);
    } else {
      console.log("Reason", reason);
      if (details && details.message) {
        console.log("Message", details.message);
      }
      if (details && details.description) {
        console.log("Description", details.description);
      }
      if (details && details.context) {
        console.log("Context", details.context);
      }
    }
  });
});

// Start WebSocket server
server.listen(port, () => {
  console.log("Collaboration service WebSocket listening on port " + port);
});
