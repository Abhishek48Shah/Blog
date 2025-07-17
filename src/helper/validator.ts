import type { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { BadRequestError, UnAuthorizedError } from "../core/apiError";
import logger from "../logger";
export enum RequestType {
  BODY = "body",
  COOKIE = "cookies",
  HEADER = "headers",
}
export const JoiCookie = () => {
  Joi.string().custom((value, helpers) => {
    if (typeof value !== string) return helpers.error("string.base");
    if (value.length !== 64) return helper.error("any.invalid");
    return value;
  });
};
export default (
    schema: Joi.ObjectSchema,
    source: RequestType = RequestType.BODY,
  ) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error } = schema.validate(req[source]);
      if (!error) return next();
      const { details } = error;
      const message = details
        .map((i) => i.message.replace(/['"]/g, ""))
        .join(",");
      throw new BadRequestError(message);
    } catch (err: any) {
      return next(err);
    }
  };
