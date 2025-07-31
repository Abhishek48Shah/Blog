import dotenv from "dotenv";
dotenv.config();
import { createClient } from "redis";
import logger from "../core/logger";
const redisClient = createClient({
  url: process.env.REDIS_URL,
});
redisClient.on("error", (err: any) => {
  console.log(err);
});
(async () => {
  await redisClient.connect();
})();
const redis = {
  saveKey: async (key: string, value: object) => {
    await redisClient.set(`token:${key}`, JSON.stringify(value), {
      EX: 604800,
    });
  },
  getKey: async (key: string) => {
    const value = await redisClient.get(`token:${key}`);
    console.log(value);
    return JSON.parse(value);
  },
  removeKey: async (key: string) => {
    return await redisClient.del(`token:${key}`);
  },
};
export default redis;
