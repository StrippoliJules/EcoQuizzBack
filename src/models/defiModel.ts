import mongoose, { Document, Schema } from "mongoose";

export interface IDefi extends Document {
    titre: string;
    description: string;
    impact: number;
    unlimited: boolean;
}

const DefiSchema: Schema = new Schema({
    titre: { type: String, required: true },
    description: { type: String, required: true },
    impact: { type: Number, required: true },
    unlimited: { type: Boolean, required: true, default: false },
});

export default mongoose.model<IDefi>("Defi", DefiSchema);
