import Joi from "joi";
import { JoiParams, JoiQuery } from "../../helper/validator";
const schema = {
  params: Joi.object().keys({
    userId: JoiParams().required(),
  }),
  query: Joi.object().keys({}),
};
export default schema;
