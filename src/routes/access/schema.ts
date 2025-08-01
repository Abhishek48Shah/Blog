import joi from "joi";
import { JoiCookie } from "../../helper/validator";
const schema = {
  signup: joi.object().keys({
    username: joi.string().min(3).max(30).required(),
    email: joi.string().email().required(),
    password: joi.string().min(8).required(),
  }),
  credential: joi.object().keys({
    email: joi.string().email().required(),
    password: joi.string().min(8).required(),
  }),
};
export default schema;
