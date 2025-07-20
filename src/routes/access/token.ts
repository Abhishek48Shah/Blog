import express from "express";
import type { Request, Response, NextFunction } from "express";
import crypto from "node:crypto";
import logger from "../../core/logger";
import { SuccessResponse } from "../../core/apiResponse";
import validator, {
  cookieValidator,
  RequestType,
} from "../../helper/validator";
import schema from "./schema";
import { PrismaClient } from "@prisma/client";
import { createToken } from "../../auth/authUtils";
const router = express.Router();
const prisma = new PrismaClient();
router.post(
  "/token",
  validator(schema.cookie, RequestType.COOKIE),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies?.refreshToken;
      const userId = await verifyToken(token);
      const user = await prisma.User.findUnique({ where: { id: userId } });
      const accessTokenHex = await crypto.randomBytes(32).toString("hex");
      const refreshTokenHex = await crypto.randomBytes(32).toString("hex");
      const { accessToken, refreshToken } = await createToken(
        user,
        accessTokenHex,
        refreshTokenHex,
      );
      await removeToken(token);
      await database.saveKey(refreshToken, userId);
      new SuccessResponse("Token access successfully", {
        token: accessToken,
        userId: user.id,
      }).send(res);
    } catch (err: any) {
      logger.error(err);
      return next(err);
    }
  },
);
export default router;
