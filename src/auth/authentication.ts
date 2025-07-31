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
  validator(schema.auth, RequestType.HEADERS),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.accessToken = getAccessToken(req.headers.authorization);
      const payload = await validate(req.accessToken);
      tokenVerification(payload);
      if (!payload) {
        throw new UnAuthorizedError();
      }
      req.user = payload.sub;
      return next();
    } catch (err: any) {
      throw err;
    }
  },
);
