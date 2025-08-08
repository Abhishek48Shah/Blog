import express from "express";
import type { Request, Response, NextFunction } from "express";
import asyncWrapper from "../../helper/asyncWrapper";
import validator, { RequestType } from "../../helper/validator";
import authentication from "../../auth/authentication";
import authorization from "../../auth/authorization";
import { RoleType } from "../../helper/role";
import follow from "../../database/model/follow";
import { SuccessMsgResponse, SuccessResponse } from "../../core/apiResponse";
import schema from "./schema";
const router = express.Router();
router.use(authentication);
router.use(authorization(RoleType.WRITER));
router.post(
  "/following/:userId",
  validator(schema.params, RequestType.PARAMS),
  asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const targetUserId = parseInt(req.params.userId, 10);
    console.log(targetUserId);
    if (typeof targetUserId === "number") {
      console.log("yes bitch it is ");
    }
    const currentUserId = req.user.id;
    await follow.addFollow(currentUserId, targetUserId);
    new SuccessMsgResponse("Successfully followed user").send(res);
  }),
);
router.get(
  "/followers",
  asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const followersList = await follow.getFollowers(req.user.id);
    console.log(followersList);
    new SuccessResponse(
      "Successfully get the followers list",
      followersList,
    ).send(res);
  }),
  router.get(
    "/get/following",
    asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const followingList = await follow.getFollowing(req.user.id);
      console.log(followingList);
      new SuccessResponse(
        "Successfully get the following list",
        followingList,
      ).send(res);
    }),
  ),
);
export default router;
