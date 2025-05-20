import { Request, Response } from "express";
import { GalleryImage } from "../models/GalleryImage";
import path from "path";
import fs from "fs";

export const getGalleryImages = async (req: Request, res: Response) => {
  try {
    const images = await GalleryImage.find().sort({ createdAt: -1 });
    res.json({ success: true, data: images });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch images" });
  }
};

export const uploadGalleryImage = async (req: Request, res: Response) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "No file uploaded" });
  }
  const url = `/uploads/${req.file.filename}`;
  try {
    const image = await GalleryImage.create({
      url,
      filename: req.file.filename,
    });
    res.status(201).json({ success: true, data: image });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to upload image" });
  }
};

export const deleteGalleryImage = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const image = await GalleryImage.findById(id);
    if (!image) {
      return res
        .status(404)
        .json({ success: false, message: "Image not found" });
    }
    // Удаляем файл с диска
    const filePath = path.join(__dirname, "../../uploads", image.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    await image.deleteOne();
    res.json({ success: true, message: "Image deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete image" });
  }
};
