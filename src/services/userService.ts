import User from "../models/userModel";
import Reservation from "../models/reservationModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { sendEmail } from "./emailService";

const editUserById = async (
  senderId: string,
  firstname: string,
  lastname: string
) => {
  const sender = new mongoose.Types.ObjectId(senderId);
  const user = await User.findOne({ _id: sender });
  if (!user) throw new Error("L'utilisateur n'existe pas");

  if (firstname) user.firstname = firstname;
  if (lastname) user.lastname = lastname;

  return await user.save();
};

const editPasswordById = async (
  senderId: string,
  oldPassword: string,
  newPassword: string
) => {
  const sender = new mongoose.Types.ObjectId(senderId);
  const user = await User.findOne({ _id: sender });
  if (!user) throw new Error("L'utilisateur n'existe pas");
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) throw new Error("Mot de passe incorrect");
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  return await user.save();
};

const deleteUserById = async (senderId: string) => {
  const sender = new mongoose.Types.ObjectId(senderId);
  const user = await User.findOne({ _id: sender });
  if (!user) throw new Error("L'utilisateur n'existe pas");

  const reservations = await Reservation.find({
    owner: sender,
    status: { $in: ["pending", "accepted"] },
  });

  if (reservations.length > 0) {
    throw new Error("Vous avez des réservations en cours");
  }

  const uniqueEmail = `deleted-${Date.now()}-${senderId}@myges.fr`;

  await User.updateOne(
    { _id: sender },
    {
      $unset: { password: 1 },
      $set: {
        firstname: "Utilisateur",
        lastname: "Supprimé",
        email: uniqueEmail,
      },
    }
  );
};

const sendResetPasswordEmail = async (email: string) => {

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Utilisateur introuvable");
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetCodeExpire = Date.now() + 10 * 60 * 1000;

    user.resetPasswordCode = resetCode;
    user.resetPasswordExpire = resetCodeExpire;
    await user.save();

    const message = `Votre code de réinitialisation de mot de passe est : ${resetCode}. Il expire dans 10 minutes.`;

    await sendEmail(
      user.email,
      "Réinitialisation du mot de passe",
      message
    );

    return { message: "Email de réinitialisation de mot de passe envoyé" };
}

const resetPasswordByEmail = async (email: string, code: string, newPassword: string) => {
  const user = await User.findOne({
    email,
    resetPasswordCode: code,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new Error("Code de réinitialisation invalide ou expiré");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  user.resetPasswordCode = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" }
  );

  return { token, user };
}


export { editUserById, editPasswordById, deleteUserById, sendResetPasswordEmail, resetPasswordByEmail };
