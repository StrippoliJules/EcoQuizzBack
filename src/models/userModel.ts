import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  firstname: string;
  lastname: string;
  role: string;
  email: string;
  password: string;
  isEmailVerified: boolean;
  verificationCode: string;
  resetPasswordCode?: string;
  resetPasswordExpire?: number;
}

const UserSchema: Schema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  role: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isEmailVerified: { type: Boolean, default: false },
  verificationCode: { type: String },
  resetPasswordCode: { type: String },
  resetPasswordExpire: { type: Number },
});

export default mongoose.model<IUser>("User", UserSchema);
