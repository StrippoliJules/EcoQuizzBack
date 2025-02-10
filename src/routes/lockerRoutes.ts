import { Router } from "express";
import validateRequest from "../middlewares/validateRequest";
import { createLockerSchema } from "../schemas/locker/createLockerSchema";
import { changeLockerStatus, createLocker, getAdminLockers, getLockers } from "../controllers/lockerController";
import authMiddleware from "../middlewares/authMiddleware";
import { changeLockerStatusSchema } from "../schemas/locker/changeLockerStatusSchema";

const router = Router();

router.post("/create", validateRequest(createLockerSchema), authMiddleware, createLocker);
router.get("/", authMiddleware, getLockers);
router.get("/adminLockers", authMiddleware, getAdminLockers);
router.patch("/changeStatus", authMiddleware, validateRequest(changeLockerStatusSchema), changeLockerStatus);

export default router;