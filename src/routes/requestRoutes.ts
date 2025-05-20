import express from "express";
import {
  createRequest,
  getRequests,
  updateRequestStatus,
} from "../controllers/requestController";
import { auth } from "../middleware/auth";
import { isAdmin } from "../middleware/isAdmin";

const router = express.Router();

// Создание заявки (доступно всем)
router.post("/", createRequest);

// Получение списка заявок (только для админов)
router.get("/", auth, isAdmin, getRequests);

// Обновление статуса заявки (только для админов)
router.patch("/:id/status", auth, isAdmin, updateRequestStatus);

export default router;
