import { Request, Response } from "express";
import User from "../models/userModel";

const getUser = async (req: Request, res: Response) => {
  try {
    if (req.params.id.length !== 24)
      return res.status(400).json({ error: "ID invalide" });

    const user = await User.findById(req.params.id).select("-password");
    if (!user)
      return res.status(404).json({ error: "Utilisateur introuvable" });

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: "Une erreur inconnue s'est produite" });
  }
};

export {getUser};
