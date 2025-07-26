import express from "express";
import bcrypt from "bcrypt";
import type { Request, Response, NextFunction } from "express";
import crypto from "node:crypto";
import schema from "./schema";
import validator from "../../helper/validator";
import redis from "../../database/redisClient";
import { SuccessResponse } from "../../core/apiResponse";
import { BadRequestError } from "../../core/apiError";
import { createToken } from "../../auth/authUtils";
import logger from "../../core/logger";
import User from "../../database/model/User";
const router = express.Router();
router.post(
  "/basic",
  validator(schema.signup),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = req.body;
      const isUser = await User.getByEmail(payload.email);
      if (isUser) throw new BadRequestError("User already exist");
      const hashedPassword = await bcrypt.hash(payload.password, 10);
      const newUserDetails = { ...payload, password: hashedPassword };
      const user = await User.createNew(newUserDetails);
      const accessTokenHex = await crypto.randomBytes(32).toString("hex");
      const refreshTokenHex = await crypto.randomBytes(32).toString("hex");
      const { accessToken, refreshToken } = await createToken(
        user,
        accessTokenHex,
        refreshTokenHex,
      );
      await database.saveKey(refreshTokenHex, user.id);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 604800 * 1000,
      });
      new SuccessResponse("Signup Successfull", accessToken).send(res);
    } catch (err: any) {
      logger.error(err);
      return next(err);
    }
  },
);
export default router;
