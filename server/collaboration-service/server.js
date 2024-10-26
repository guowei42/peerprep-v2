const { Server } = require("socket.io");
const http = require("http");

const port = process.env.PORT || 3004;

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
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
  
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Start WebSocket server
server.listen(port, () => {
  console.log("Collaboration service WebSocket listening on port " + port);
});
