import express from "express";
import type { Request, Response, NextFunction } from "express";
import asyncWrapper from "../../helper/asyncWrapper";
const router = express.Router();
router.post(
  "/",
  asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {}),
);
export default router();
