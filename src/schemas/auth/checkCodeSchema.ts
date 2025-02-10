import Joi from "joi";

export const checkCodeSchema = Joi.object({
  email: Joi.string().email().required(),
  code: Joi.string().required(),
});
