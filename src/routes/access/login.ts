import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import schema from "./schema";
import type { Request, Response, NextFunction } from "express";
import validator from "../../helper/validator";
import { generateToken } from "../../helper/refreshToken";
import { NotFoundError, AuthFailureError } from "../../core/apiError";
import { SuccessResponse } from "../../core/apiResponse";
import logger from "../../logger";
dotenv.config();
const router = express.Router();
const prisma = new PrismaClient();
router.post(
  "/basic",
  validator(schema.credintial),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await prisma.User.findUnique({
        where: { email: req.body.email },
      });
      if (!user) throw new NotFoundError("Email doesn't exit");
      logger.info(user.passsword, req.body.password);
      const match = await bcrypt.compare(req.body.password, user.password);
      if (!match)
        throw new AuthFailureError(
          "Password dosen't match, Please try again later",
        );
      const accessToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_PRIVATE_KEY,
        { expiresIn: "15min" },
      );
      const refreshToken = await generateToken(user.id);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 604800 * 1000,
      });
      new SuccessResponse("Login successfull", {
        token: accessToken,
        role: user.role,
      }).send(res);
    } catch (err: any) {
      logger.info(err);
      return next(err);
    }
  },
);
export default router;
