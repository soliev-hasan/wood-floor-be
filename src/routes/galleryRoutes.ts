import express from "express";
import multer from "multer";
import path from "path";
import {
  getGalleryImages,
  uploadGalleryImage,
  deleteGalleryImage,
} from "../controllers/galleryController";
import { auth as authenticate, adminAuth as isAdmin } from "../middleware/auth";

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `image-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

// GET all images
router.get("/", getGalleryImages);

// POST upload image (admin only)
router.post(
  "/",
  authenticate,
  isAdmin,
  upload.single("image"),
  uploadGalleryImage
);

// DELETE image (admin only)
router.delete("/:id", authenticate, isAdmin, deleteGalleryImage);

export default router;
