import mongoose from "mongoose";
import Defi from "../models/defiModel";
import User from "../models/userModel";

const getDefis = async () => {
    try {
        const defis = await Defi.find();
        return defis;
    } catch (error) {
        throw new Error(`Erreur lors de la récupération des défis : ${error}`);
    }
};

const updateUserDefiHistory = async (userId: string, defiId: string) => {
    try {
        const userObjectId = new mongoose.Types.ObjectId(userId);
        const defiObjectId = new mongoose.Types.ObjectId(defiId);

        const user = await User.findById(userObjectId);
        if (!user) {
            throw new Error("Utilisateur introuvable");
        }

        user.defi_history.push({
            defi: defiObjectId,
            date: new Date(),
        });

        await user.save();
        return user;
    } catch (error) {
        throw new Error(`Erreur lors de la mise à jour de l'historique : ${error}`);
    }
};

export { getDefis, updateUserDefiHistory };
