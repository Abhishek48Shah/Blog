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
export const database = {
  saveKey: async (token: string, id: number) => {
    await redisClient.set(`token:${token}`, id, { EX: 604800 });
  },
  getToken: async (token: string) => {
    return await redisClient.get(`token:${token}`);
  },
  removeToken: async (token: string) => {
    return await redisClient.del(`token:${token}`);
  },
};
