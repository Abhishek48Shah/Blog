import express from "express";
import bcrypt from "bcrypt";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import validator from "../../helper/validator";
import schema from "./schema";
import { NotFoundError, AuthFailureError } from "../../core/apiError";
import { SuccessResponse } from "../../core/apiResponse";
import logger from "../../core/logger";
import redis from "../../database/redisClient";
import { createToken } from "../../auth/authUtils";
import User from "../../database/model/User";
const router = express.Router();
router.post(
  "/basic",
  validator(schema.credential),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await User.getByEmail(req.body.email);
      if (!user) throw new NotFoundError("Email doesn't exit");
      const isMatch = await bcrypt.compare(req.body.password, user.password);
      if (!isMatch)
        throw new AuthFailureError(
          "Password dosen't match, Please try again later",
        );
      const accessTokenHex = await crypto.randomBytes(32).toString("hex");
      const refreshTokenHex = await crypto.randomBytes(32).toString("hex");
      const { accessToken, refreshToken } = await createToken(
        { id: user.id, username: user.username, role: user.role },
        accessTokenHex,
        refreshTokenHex,
      );
      await redis.saveKey(refreshTokenHex, user.id);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 604800 * 1000,
      });
      new SuccessResponse("Login successfull", accessToken).send(res);
    } catch (err: any) {
      logger.info(err);
      return next(err);
    }
  },
);
export default router;
