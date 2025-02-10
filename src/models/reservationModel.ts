import { ref } from "joi";
import mongoose, { Document, Schema } from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

export interface IReservation extends Document {
  locker: mongoose.Types.ObjectId;
  owner: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  status: string;
}

const ReservationSchema: Schema = new Schema({
  locker: { type: ObjectId, required: true, ref: "Locker" },
  owner: { type: ObjectId, required: true, ref: "User" },
  members: [{ type: ObjectId, required: true, ref: "User" }],
  status: { type: String, default: "pending" },
});

export default mongoose.model<IReservation>("Reservation", ReservationSchema);
