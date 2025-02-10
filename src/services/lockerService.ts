import User from "../models/userModel";
import Locker from "../models/lockerModel";
import mongoose from "mongoose";

const createNewLocker = async (
  senderId: string,
  number: number,
  localisation: string
) => {
  const sender = new mongoose.Types.ObjectId(senderId);
  const user = await User.findOne({ _id: sender });
  if (!user) throw new Error("L'utilisateur n'existe pas");

  const locker = await Locker.findOne({ number });
  if (locker) throw new Error("Le casier existe déjà");

  if (user.role != "admin")
    throw new Error("L'utilisateur n'est pas administrateur");

  const newLocker = new Locker({
    number,
    localisation,
    status: "available"
  });

  return await newLocker.save();
};

const getTheAdminLockers = async (senderId: string) => {
  const sender = new mongoose.Types.ObjectId(senderId);
  const user = await User.findOne({ _id: sender });
  if (!user) throw new Error("L'utilisateur n'existe pas");

  if (user.role != "admin")
    throw new Error("L'utilisateur n'est pas administrateur");

  return await Locker.find()
      .populate("localisation");
};

const changeLockerStatusById = async (
  senderId: string,
  lockerId: string,
  status: string
) => {
  const sender = new mongoose.Types.ObjectId(senderId);
  const user = await User.findOne({ _id: sender });
  if (!user) throw new Error("L'utilisateur n'existe pas");

  if (user.role != "admin")
    throw new Error("L'utilisateur n'est pas administrateur");

  const lockerToFind = new mongoose.Types.ObjectId(lockerId);
  const locker = await Locker.findOne(lockerToFind);
  if (!locker) throw new Error("Le casier n'existe pas");

  locker.status = status;

  return await locker.save();
};


export {
  createNewLocker,
  getTheAdminLockers,
  changeLockerStatusById
};
