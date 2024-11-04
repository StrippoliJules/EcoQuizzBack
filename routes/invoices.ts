import express, { Request, Response, NextFunction } from 'express';
import { Invoice, IInvoice } from '../models/invoice';

const router = express.Router();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log(req.body)
    const invoiceData: Partial<IInvoice> = req.body;
    const invoice = new Invoice(invoiceData);
    await invoice.save();
    res.status(201).json(invoice);
  } catch (err: any) {
    next(err);
  }
});

router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const invoices = await Invoice.find().populate('client');
    res.json(invoices);
  } catch (err: any) {
    next(err);
  }
});

router.get('/:id', getInvoice, (req: Request, res: Response) => {
  res.json(res.locals.invoice);
});

router.put('/:id', getInvoice, async (req: Request, res: Response, next: NextFunction) => {
  try {
    Object.assign(res.locals.invoice, req.body);
    const updatedInvoice = await res.locals.invoice.save();
    res.json(updatedInvoice);
  } catch (err: any) {
    next(err);
  }
});

router.delete('/:id', getInvoice, async (_req: Request, res: Response, next: NextFunction) => {
  try {
    await res.locals.invoice.remove();
    res.json({ message: 'Facture supprimée' });
  } catch (err: any) {
    next(err);
  }
});

async function getInvoice(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const invoice = await Invoice.findById(req.params.id).populate('client');
    if (!invoice) {
      res.status(404).json({ message: 'Facture non trouvée' });
    } else {
      res.locals.invoice = invoice;
      next();
    }
  } catch (err: any) {
    next(err);
  }
}

export default router;
