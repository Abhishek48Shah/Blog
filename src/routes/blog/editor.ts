import express from "express";
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import authentication from "../../auth/authentication";
const router = express.Router();
router.use(authentication);
router.post("/new", (req: Request, res: Response, next: NextFunction) => {
  try {
    res.send("hello world");
  } catch (err: any) {
    return next(err);
  }
});
export default router;
