import Joi from "joi";

export const validateReservationSchema = Joi.object({
    reservationId: Joi.string().required(),
    status: Joi.string().valid("accepted", "refused").required()
});