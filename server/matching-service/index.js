const { Server } = require("socket.io");
const redis = require("redis");
const http = require("http");

const server = http.createServer();
const io = new Server(server);
const redisClient = redis.createClient();

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

    socket.on("requestMatch", async ({ userId, topic, difficulty }) => {
        socket.userId = userId;
        socket.topic = topic;
        socket.difficulty = difficulty;

        await redisClient.rPush(`${topic}`, JSON.stringify({ userId, difficulty }));

        const timeoutId = setTimeout(async () => {
            removeUser(userId, topic, difficulty)
            socket.emit("matchUpdate", { status: "timeout", message: "No match found within 30 seconds." });
            await redisClient.lRem(`${topic}`, 1, JSON.stringify({ userId, difficulty }));
        }, 30000);

        const match = await findMatch(userId, topic, difficulty);
        if (match) {
            clearTimeout(timeoutId); 
            socket.emit("matchUpdate", { status: "match_found", userId: userId, partnerId: match.userId }); 
            const matchedSocket = findSocketByUserId(match.userId);
            if (matchedSocket) {
                matchedSocket.emit("matchUpdate", { status: "match_found", userId: match.userId, partnerId: userId });
            }
            await removeUser(userId, topic, difficulty);   
        }
    });

    socket.on("disconnect", async () => {
        const { userId, topic, difficulty } = socket;
        await removeUser(userId, topic, difficulty);
        console.log(`Client disconnected: ${socket.id}`);
    });
});

function findSocketByUserId(userId) {
    for (let [id, socket] of io.of("/").sockets) {
        if (socket.userId === userId) {
            return socket;
        }
    }
    return null;
}

async function removeUser(userId, topic, difficulty) {
  const user = '{"userId":"' + userId + '","difficulty":"' + difficulty + '"}'
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

// Start WebSocket server
server.listen(3003, () => {
    console.log("WebSocket server running on http://localhost:3003");
});