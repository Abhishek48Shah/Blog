import express from "express";
import type { Request, Response, NextFunction } from "express";
import crypto from "node:crypto";
import logger from "../../core/logger";
import { SuccessResponse } from "../../core/apiResponse";
import validator, {
  cookieValidator,
  RequestType,
} from "../../helper/validator";
import schema from "../../auth/schema";
import {
  createToken,
  getRefreshToken,
  tokenVerification,
} from "../../auth/authUtils";
import User from "../../database/model/User";
import redis from "../../database/redisClient";
import { validate } from "../../core/JWT";
import { AuthFailureError } from "../../core/apiError";
const router = express.Router();
router.post(
  "/token",
  validator(schema.cookie, RequestType.HEADERS),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = await getRefreshToken(req.headers.cookie);
      const payload = await validate(token);
      tokenVerification(payload, true);
      const value = await redis.getValue(payload.prm);
      if (!value) {
        throw new AuthFailureError();
      }
      const refreshTokenHex = await crypto.randomBytes(32).toString("hex");
      const { accessToken, refreshToken } = await createToken(
        value,
        refreshTokenHex,
      );
      await redis.removeKey(payload.prm);
      await redis.saveKey(refreshTokenHex, value);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 604800 * 1000,
      });
      new SuccessResponse("Token access successfully", accessToken).send(res);
    } catch (err: any) {
      logger.error(err);
      return next(err);
    }
  },
);
export default router;
