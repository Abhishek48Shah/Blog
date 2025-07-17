import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import logger from "../../logger";
import type { Request, Response, NextFunction } from "express";
import { SuccessResponse } from "../../core/apiResponse";
import validator, {
  cookieValidator,
  RequestType,
} from "../../helper/validator";
import schema from "./schema";
import {
  verifyToken,
  generateToken,
  removeToken,
} from "../../helper/refreshToken";
dotenv.config();
const router = express.Router();
router.post(
  "/token",
  cookieValidator,
  validator(schema.cookie, RequestType.COOKIE),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies?.refreshToken;
      const userId = await verifyToken(token);
      console.log("I am here after verifying it ", userId);
      const accessToken = jwt.sign(
        { userId: userId },
        process.env.JWT_PRIVATE_KEY,
        { expiresIn: "15min" },
      );
      const refreshToken = await generateToken(parseInt(userId));
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 604800 * 1000,
      });
      await removeToken(token);
      new SuccessResponse("Token access successfully", {
        token: accessToken,
        userId: userId,
      }).send(res);
    } catch (err: any) {
      logger.error(err);
      return next(err);
    }
  },
);
export default router;
