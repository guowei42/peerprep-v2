const { Server } = require("socket.io");
const redis = require("redis");
const http = require("http");
const { randomUUID } = require("crypto");

const port = process.env.PORT || 3003;
const redis_url = process.env.REDIS_URL;

const server = http.createServer();
const io = new Server(server, {
  path: "/matching",
  cors: {
    origin: ["http://localhost:3000", "https://peerprep-nine.vercel.app"],
    methods: "GET, POST, DELETE, PUT, PATCH",
    allowedHeaders:
      "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cookie",
    credentials: true,
  },
});

const redisClient = redis.createClient({
  url: redis_url,
});

async function connectRedis() {
  try {
    await redisClient.connect();
    console.log("Connected to Redis");
  } catch (err) {
    console.error("Redis connection error:", err);
  }
}

connectRedis();

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);
  
  socket.onAny((event, ...args) => {
    console.log(`Received event: ${event}`, args);
  });

  socket.on("requestMatch", async ({ userId, topic, difficulty }) => {
    console.log(`Logging request`);
    socket.userId = userId;
    socket.topic = topic;
    socket.difficulty = difficulty;

    await redisClient.rPush(`${topic}`, JSON.stringify({ userId, difficulty }));
    console.log("Requesing match", topic, userId, difficulty)

    socket.timeoutId = setTimeout(async () => {
      removeUser(userId, topic, difficulty);
      socket.emit("matchUpdate", {
        status: "timeout",
        message: "No match found within 30 seconds.",
      });
      await redisClient.lRem(
        `${topic}`,
        1,
        JSON.stringify({ userId, difficulty })
      );
    }, 30000);

    const match = await findMatch(userId, topic, difficulty);
    console.log("finding match", topic, userId, difficulty)
    if (match) {
      clearTimeout(socket.timeoutId);
      const room_id = randomUUID();
      var temp_difficulty = difficulty;
      if (temp_difficulty === null) {
        temp_difficulty = "Easy";
      }
      socket.emit("matchUpdate", {
        status: "match_found",
        userId: userId,
        partnerId: match.userId,
        roomId: room_id,
        difficulty: temp_difficulty,
      });
      const matchedSocket = findSocketByUserId(match.userId);
      if (matchedSocket) {
        clearTimeout(matchedSocket.timeoutId);
        matchedSocket.emit("matchUpdate", {
          status: "match_found",
          userId: match.userId,
          partnerId: userId,
          roomId: room_id,
          difficulty: temp_difficulty,
        });
      }
      await removeUser(userId, topic, difficulty);
    }
  });

    socket.on("disconnect", async () => {
        const { userId, topic, difficulty } = socket;
        await removeUser(userId, topic, difficulty);
        socket.removeAllListeners();
        console.log(`Client disconnected: ${socket.id}`);
    });

    socket.on("clearQueue", async () => {
        let msg = await clearQueue_FOR_TESTING();
        socket.emit("clearedQueue", msg);
    });
});

function findSocketByUserId(userId) {
  // eslint-disable-next-line no-unused-vars
  for (let [id, socket] of io.of("/").sockets) {
    if (socket.userId === userId) {
      return socket;
    }
  }
  return null;
}

async function removeUser(userId, topic, difficulty) {
  const user = '{"userId":"' + userId + '","difficulty":"' + difficulty + '"}';
  await redisClient.lRem(`${topic}`, 1, user);
}

async function findMatch(userId, topic, difficulty) {
  const users = await redisClient.lRange(`${topic}`, 0, -1);

  for (const user of users) {
    const parsedUser = JSON.parse(user);
    if (parsedUser.userId !== userId && parsedUser.difficulty === difficulty) {
      await redisClient.lRem(`${topic}`, 1, user);
      return parsedUser;
    }
  }

  // If no difficulty match, match by topic
  for (const user of users) {
    const parsedUser = JSON.parse(user);
    if (parsedUser.userId !== userId) {
      await redisClient.lRem(`${topic}`, 1, user);
      return parsedUser;
    }
  }

  return null;
}

async function clearQueue_FOR_TESTING() {
    if (process.env.ENV === "TEST") {
        console.log("Clearing queue");
        await redisClient.flushDb("SYNC", () => {});
        return "Queue cleared!";
    } else {
        return "Not in test environment; did not clear";
    }
}

// Start WebSocket server
server.listen(port, () => {
  console.log("Matching service WebSocket listening on port " + port);
});
