import { Router } from "express";
import validateRequest from "../middlewares/validateRequest";
import { createLocalisation, getLocalisations } from "../controllers/localisationController";
import { createLocalisationSchema } from "../schemas/localisation/createLocalisationSchema";
import authMiddleware from "../middlewares/authMiddleware";

const router = Router();

router.post("/create", validateRequest(createLocalisationSchema), authMiddleware, createLocalisation);
router.get("/", authMiddleware, getLocalisations);

export default router;