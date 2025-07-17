import express from "express";
import type { Reuqest, Response, NextFunction } from "express";
import validator, { ResponseType } from "../core/validator";
import schema from "./schema";
const router = express.Router();
export default router.use(
  validator(schema.cookie, ResponseType.COOKIE),
  (req: Request, res: Response, next: NextFunction) => {
    req.refreshToken = getCookie(req.headers.cookie);
    try {
    } catch (err: any) {
      next(err);
    }
  },
);
