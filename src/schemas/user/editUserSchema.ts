import Joi from "joi";

export const editUserSchema = Joi.object({
  firstname: Joi.string(),
  lastname: Joi.string(),
});