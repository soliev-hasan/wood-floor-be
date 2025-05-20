import mongoose, { Document, Schema } from "mongoose";

export interface IContactRequest extends Document {
  name: string;
  email: string;
  message: string;
  status: "pending" | "processed";
  createdAt: Date;
}

const contactRequestSchema = new Schema<IContactRequest>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "processed"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const ContactRequest = mongoose.model<IContactRequest>(
  "ContactRequest",
  contactRequestSchema
);
