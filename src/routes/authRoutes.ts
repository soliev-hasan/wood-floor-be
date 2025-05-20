import express from "express";
import { auth } from "../middleware/auth";
import { isAdmin } from "../middleware/isAdmin";

const router = express.Router();

// GET /api/auth/me - получить текущего пользователя
router.get("/me", auth, (req, res) => {
  res.json({
    success: true,
    data: {
      user: req.user,
    },
  });
});

// GET /api/auth/admin - проверить права администратора
router.get("/admin", auth, isAdmin, (req, res) => {
  res.json({
    success: true,
    message: "Пользователь является администратором",
  });
});

export default router;
