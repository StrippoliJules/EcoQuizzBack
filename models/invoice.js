// models/Invoice.js
const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  address: {type:String ,required: true},
  items: [{
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  }],
}, { timestamps: true });

module.exports = mongoose.model('Invoice', InvoiceSchema);
