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

const getUserDefiLatestDates = async (userId: string) => {
    const objectId = new mongoose.Types.ObjectId(userId);

    const user = await User.findById(objectId).populate("defi_history.defi");
    if (!user) {
        throw new Error("Utilisateur introuvable");
    }

    const historyMap = new Map<string, Date>();

    user.defi_history.forEach((entry) => {
        const defiDoc = entry.defi as any;
        const defiIdStr = defiDoc._id.toString();

        const currentDate = entry.date;
        const existingDate = historyMap.get(defiIdStr);

        if (!existingDate || currentDate > existingDate) {
            historyMap.set(defiIdStr, currentDate);
        }
    });

    const results: {
        defiId: string;
        titre: string;
        description: string;
        impact: number;
        unlimited: boolean;
        lastDate: Date;
    }[] = [];

    historyMap.forEach((date, defiIdStr) => {
        const found = user.defi_history.find((e) => {
            const eDefiDoc = e.defi as any;
            return eDefiDoc._id.toString() === defiIdStr;
        });

        if (found) {
            // found.defi contient le doc "Defi"
            const foundDefiDoc = found.defi as any;
            results.push({
                defiId: defiIdStr,
                titre: foundDefiDoc.titre,
                description: foundDefiDoc.description,
                impact: foundDefiDoc.impact,
                unlimited: foundDefiDoc.unlimited,
                lastDate: date,
            });
        }
    });

    return results;
};

export { getDefis, updateUserDefiHistory, getUserDefiLatestDates };
