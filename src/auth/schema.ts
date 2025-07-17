import joi from "joi";
import { JoiCookie, AuthBearer } from "../helper/validator";
export default {
  auth: joi.Object().keys({
    authorization: AuthBearer().required(),
  }),
  cookie: joi.Object().keys({
    refreshToken: cookieJoiCookie().required(),
  }),
};
