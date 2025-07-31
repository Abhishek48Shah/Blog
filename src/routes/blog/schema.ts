import joi from "joi";
import { JoiParams, JoiQuery } from "../../helper/validator";
const schema = {
  body: joi.object().keys({
    title: joi.string().min(3).max(255).required(),
    content: joi.string().min(3).max(2048).required(),
    status: joi.string().required(),
    id: joi.number().required(),
  }),
  params: joi.object().keys({
    id: JoiParams().required(),
  }),
  query: joi.object().keys({
    blog: JoiQuery().required(),
  }),
};
export default schema;
