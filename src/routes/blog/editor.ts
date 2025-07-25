import express from "express";
import type { Request, Response, NextFunction } from "express";
import authentication from "../../auth/authentication";
import asyncWrapper from "../../helper/asyncWrapper";
const router = express.Router();
router.use(authentication);
router.post(
  "/editor",
  asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {}),
);
export default router;
