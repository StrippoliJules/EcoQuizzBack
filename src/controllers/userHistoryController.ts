import { Request, Response } from "express";
import User from "../models/userModel";

interface AuthenticatedRequest extends Request {
  user: string;
}

export const getQuizHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).user;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }
    return res.status(200).json({ quiz_history: user.quiz_history });
  } catch (error) {
    return res.status(500).json({ error: "Erreur lors de la récupération de l'historique du quiz" });
  }
};

export const getDefiHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).user;
    const user = await User.findById(userId).populate("defi_history.defi");
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }
    return res.status(200).json({ defi_history: user.defi_history });
  } catch (error) {
    return res.status(500).json({ error: "Erreur lors de la récupération de l'historique des défis" });
  }
};
