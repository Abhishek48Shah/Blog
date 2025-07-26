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
  saveKey: async (token: string, id: number) => {
    await redisClient.set(`token:${token}`, id, { EX: 604800 });
  },
  getValue: async (token: string) => {
    const value = await redisClient.get(`token:${token}`);
    return parseInt(value, 10);
  },
  removeKey: async (token: string) => {
    return await redisClient.del(`token:${token}`);
  },
};
export default redis;
