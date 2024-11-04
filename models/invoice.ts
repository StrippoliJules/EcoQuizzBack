import mongoose, { Document, Schema, Model } from 'mongoose';
import { IClient } from './client';

interface IInvoiceItem {
  description: string;
  quantity: number;
  price: number;
}

export interface IInvoice extends Document {
  client: mongoose.Types.ObjectId | IClient;
  address: string;
  items: IInvoiceItem[];
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceItemSchema: Schema = new Schema({
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const InvoiceSchema: Schema<IInvoice> = new Schema(
  {
    client: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    address: { type: String, required: true },
    items: [InvoiceItemSchema],
  },
  { timestamps: true }
);

export const Invoice: Model<IInvoice> = mongoose.model<IInvoice>('Invoice', InvoiceSchema);
