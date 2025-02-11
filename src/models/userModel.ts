import mongoose, { Document, Schema } from "mongoose";

export interface IQuizHistory {
  impact: number;
  date: Date;
}

export interface IDefiHistory {
  defi: mongoose.Types.ObjectId;
  date: Date;
}
export interface IUser extends Document {
  email: string;
  password: string;
  defi_history: IDefiHistory[];
  quiz_history: IQuizHistory[];
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  defi_history: {
    type: [
      {
        defi: { type: mongoose.Schema.Types.ObjectId, ref: "Defi" },
        date: { type: Date, default: Date.now },
      },
    ],
    default: [],
  },
  quiz_history: {
    type: [
      {
        impact: { type: Number, required: true },
        date: { type: Date, default: Date.now },
      },
    ],
    default: [],
  },
});

export default mongoose.model<IUser>("User", UserSchema);
