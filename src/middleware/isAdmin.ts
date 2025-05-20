import { Request, Response, NextFunction } from "express";
import { User } from "../types";

// Расширяем интерфейс Request, чтобы включить user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  // Проверяем, что пользователь существует и является админом
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "Доступ запрещен. Требуются права администратора.",
    });
  }
};
