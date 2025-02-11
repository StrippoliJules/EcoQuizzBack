import { Request, Response } from "express";
import {getDefis, getUserDefiLatestDates, updateUserDefiHistory} from "../services/defiService";
import User from "../models/userModel";
import Defi from "../models/defiModel"

const getAllDefis = async (req: Request, res: Response) => {
    try {
        const defis = await getDefis();
        res.status(200).json(defis);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(400).json({ error: "Une erreur inconnue s'est produite" });
        }
    }
};


const updateDefiHistory = async (req: Request & { user?: string }, res: Response) => {
    try {
        const { userId, defiId } = req.body;
        if (!userId || !defiId) {
            return res.status(400).json({ error: "Paramètres manquants (userId, defiId)" });
        }
        const updatedUser = await updateUserDefiHistory(userId, defiId);

        res.status(200).json(updatedUser);
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes("introuvable")) {
                return res.status(404).json({ error: error.message });
            }
            res.status(400).json({ error: error.message });
        } else {
            res.status(400).json({ error: "Une erreur inconnue s'est produite" });
        }
    }
};

const getDefiLatestTimesController = async (req: Request, res: Response) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ error: "userId manquant dans le body." });
        }

        const result = await getUserDefiLatestDates(userId);
        return res.status(200).json(result);
    } catch (error) {
        console.error("[getDefiLatestTimesController]", error);
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: "Erreur inconnue" });
    }
};

export { getAllDefis, updateDefiHistory, getDefiLatestTimesController };
