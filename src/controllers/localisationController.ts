import { Request, Response } from "express";
import { createNewLocalisation } from "../services/localisationService";
import Localisation from "../models/localisationModel";

const createLocalisation = async (
  req: Request & { user?: string },
  res: Response
) => {
  try {
    const { name, accessibility } = req.body;
    const locker = await createNewLocalisation(req.user!, name, accessibility);
    res.status(201).json(locker);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message == "Utilisateur inexistant") {
        return res.status(404).json({ error: error.message });
      }
      if (error.message == "La localisation existe déjà") {
        return res.status(403).json({ error: error.message });
      }
      if (error.message == "L'utilisateur n'est pas administrateur") {
        return res.status(403).json({ error: error.message });
      }
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Une erreur inconnue s'est produite" });
    }
  }
};

const getLocalisations = async (req: Request, res: Response) => {
  try {
    const localisations = await Localisation.find();
    res.status(200).json(localisations);
  } catch (error) {
    res.status(400).json({ error: "Une erreur inconnue s'est produite" });
  }
};

export { createLocalisation, getLocalisations };
