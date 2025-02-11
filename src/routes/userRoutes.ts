import { Router } from "express";
import {getUser} from "../controllers/userController";
import authMiddleware from "../middlewares/authMiddleware";

const router = Router();

router.get("/:id", authMiddleware, getUser);
router.get("/", authMiddleware);

export default router;