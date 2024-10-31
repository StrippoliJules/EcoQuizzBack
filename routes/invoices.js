// routes/invoices.js
const express = require('express');
const router = express.Router();
const Invoice = require('../models/invoice');

router.post('/', async (req, res) => {
  try {
    const invoice = new Invoice(req.body);
    await invoice.save();
    res.status(201).json(invoice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const invoices = await Invoice.find().populate('client');
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', getInvoice, (req, res) => {
  res.json(res.invoice);
});

router.put('/:id', getInvoice, async (req, res) => {
  Object.assign(res.invoice, req.body);
  try {
    const updatedInvoice = await res.invoice.save();
    res.json(updatedInvoice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', getInvoice, async (req, res) => {
  try {
    await res.invoice.remove();
    res.json({ message: 'Facture supprimée' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getInvoice(req, res, next) {
  let invoice;
  try {
    invoice = await Invoice.findById(req.params.id).populate('client');
    if (!invoice) {
      return res.status(404).json({ message: 'Facture non trouvée' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.invoice = invoice;
  next();
}

module.exports = router;
