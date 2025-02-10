import Joi from "joi";

export const terminateReservationSchema = Joi.object({
    reservationId: Joi.string().required()
});