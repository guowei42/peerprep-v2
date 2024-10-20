const { Server } = require("socket.io");
const http = require("http");

const port = process.env.PORT || 3004;

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000"
  }
});

io.on("connection", (socket) => {
    socket.on('match_found', async ({ userId, partnerId, roomId }) => {
        const roomName = `${roomId}`;
        socket.join(roomName);
      });

      socket.on("code_change", ({ roomId, code }) => {
         const roomName = `${roomId}`
        socket.to(roomName).emit("code_update", code);
      });
});

// Start WebSocket server
server.listen(port, () => {
    console.log("Matching service WebSocket listening on port " + port);
});
