import mongoose, { Document, Schema } from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

export interface ILocker extends Document {
  number: number;
  localisation: mongoose.Types.ObjectId;
  status: string;
}

const LockerSchema: Schema = new Schema({
  number: { type: Number, required: true, unique: true },
  localisation: { type: ObjectId, ref: "Localisation" },
  status: { type: String, required: true, default: "available" },
});

export default mongoose.model<ILocker>("Locker", LockerSchema);
