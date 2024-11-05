
import express, { Request, Response, NextFunction } from 'express';
import { Invoice, IInvoice } from '../models/invoice';
import { Client, IClient } from '../models/client';
import fs from "fs";
import path from "path";
import mammoth from "mammoth";
import htmlToPdf from "html-pdf";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { format } from "date-fns";
import mongoose from "mongoose";


const router = express.Router();

const tempDir = path.resolve(__dirname, "tmp");

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

// Fonction pour générer le numéro de facture
async function generateInvoiceNumber(clientName: string, clientId: mongoose.Types.ObjectId): Promise<string> {
  const currentDate = new Date();
  const month = format(currentDate, "MM");
  const year = format(currentDate, "yyyy");

  // Compter les factures existantes pour ce client, mois et année
  const count = await Invoice.countDocuments({
    client: clientId,
    createdAt: {
      $gte: new Date(`${year}-${month}-01`),
      $lt: new Date(`${year}-${month}-31`),
    },
  });

  return `F-${clientName.toUpperCase()}-${month}-${year}#${count + 1}`;
}

// Route de création de facture avec génération de numéro de facture
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { client, address, items, creationDate, clientName } = req.body;

    // Utilisation d'un numéro temporaire
    const tempInvoiceNumber = "TEMP";

    // Enregistrer la facture avec un numéro temporaire
    const invoiceData: Partial<IInvoice> = req.body;
    invoiceData.invoiceNumber = tempInvoiceNumber;

    const invoice = new Invoice(invoiceData);
    await invoice.save(); // Enregistrement initial avec numéro temporaire

    // Générer le numéro de facture et mettre à jour la facture
    const invoiceNumber = await generateInvoiceNumber(clientName, client);
    invoice.invoiceNumber = invoiceNumber;
    await invoice.save(); // Mise à jour avec le numéro de facture

    res.status(201).json(invoice);
  } catch (err: any) {
    next(err);
  }
});

// Route pour générer le PDF de la facture avec le numéro de facture comme nom de fichier
router.post("/generate-pdf", async (req, res) => {
  try {
    const { data, invoiceNumber } = req.body; // Ajoutez `invoiceNumber` dans la requête

    // Charger et personnaliser le modèle DOCX
    const templatePath = path.resolve(
      __dirname,
      "templates/invoice_template.docx"
    );
    const content = fs.readFileSync(templatePath, "binary");
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    doc.render(data);

    // Enregistrer le fichier DOCX temporaire avec le numéro de facture comme nom
    const docxBuffer = doc.getZip().generate({ type: "nodebuffer" });
    const docxPath = path.join(tempDir, `${invoiceNumber}.docx`); // Utiliser `invoiceNumber` comme nom de fichier
    fs.writeFileSync(docxPath, docxBuffer);

    // Convertir le DOCX en HTML avec Mammoth
    const { value: html } = await mammoth.convertToHtml({ path: docxPath });

    // Convertir le HTML en PDF avec le numéro de facture comme nom de fichier
    htmlToPdf.create(html).toBuffer((err, pdfBuffer) => {
      if (err) {
        res.status(500).send("Erreur lors de la conversion en PDF");
        return;
      }

      // Envoi du PDF avec le numéro de facture comme nom de fichier
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${invoiceNumber}.pdf"`
      );
      res.contentType("application/pdf");
      res.send(pdfBuffer);

      // Nettoyer le fichier temporaire
      fs.unlinkSync(docxPath);
    });
  } catch (error) {
    console.error("Erreur lors de la génération du PDF :", error);
    res.status(500).send("Erreur serveur lors de la génération du PDF");
  }
});

router.get("/", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const invoices = await Invoice.find().populate("client");
    res.json(invoices);
  } catch (err: any) {
    next(err);
  }
});

router.get("/:id", getInvoice, (req: Request, res: Response) => {
  res.json(res.locals.invoice);
});

router.put('/:id', getInvoice, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const invoiceUpdates: Partial<IInvoice> = req.body;

    const { client: clientUpdates, ...otherUpdates } = invoiceUpdates;

    Object.assign(res.locals.invoice, otherUpdates);

    if (clientUpdates && res.locals.invoice.client) {
      const clientId = res.locals.invoice.client._id || res.locals.invoice.client;
      await Client.findByIdAndUpdate(clientId, clientUpdates);
    }

    const updatedInvoice = await res.locals.invoice.save();

    await updatedInvoice.populate('client');

    res.json(updatedInvoice);
  } catch (err: any) {
    next(err);
  }
}
);

router.delete('/:id', getInvoice, async (_req: Request, res: Response, next: NextFunction) => {
  try {
    await res.locals.invoice.deleteOne();
    res.json({ message: 'Facture supprimée' });
  } catch (err: any) {
    next(err);
  }
}
);

async function getInvoice(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const invoice = await Invoice.findById(req.params.id).populate("client");
    if (!invoice) {
      res.status(404).json({ message: 'Facture non trouvée' });
      return;
    }
    res.locals.invoice = invoice;
    next();
  } catch (err: any) {
    next(err);
  }
}

export default router;
