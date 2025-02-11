import { Request, Response } from "express";
import { register, login } from "../services/authService";

const signup = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await register(email, password);
    res.status(201).json({ session_token: token, user_id: user._id });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Utilisateur déjà existant") {
        return res.status(409).json({ error: "Utilisateur déjà existant" });
      }
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Une erreur inconnue s'est produite" });
    }
  }
};

const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await login(email, password);
    res.status(200).json({ session_token: token, user_id: user._id });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Utilisateur non trouvé") {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }
      if (error.message === "Identifiants invalides") {
        return res.status(401).json({ error: "Identifiants invalides" });
      }
      if (error.message === "Email non vérifié") {
        return res.status(403).json({ error: "Email non vérifié" });
      }
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Une erreur inconnue s'est produite" });
    }
  }
};

export { signup, signin };
