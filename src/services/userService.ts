import User from "../models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

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


export { editUserById, editPasswordById, resetPasswordByEmail };
