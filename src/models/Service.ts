import mongoose, { Document, Schema } from "mongoose";

export interface IService extends Document {
  name: string;
  description: string;
  price: number;
  unit: string; // единица измерения (м², м, шт и т.д.)
  image?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<IService>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    unit: {
      type: String,
      required: true,
      enum: ["м²", "м", "pcs"],
      default: "м²",
    },
    image: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Service = mongoose.model<IService>("Service", serviceSchema);
