import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;

  defi_history: {
    defi: mongoose.Types.ObjectId;
    date: Date;
  }[];
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
});

export default mongoose.model<IUser>("User", UserSchema);
