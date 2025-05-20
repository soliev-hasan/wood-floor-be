import mongoose, { Document, Schema } from "mongoose";

export interface IGalleryImage extends Document {
  url: string;
  filename: string;
  createdAt: Date;
}

const galleryImageSchema = new Schema<IGalleryImage>({
  url: { type: String, required: true },
  filename: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const GalleryImage = mongoose.model<IGalleryImage>(
  "GalleryImage",
  galleryImageSchema
);
