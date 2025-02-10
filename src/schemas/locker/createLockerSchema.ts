import Joi from "joi";

export const createLockerSchema = Joi.object({
    number: Joi.number().required(),
    localisation: Joi.string().required()
});