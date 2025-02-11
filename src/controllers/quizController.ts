import { Request, Response } from "express";
import QuizQuestion from "../models/quizModel";
import User from "../models/userModel";
import mongoose from "mongoose";

interface AuthenticatedRequest extends Request {
    user: string;
  }

export const getQuizQuestions = async (req: Request, res: Response) => {
  try {
    const questions = await QuizQuestion.find().sort({ ordre: 1 });
    res.status(200).json({ questions });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des questions du quiz" });
  }
};

export const saveQuizResult = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).user;
    console.log(userId);
    const { impact } = req.body;
    if (typeof impact !== "number") {
      return res.status(400).json({ error: "La valeur de l'impact est requise et doit être un nombre." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    user.quiz_history.push({ impact, date: new Date() });
    await user.save();

    res.status(200).json({ message: "Résultat du quiz sauvegardé avec succès" });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la sauvegarde du résultat du quiz" });
  }
};
