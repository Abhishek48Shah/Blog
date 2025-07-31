import express from "express";
import { tokenInfo } from "../config";
import { RoleType } from "../../helper/role";
import type { Request, Response, NextFunction } from "express";
import { UnAuthorizedError } from "../core/apiError";
const router = express.Router();
export default (roleCode: RoleType) =>
  (req: Request, res: Response, next: NextFunction) => {
    console.log(req.user);
    if (!req.user || !req.user.role || req.user.role !== roleCode) {
      throw new UnAuthorizedError("Unauthorized access");
    }
    next();
  };
