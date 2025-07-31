import express from "express";
import type { Request, Response, NextFunction } from "express";
import asyncWrapper from "../../helper/asyncWrapper";
import validator, {
  cookieValidator,
  RequestType,
} from "../../helper/validator";
import { getRefreshToken, tokenVerification } from "../../auth/authUtils";
import redis from "../../database/redisClient";
import schema from "../../auth/schema";
import { validate } from "../../core/JWT";
import { SuccessMsgResponse } from "../../core/apiResponse";
const router = express.Router();
router.post(
  "/user",
  validator(schema.cookie, RequestType.HEADERS),
  asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const token = await getRefreshToken(req.headers.cookie);
    const payload = await validate(token);
    tokenVerification(payload);
    await redis.removeKey(payload.prm);
    new SuccessMsgResponse("Logout successfull").send(res);
  }),
);
export default router;
