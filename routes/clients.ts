import express, { Request, Response, NextFunction } from 'express';
import { Client, IClient } from '../models/client';

const router = express.Router();

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

router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (err: any) {
    next(err);
  }
});

router.get('/:id', getClient, (req: Request, res: Response) => {
  // À ce stade, res.locals.client est défini par le middleware getClient
  res.json(res.locals.client);
});

router.put('/:id', getClient, async (req: Request, res: Response, next: NextFunction) => {
  try {
    Object.assign(res.locals.client, req.body);
    const updatedClient = await res.locals.client.save();
    res.json(updatedClient);
  } catch (err: any) {
    next(err);
  }
});

router.delete('/:id', getClient, async (_req: Request, res: Response, next: NextFunction) => {
  try {
    await res.locals.client.remove();
    res.json({ message: 'Client supprimé' });
  } catch (err: any) {
    next(err);
  }
});

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
