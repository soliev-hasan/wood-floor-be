import { Request, Response, NextFunction } from "express";
import jwt from "jwt-simple";
import { User } from "../types";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new Error();
    }

    const decoded = jwt.decode(token, JWT_SECRET) as User;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Пожалуйста, авторизуйтесь",
    });
  }
};

export const adminAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await auth(req, res, () => {
      if (req.user?.role !== "admin") {
        throw new Error();
      }
      next();
    });
  } catch (error) {
    res
      .status(403)
      .json({ success: false, message: "Access denied. Admin only." });
  }
};

export const isAdmin = adminAuth;
