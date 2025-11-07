import { createClient } from 'redis';

const redisClient = createClient({
  username: process.env.REDIS_USER_NAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    reconnectStrategy: (retries) => {
      console.log(`Trying redis connection ${retries} time`)
      if (retries > 5) {
        console.log("❌ Redis reconnect limit reached");
        return new Error("Redis connection failed");
      }
      return 1000; // retry after 1 sec
    }
  },
});
redisClient.on("connect", () => console.log("🔌 Redis attempting connection..."));
redisClient.on("ready", () => console.log("✅ Redis is ready"));
redisClient.on("reconnecting", () => console.log("🔁 Reconnecting to Redis..."));
redisClient.on("end", () => console.log("❌ Redis connection closed"));
redisClient.on("error", (err) => console.log("Redis Error:", err));
async function initRedis() {
  if (!redisClient.isOpen) {
    try {
      await redisClient.connect();
      console.log("✅ Redis connected");
    } catch (err) {
      console.log("Error in redis connection: ", err);
    }

  }
}


initRedis().then(async () => {
  try {
    await redisClient.ping();
    console.log("✅ Redis ping success");
  } catch (err) {
    console.error("❌ Redis ping failed", err);
  }
});


initRedis();

export default redisClient;
