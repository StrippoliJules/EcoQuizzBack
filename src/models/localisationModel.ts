import mongoose, { Document, Schema } from "mongoose";

export interface ILocalisation extends Document {
  name: string
  accessibility: boolean
}

const LocalisationSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  accessibility: { type: Boolean, required: true },
});

export default mongoose.model<ILocalisation>("Localisation", LocalisationSchema);
