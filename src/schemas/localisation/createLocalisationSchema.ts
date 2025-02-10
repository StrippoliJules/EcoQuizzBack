import Joi from "joi";

export const createLocalisationSchema = Joi.object({
    name: Joi.string().required(),
    accessibility: Joi.boolean().required()
});