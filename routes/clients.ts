import express, { Request, Response, NextFunction } from 'express';
import { Client, IClient } from '../models/client';

const router = express.Router();

// Route pour créer un client
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const clientData: Partial<IClient> = req.body;
    const client = new Client(clientData);
    await client.save();
    res.status(201).json(client);
  } catch (err: any) {
    next(err);
  }
});

// Route pour récupérer tous les clients
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (err: any) {
    next(err);
  }
});

// Route pour récupérer un client par ID
router.get('/:id', getClient, (req: Request, res: Response) => {
  // À ce stade, res.locals.client est défini par le middleware getClient
  res.json(res.locals.client);
});

// Route pour modifier un client par ID
router.put('/:id', getClient, async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Mise à jour des champs du client
    const { name, email } = req.body;
    if (name) res.locals.client.name = name;
    if (email) res.locals.client.email = email;

    // Sauvegarde du client mis à jour
    const updatedClient = await res.locals.client.save();
    res.json(updatedClient);
  } catch (err: any) {
    next(err);
  }
});

// Route pour supprimer un client par ID
router.delete('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const deletedClient = await Client.findByIdAndDelete(req.params.id);
    if (!deletedClient) {
      res.status(404).json({ message: 'Client non trouvé' });
      return;
    }
    res.json({ message: 'Client supprimé' });
  } catch (err) {
    next(err);
  }
});

// Middleware pour vérifier l'existence du client
async function getClient(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      res.status(404).json({ message: 'Client non trouvé' });
    } else {
      res.locals.client = client;
      next();
    }
  } catch (err: any) {
    next(err);
  }
}

export default router;
