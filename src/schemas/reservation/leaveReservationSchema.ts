import Joi from "joi";

export const leaveReservationSchema = Joi.object({
    reservationId: Joi.string().required(),
});