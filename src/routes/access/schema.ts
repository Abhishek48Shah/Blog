import joi from "joi";
const schema = {
  signup: joi.object().keys({
    username: joi.string().min(3).max(30).required(),
    email: joi.string().email().required(),
    password: joi.string().min(8).required(),
  }),
  credintial: joi.object().keys({
    email: joi.string().email().required(),
    password: joi.string().min(8).required(),
  }),
  cookie: joi.object().keys({
    refreshToken: joi.string().min(64).max(64).required(),
  }),
};
export default schema;
