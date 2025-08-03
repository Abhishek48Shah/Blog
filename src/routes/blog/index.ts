import createRateLimiter, { roleLimiters } from "../helper/rateLimiter";
import asyncWrapper from "../../helper/asyncWrapper";
import Blog from "../database/model/Blog";
import { SuccessResponse } from "../../core/apiResponse";
import Blog from "../../database/model/Blog";
import express from "express";
import editor from "./editor";
import writer from "./writer";
const adminLimiter = createRateLimiter(roleLimiters.admin);
const writerLimiter = createRateLimiter(roleLimiters.writer);
const readerLimiter = createrRateLimiter(roleLimiters.reader);
const router = express.Router();
router.use("/admin/", adimnLimiter, admin);
router.use("/writer", writerLimiter, writer);
router.get(
  "/",
  asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {}),
);
export default router;
