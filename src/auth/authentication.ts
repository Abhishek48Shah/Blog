import express from "express";
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UnAuthorizedError } from "../core/apiError";
import validator from "../helper/validator";
import schema from "./schema";
const router = express.Router();
export default router.use(
  validator(schema.auth),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers["authorization"];
      if (!authHeader) {
        throw new UnAuthorizedError("Unauthorized, Please login and retry");
      }
      const token = authHeader.split(" ")[1];
      if (!token) {
        throw new UnAuthorizedError("Unauthorized, Please login and retry");
      }
      console.log(token);
      next();
    } catch (err: any) {
      next(err);
    }
  },
);
