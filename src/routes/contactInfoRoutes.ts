import express from "express";
import {
  getContactInfo,
  updateContactInfo,
} from "../controllers/contactInfoController";
import { isAdmin } from "../middleware/auth";

const router = express.Router();

// Публичный роут для получения контактной информации
router.get("/", getContactInfo);

// Защищенный роут для обновления контактной информации (только для админа)
router.put("/", isAdmin, updateContactInfo);

export default router;
