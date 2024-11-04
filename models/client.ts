import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IClient extends Document {
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const ClientSchema: Schema<IClient> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export const Client: Model<IClient> = mongoose.model<IClient>('Client', ClientSchema);
