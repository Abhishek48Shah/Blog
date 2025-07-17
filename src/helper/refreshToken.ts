import crypto from "node:crypto";
import { database } from "../database/redisClient";
import { UnAuthorizedError, InternalError } from "../core/apiError";
export const verifyToken = async (token: string) => {
  const storedToken = await database.getToken(token);
  if (!storedToken) {
    throw new UnAuthorizedError("Your session is expired, Please login");
  }
  return storedToken;
};
export const generateToken = async (userId: number) => {
  const token = crypto.randomBytes(32).toString("hex");
  const result = await database.saveToken(token, userId);
  return token;
};
export const removeToken = async (token: string) => {
  const isRemove = await database.removeToken(token);
  if (!isRemove) {
    throw new InternalError("Internal server error");
  }
};
