import joi from "joi";
import { JoiCookie, JoiAuthBearer } from "../helper/validator";
export default {
  auth: joi
    .object()
    .keys({
      authorization: JoiAuthBearer().required(),
    })
    .unknown(true),
  cookie: joi
    .object()
    .keys({
      cookie: JoiCookie().required(),
    })
    .unknown(true), // this will ignore other values except cookie for check
};
