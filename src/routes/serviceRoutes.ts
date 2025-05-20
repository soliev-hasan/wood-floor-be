import express from "express";
import {
  getServices,
  createService,
  updateService,
  deleteService,
} from "../controllers/serviceController";
import { auth } from "../middleware/auth";
import { isAdmin } from "../middleware/isAdmin";
import { upload } from "../config/multer";

const router = express.Router();

// GET /api/services - получить все сервисы
router.get("/", getServices);

// POST /api/services - создать новый сервис (только для админов)
router.post("/", auth, isAdmin, upload.single("image"), createService);

// PUT /api/services/:id - обновить сервис (только для админов)
router.put("/:id", auth, isAdmin, upload.single("image"), updateService);

// DELETE /api/services/:id - удалить сервис (только для админов)
router.delete("/:id", auth, isAdmin, deleteService);

export default router;
