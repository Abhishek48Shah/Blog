import express from "express";
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UnAuthorizedError } from "../core/apiError";
import validator, { RequestType } from "../helper/validator";
import schema from "./schema";
import { getAccessToken } from "./authUtils";
const router = express.Router();
export default router.use(
  validator(schema.auth, RequestType.HEADER),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      req.accessToken = getAccessToken(req.headers.authorization);
    } catch (err: any) {
      next(err);
    }
  },
);
