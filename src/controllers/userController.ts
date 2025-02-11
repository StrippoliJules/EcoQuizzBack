import { Request, Response } from "express";
import User from "../models/userModel";
import {
  editUserById,
} from "../services/userService";

const editUser = async (req: Request & { user?: string }, res: Response) => {
  try {
    const { firstname, lastname } = req.body;
    const user = await editUserById(req.user!, firstname, lastname);
    res.status(201).json(user);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "L'utilisateur n'existe pas") {
        return res.status(404).json({ error: error.message });
      }
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Une erreur inconnue s'est produite" });
    }
  }
};

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

export {editUser, getUser};
