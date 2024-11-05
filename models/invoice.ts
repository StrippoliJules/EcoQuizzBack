import mongoose, { Document, Schema, Model } from 'mongoose';
import { IClient } from './client';

interface IInvoiceItem {
  name: string;
  quantity: number;
  unitPrice: number;
  tax: number;
}

export interface IInvoice extends Document {
  client: mongoose.Types.ObjectId | IClient;
  address: string;
  items: IInvoiceItem[];
  createdAt: Date;
  updatedAt: Date;
  invoiceNumber: string;
}

const InvoiceItemSchema: Schema = new Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  tax: {type: Number, required: true}
});

const InvoiceSchema: Schema<IInvoice> = new Schema(
  {
    client: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    address: { type: String, required: true },
    items: [InvoiceItemSchema],
    invoiceNumber: { type: String, required: true }
  },
  { timestamps: true }
);

export const Invoice: Model<IInvoice> = mongoose.model<IInvoice>('Invoice', InvoiceSchema);
