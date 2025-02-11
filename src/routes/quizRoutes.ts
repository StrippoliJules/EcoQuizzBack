import { Router } from "express";
import { getQuizQuestions, saveQuizResult } from "../controllers/quizController";
import authenticate from "../middlewares/authMiddleware";

const router = Router();

router.get("/questions", authenticate, getQuizQuestions);
router.post("/result", authenticate, saveQuizResult);

export default router;
