import express from "express";
import type { Request, Response, NextFunction } from "express";
import asyncWrapper from "../../helper/asyncWrapper";
import validator, { RequestType } from "../../helper/validator";
import authentication from "../../auth/authentication";
import authorization from "../../auth/authorization";
import { RoleType } from "../../helper/role";
import schema from "./schema";
import Blog from "../../database/model/Blog";
import { SuccessMsgResponse, SuccessResponse } from "../../core/apiResponse";
const router = express.Router();
router.use(authentication);
router.use(authorization(RoleType.WRITER));
router.post(
  "/new",
  validator(schema.body),
  asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    await Blog.createNew(req.body);
    new SuccessMsgResponse("Blog created successfully").send(res);
  }),
);
router.delete(
  "/delete/:id",
  validator(schema.params, RequestType.PARAMS),
  asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    await Blog.delete(parseInt(id, 10));
    new SuccessMsgResponse("Blog deleted successfully").send(res);
  }),
);
router.patch(
  "/edit/:id",
  validator(schema.params, RequestType.PARAMS),
  validator(schema.body),
  asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { title, body, status } = req.body;
    const value = {};
    if (title) value.title = title;
    if (body) value.body = body;
    if (status) value.status = status;
    await Blog.edit(parseInt(id, 10), value);
    new SuccessMsgResponse("Blog edit successfully").send(res);
  }),
);
router.get(
  "/all",
  asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const blog = await Blog.getAll_By_UserId(req.user.id);
    new SuccessResponse("Successfully get all the blog", blog).send(res);
  }),
);

router.get(
  "/draft",
  asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const data = await Blog.get_all_Draft(req.user.id);
    new SuccessResponse("Successfully get all the drafts blog", data).send(res);
  }),
);
router.get(
  "/feeds",
  asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    let randomBlog;
    const blog = await Blog.getFeeds(req.user.id);
    const length = blog.length;
    //      if (length < 100) {
    //	  randomBlog = await Blog.getRandom_Blog()
    //  }
    console.log(blog);
    new SuccessResponse(blog).send(res);
  }),
);
export default router;
