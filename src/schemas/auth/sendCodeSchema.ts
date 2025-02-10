import Joi from "joi";

export const sendCodeSchema = Joi.object({
  email: Joi.string().email().required()
});
