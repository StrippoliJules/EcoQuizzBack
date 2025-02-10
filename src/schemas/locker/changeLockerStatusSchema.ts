import Joi from "joi";

export const changeLockerStatusSchema = Joi.object({
    id: Joi.string().required(),
    status: Joi.string().required()
});