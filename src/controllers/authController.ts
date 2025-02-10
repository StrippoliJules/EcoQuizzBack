import { Request, Response } from "express";
import {
  register,
  login,
  verifyCode,
  sendVerificationCode,
} from "../services/authService";

const signup = async (req: Request, res: Response) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    const { token, user } = await register(
      firstname,
      lastname,
      email,
      password
    );
    res.status(201).json({ token, user });
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
    res.status(200).json({ token, user });
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

const sendCode = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const response = await sendVerificationCode(email);
    res.status(200).json(response);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Une erreur inconnue s'est produite" });
    }
  }
};

const checkCode = async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;
    const response = await verifyCode(email, code);
    res.status(200).json(response);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Une erreur inconnue s'est produite" });
    }
  }
};

export { signup, signin, sendCode, checkCode };
