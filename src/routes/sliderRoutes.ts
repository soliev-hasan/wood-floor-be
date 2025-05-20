import express from "express";
import {
  getSliders,
  createSlider,
  updateSlider,
  deleteSlider,
} from "../controllers/sliderController";
import { upload } from "../middleware/upload";

const router = express.Router();

router.get("/", getSliders);
router.post("/", upload.single("image"), createSlider);
router.put("/:id", upload.single("image"), updateSlider);
router.delete("/:id", deleteSlider);

export default router;
