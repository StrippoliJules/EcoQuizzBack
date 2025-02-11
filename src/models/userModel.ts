import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  quiz_history: {
    type: [{
      impact: { 
        type: Number, 
        required: true 
      },
      date: { 
        type: Date, 
        default: Date.now 
      }
    }],
    default: []
  },
  defi_history: {
    type: [{
      defiId: { 
        type: Number, 
        required: true 
      },
      date: { 
        type: Date, 
        default: Date.now 
      }
    }],
    default: []
  }
});

export default mongoose.model<IUser>("User", UserSchema);
