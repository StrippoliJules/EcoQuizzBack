import { Router } from "express";
import validateRequest from "../middlewares/validateRequest";
import authMiddleware from "../middlewares/authMiddleware";
import { createReservation, getCurrentReservation, getLockerReservations, getPendingReservations, leaveReservation, terminateReservation, validateOrRefuseReservation,  } from "../controllers/reservationController";
import { createReservationSchema } from "../schemas/reservation/createReservationSchema";
import { validateReservationSchema } from "../schemas/reservation/validateReservationSchema";
import { terminateReservationSchema } from "../schemas/reservation/terminateReservationSchema";
import { leaveReservationSchema } from "../schemas/reservation/leaveReservationSchema";

const router = Router();

router.post("/create", validateRequest(createReservationSchema), authMiddleware, createReservation);
router.get("/pendingReservation", authMiddleware, getPendingReservations);
router.patch("/validateOrRefuse", authMiddleware, validateRequest(validateReservationSchema), validateOrRefuseReservation);
router.patch("/terminateReservation", authMiddleware, validateRequest(terminateReservationSchema), terminateReservation);
router.get("/getCurrentReservation", authMiddleware, getCurrentReservation);
router.get("/getLockerReservations/:lockerId", authMiddleware, getLockerReservations);
router.patch("/leaveReservation", authMiddleware, validateRequest(leaveReservationSchema) ,leaveReservation);

export default router;