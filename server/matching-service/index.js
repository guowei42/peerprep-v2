const express = require("express");
const redis = require("redis");
const { Server } = require("socket.io");
const http = require("http");
const { diffieHellman } = require("crypto");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const client = redis.createClient(); 

async function connectRedis() {
    try {
      await client.connect(); 
      console.log("Connected to Redis");
    } catch (err) {
      console.error("Redis connection error:", err);
    }
  }
  
  connectRedis(); 

app.use(express.json());

app.post("/match", async (req, res) => {
  const { userId, topic, difficulty } = req.body;
  //Key is topic
  await client.rPush(`${topic}`, JSON.stringify({ userId, difficulty }));

  let timeoutId;

  // Introduce a small delay before the first match check
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  timeoutId = setTimeout(async () => {
    const match = await findMatch(userId, topic, difficulty);
    if (!match) {
      await removeUser(userId, topic, difficulty);
      return res.json({ matchFound: false, message: "No match found within 30 seconds." });
    }
  }, 30000);

  // Delay the initial match check to give other users a chance to enter the queue
  await delay(2000); 

  const match = await findMatch(userId, topic, difficulty);
  if (match) {
    clearTimeout(timeoutId); // Clear the timeout if we find a match early
    io.to(match.userId).emit("match", { partnerId: userId });
    return res.json({ matchFound: true, partnerId: match.userId });
  }

});

async function removeUser(userId, topic, difficulty) {
  const user = '{"userId":"' + userId + '","difficulty":"' + difficulty + '"}'
  await client.lRem(`${topic}`, 1, user);
}

async function findMatch(userId, topic, difficulty) {
  const users = await client.lRange(`${topic}`, 0, -1);

  for (const user of users) {
    const parsedUser = JSON.parse(user);
    if (parsedUser.userId !== userId && parsedUser.difficulty === difficulty) {
      await client.lRem(`${topic}`, 1, user); // Remove matched user
      return parsedUser;
    }
  }
  //If no difficulty and topic match, just match by topic.
  for (const user of users) {
    const parsedUser = JSON.parse(user);
    if (parsedUser.userId !== userId) {
      await client.lRem(`${topic}`, 1, user); // Remove matched user
      return parsedUser;
    }
  }
  return null;
}

server.listen(3003, () => {
  console.log("Server is running on http://localhost:3003");
});
