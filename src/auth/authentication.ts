import express from "express";
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UnAuthorizedError } from "../core/apiError";
import validator, { RequestType } from "../helper/validator";
import schema from "./schema";
import { getAccessToken, tokenVerification } from "./authUtils";
import { validate } from "../core/JWT";
import redis from "../database/redisClient";
import { UnAuthorizedError } from "../core/apiError";
const router = express.Router();
export default router.use(
  validator(schema.auth, RequestType.HEADER),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.accessToken = getAccessToken(req.headers.authorization);
      const playload = await validate(req.accessToken);
      tokenVerification(playload);
      const userId = redis.getKey(playload.prm);
      if (!userId) {
        throw new UnAuthorizedError();
      }
      return next();
    } catch (err: any) {
      throw err;
    }
  },
);
