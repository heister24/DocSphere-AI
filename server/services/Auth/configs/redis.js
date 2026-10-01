import { Redis } from "ioredis";
import "dotenv/config";

const redis = new Redis(process.env.REDIS_URI);

redis.on("connect", () => {
  console.log("Redis connecting");
});

redis.on("error", (error) => {
  console.log("Redis error:" + error);
});

export default redis;
