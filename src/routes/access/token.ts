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
import { PrismaClient } from "@prisma/client";
import {
  createToken,
  getRefreshToken,
  tokenVerification,
} from "../../auth/authUtils";
import { database } from "../../database/redisClient";
import { validate } from "../../core/JWT";
import { AuthFailureError } from "../../core/apiError";
const router = express.Router();
const prisma = new PrismaClient();
router.post(
  "/token",
  validator(schema.cookie, RequestType.HEADERS),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = await getRefreshToken(req.headers.cookie);
      const playload = await validate(token);
      tokenVerification(playload);
      const userId = await database.getToken(playload.prm);
      if (!userId) {
        throw new AuthFailureError();
      }
      const user = await prisma.User.findUnique({ where: { id: userId } });
      const accessTokenHex = await crypto.randomBytes(32).toString("hex");
      const refreshTokenHex = await crypto.randomBytes(32).toString("hex");
      const { accessToken, refreshToken } = await createToken(
        user,
        accessTokenHex,
        refreshTokenHex,
      );
      await database.removeToken(playload.prm);
      await database.saveKey(refreshTokenHex, user.id);
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
