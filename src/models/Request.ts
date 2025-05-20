import mongoose, { Schema, Document } from "mongoose";

export interface IRequest extends Document {
  serviceId: mongoose.Types.ObjectId;
  name: string;
  phone: string;
  email: string;
  preferredDate: Date;
  preferredTime: string;
  notes?: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: Date;
}

const RequestSchema: Schema = new Schema({
  serviceId: {
    type: Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  preferredDate: {
    type: Date,
    required: true,
  },
  preferredTime: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IRequest>("Request", RequestSchema);
