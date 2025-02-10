import { Request, Response } from "express";
import User from "../models/userModel";
import Reservation from "../models/reservationModel";
import {
  deleteUserById,
  editPasswordById,
  editUserById,
  resetPasswordByEmail,
  sendResetPasswordEmail,
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

const editPassword = async (
  req: Request & { user?: string },
  res: Response
) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await editPasswordById(req.user!, oldPassword, newPassword);
    res.status(201).json(user);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "L'utilisateur n'existe pas") {
        return res.status(404).json({ error: error.message });
      }
      if (error.message === "Mot de passe incorrect") {
        return res.status(401).json({ error: error.message });
      }
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Une erreur inconnue s'est produite" });
    }
  }
};

const deleteUser = async (req: Request & { user?: string }, res: Response) => {
  try {
    await deleteUserById(req.user!);
    res.status(204).send();
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "L'utilisateur n'existe pas") {
        return res.status(404).json({ error: error.message });
      }
      if (error.message === "Vous avez des réservations en cours") {
        return res.status(403).json({ error: error.message });
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

const getUsers = async (req: Request, res: Response) => {
  try {
    const reservations = await Reservation.find({
      status: { $in: ["pending", "accepted"] }
    }).select("owner members");

    const userIdsToExclude = new Set();
    reservations.forEach(reservation => {
      userIdsToExclude.add(reservation.owner.toString());
      reservation.members.forEach(member => userIdsToExclude.add(member.toString()));
    });

    const users = await User.find({
      _id: { $nin: Array.from(userIdsToExclude) },
      firstname: { $ne: "Utilisateur" },
      lastname: { $ne: "Supprimé" },
      isEmailVerified: true,
      role: { $ne: "admin" }
    }).select("-password -isEmailVerified -verificationCode");

    res.status(200).json(users);
  } catch (error) {
    console.error("Error occurred in getUsers:", error);
    res.status(400).json({ error: "Une erreur inconnue s'est produite" });
  }
};

const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const response = await sendResetPasswordEmail(email);
    res.status(200).json(response); 
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Utilisateur introuvable") {
        return res.status(404).json({ error: error.message });
      }
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Une erreur inconnue s'est produite" });
    }
  }
}

const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, code, newPassword } = req.body;
    const { token, user } = await resetPasswordByEmail(email, code, newPassword);
    res.status(200).json({ token, user });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Code de réinitialisation invalide ou expiré") {
        return res.status(400).json({ error: error.message });
      }
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Une erreur inconnue s'est produite" });
    }
  }
}

export { editUser, editPassword, deleteUser, getUser, getUsers, forgotPassword, resetPassword };
