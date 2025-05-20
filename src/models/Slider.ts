import mongoose, { Schema, Document } from "mongoose";

export interface ISlider extends Document {
  title: string;
  description: string;
  imageUrl: string;
  order: number;
  isActive: boolean;
}

const SliderSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      default: 0,
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

export default mongoose.model<ISlider>("Slider", SliderSchema);
