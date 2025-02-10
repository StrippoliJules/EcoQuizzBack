import User from "../models/userModel";
import Localisation from "../models/localisationModel";
import mongoose from "mongoose";

const createNewLocalisation = async (
  senderId: string,
  name: string,
  accessibility: boolean
) => {
  const sender = new mongoose.Types.ObjectId(senderId);
  const user = await User.findOne({ _id: sender });
  if (!user) throw new Error("L'utilisateur n'existe pas");

  const locker = await Localisation.findOne({ name });
  if (locker) throw new Error("La localisation existe déjà");

  if (user.role != "admin")
    throw new Error("L'utilisateur n'est pas administrateur");

  const newLocker = new Localisation({
    name,
    accessibility,
  });

  return await newLocker.save();
};

export { createNewLocalisation };
