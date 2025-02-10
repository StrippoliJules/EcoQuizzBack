import { Request, Response } from "express";
import {
  createNewReservation,
  getCurrentReservationOfUser,
  getReservationsByLockerId,
  getThePendingReservations,
  leaveReservationById,
  terminateReservationById,
  validateOrRefuseReservationById,
} from "../services/reservationService";

const createReservation = async (
  req: Request & { user?: string },
  res: Response
) => {
  try {
    const { lockerId, members } = req.body;
    const reservation = await createNewReservation(
      req.user!,
      lockerId,
      members
    );
    res.status(201).json(reservation);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message == "Utilisateur inexistant") {
        return res.status(404).json({ error: error.message });
      }
      if (error.message == "Le casier est déjà occupé") {
        return res.status(403).json({ error: error.message });
      }
      if (error.message == "Un ou plusieurs membres n'existent pas") {
        return res.status(404).json({ error: error.message });
      }
      if (error.message == "Le casier n'existe pas") {
        return res.status(404).json({ error: error.message });
      }
      if (
        error.message ==
        "L'utilisateur ou l'un des membres a déjà une réservation active pour un casier"
      ) {
        return res.status(403).json({ error: error.message });
      }
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Une erreur inconnue s'est produite" });
    }
  }
};

const getPendingReservations = async (
  req: Request & { user?: string },
  res: Response
) => {
  try {
    const reservations = await getThePendingReservations(req.user!);
    res.status(200).json(reservations);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message == "Utilisateur inexistant") {
        return res.status(404).json({ error: error.message });
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

const validateOrRefuseReservation = async (
  req: Request & { user?: string },
  res: Response
) => {
  try {
    const { reservationId, status } = req.body;
    const reservation = await validateOrRefuseReservationById(
      req.user!,
      reservationId,
      status
    );
    res.status(200).json(reservation);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message == "Utilisateur inexistant") {
        return res.status(404).json({ error: error.message });
      }
      if (error.message == "La réservation n'existe pas") {
        return res.status(404).json({ error: error.message });
      }
      if (error.message == "L'utilisateur n'est pas administrateur") {
        return res.status(403).json({ error: error.message });
      }
      if (error.message == "Le statut de la réservation est invalide") {
        return res.status(400).json({ error: error.message });
      }
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Une erreur inconnue s'est produite" });
    }
  }
};

const terminateReservation = async (
  req: Request & { user?: string },
  res: Response
) => {
  try {
    const { reservationId } = req.body;
    const reservation = await terminateReservationById(
      req.user!,
      reservationId
    );
    res.status(200).json(reservation);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message == "Utilisateur inexistant") {
        return res.status(404).json({ error: error.message });
      }
      if (error.message == "La réservation n'existe pas") {
        return res.status(404).json({ error: error.message });
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

const getCurrentReservation = async (
  req: Request & { user?: string },
  res: Response
) => {
  try {
    const reservation = await getCurrentReservationOfUser(req.user!);
    res.status(200).json(reservation);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message == "Utilisateur inexistant") {
        return res.status(404).json({ error: error.message });
      }
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Une erreur inconnue s'est produite" });
    }
  }
}

const leaveReservation = async (
  req: Request & { user?: string },
  res: Response
) => {
  try {
    const { reservationId } = req.body;
    const reservation = await leaveReservationById(req.user!, reservationId);
    res.status(200).json(reservation);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message == "Utilisateur inexistant") {
        return res.status(404).json({ error: error.message });
      }
      if (error.message == "La réservation n'existe pas") {
        return res.status(404).json({ error: error.message });
      }
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Une erreur inconnue s'est produite" });
    }
  }
}

const getLockerReservations = async (
  req: Request & { user?: string },
  res: Response
) => {
  try {
    const reservations = await getReservationsByLockerId(req.params.lockerId);
    res.status(200).json(reservations);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message == "Le casier n'existe pas") {
        return res.status(404).json({ error: error.message });
      }
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Une erreur inconnue s'est produite" });
    }
  }
}

export {
  createReservation,
  getPendingReservations,
  validateOrRefuseReservation,
  terminateReservation,
  getCurrentReservation,
  leaveReservation,
  getLockerReservations,
};
