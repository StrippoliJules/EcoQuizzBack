import { Request, Response } from "express";
import { getDefis, updateUserDefiHistory } from "../services/defiService";

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

export { getAllDefis, updateDefiHistory };
