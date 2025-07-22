import type { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { BadRequestError, UnAuthorizedError } from "../core/apiError";
import logger from "../logger";
export enum RequestType {
  BODY = "body",
  HEADERS = "headers",
}
export const JoiAuthBearer = () => {
  return Joi.string().custom((value, helpers) => {
    if (!value.startsWith("Bearer")) return helpers.error("any.invalid");
    if (!value.split(" ")[1]) return helpers.error("any.invalid");
    return value;
  }, "Jwt token validation");
};
export const JoiCookie = () => {
  return Joi.string().custom((value, helpers) => {
    if (!value.startsWith("refreshToken")) return helpers.error("any.invalid");
    if (!value.split("=")[1]) return helpers.error("any.invalid");
    console.log(value);
    return value;
  }, "Cookie Validation ");
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
