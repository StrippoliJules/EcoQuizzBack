import { Router } from "express";
import { getQuizHistory, getDefiHistory } from "../controllers/userHistoryController";
import authenticate from "../middlewares/authMiddleware";

const router = Router();

router.get("/quiz-history", authenticate, getQuizHistory);
router.get("/defi-history", authenticate, getDefiHistory);

export default router;
