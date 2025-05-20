import express from "express";
import bcrypt from "bcrypt";
import jwt from "jwt-simple";
import { auth, adminAuth } from "../middleware/auth";
import { User, IUser } from "../models/User";
import { ContactRequest, IContactRequest } from "../models/ContactRequest";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// In-memory storage (replace with database in production)
// const users: User[]  = [];
// const contactRequests: any[] = [];

// Добавьте тестового пользователя
// const testUser: User = {
//   id: "1",
//   email: "test@example.com",
//   name: "Test User",
//   password: "$2b$10$YourHashedPasswordHere", // Используйте bcrypt.hash для создания хеша
//   role: "user",
//   createdAt: new Date(),
// };

// users.push(testUser);

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
}

// Register
router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    console.log("Received data:", req.body);
    // Валидация
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: "Все поля обязательны для заполнения",
      });
    }

    // Проверка существования пользователя
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Пользователь с таким email уже существует",
      });
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создание пользователя
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      role: "user",
    });

    // Создание токена
    const token = jwt.encode(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET
    );

    // Удаление пароля из ответа с помощью деструктуризации
    const userResponse = user.toObject();
    const { password: _, ...userWithoutPassword } = userResponse;

    // Убедимся, что все необходимые поля присутствуют
    console.log("Отправляемые данные пользователя:", userWithoutPassword);

    res.status(201).json({
      success: true,
      message: "Регистрация успешна",
      data: {
        user: userWithoutPassword,
        token,
      },
    });
  } catch (error) {
    console.error("Ошибка регистрации:", error);
    res.status(500).json({
      success: false,
      message: "Ошибка при регистрации",
    });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Валидация
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email и пароль обязательны",
      });
    }

    // Поиск пользователя
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Неверный email или пароль",
      });
    }

    // Проверка пароля
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Неверный email или пароль",
      });
    }

    // Создание токена
    const token = jwt.encode(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET
    );

    // Удаление пароля из ответа с помощью деструктуризации
    const { password: _, ...userResponse } = user.toObject();

    res.json({
      success: true,
      message: "Вход выполнен успешно",
      data: {
        user: userResponse,
        token,
      },
    });
  } catch (error) {
    console.error("Ошибка входа:", error);
    res.status(500).json({
      success: false,
      message: "Ошибка при входе",
    });
  }
});

// Get user profile
router.get("/profile", auth, (req, res) => {
  res.json({
    success: true,
    data: req.user,
  });
});

// Get all contact requests
router.get("/contact-requests", async (req, res) => {
  try {
    const requests = await ContactRequest.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: requests,
    });
  } catch (error) {
    console.error("Error fetching contact requests:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching contact requests",
    });
  }
});

// Get single contact request
router.get("/contact-requests/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const request = await ContactRequest.findById(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Contact request not found",
      });
    }

    res.json({
      success: true,
      data: request,
    });
  } catch (error) {
    console.error("Error fetching contact request:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching contact request",
    });
  }
});

// Create contact request
router.post("/contact-requests", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const request = await ContactRequest.create({
      name,
      email,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Contact request created successfully",
      data: request,
    });
  } catch (error) {
    console.error("Error creating contact request:", error);
    res.status(500).json({
      success: false,
      message: "Error creating contact request",
    });
  }
});

// Update contact request status
router.patch("/contact-requests/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !["pending", "processed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const request = await ContactRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Contact request not found",
      });
    }

    res.json({
      success: true,
      message: "Contact request updated successfully",
      data: request,
    });
  } catch (error) {
    console.error("Error updating contact request:", error);
    res.status(500).json({
      success: false,
      message: "Error updating contact request",
    });
  }
});

export default router;
