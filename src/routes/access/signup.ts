import express from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import type { Request, Response, NextFunction } from "express";
import crypto from "node:crypto";
import schema from "./schema";
import validator from "../../helper/validator";
import { RoleType } from "../../helper/role";
import { database } from "../../database/redisClient";
import { SuccessResponse } from "../../core/apiResponse";
import { BadRequestError } from "../../core/apiError";
import logger from "../../core/logger";
const router = express.Router();
const prisma = new PrismaClient();
router.post(
  "/basic",
  validator(schema.signup),

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userInput = req.body;
      const isUser = await prisma.User.findUnique({
        where: { email: userInput.email },
      });
      if (isUser) throw new BadRequestError("User already exist");
      const hashedPassword = await bcrypt.hash(userInput.password, 10);
      const user = await prisma.User.create({
        data: {
          username: userInput.username,
          email: userInput.email,
          password: hashedPassword,
          role: RoleType.GUEST,
        },
      });
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
      return next(err);
    }
  },
);
export default router;
