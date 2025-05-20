import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import connectDB from "./config/database";
import { ContactFormData, ApiResponse } from "./types/index";
import userRoutes from "./routes/userRoutes";
import serviceRoutes from "./routes/serviceRoutes";
import authRoutes from "./routes/authRoutes";
import requestRoutes from "./routes/requestRoutes";
import reviewRoutes from "./routes/reviewRoutes";
import { createTestServices } from "./controllers/serviceController";
import sliderRoutes from "./routes/sliderRoutes";
import { createInitialSliders } from "./controllers/sliderController";
import galleryRoutes from "./routes/galleryRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);

// Статическая раздача файлов из директории uploads
const uploadsPath = path.join(__dirname, "..", "uploads");
console.log("Uploads directory path:", uploadsPath);
app.use("/uploads", express.static(uploadsPath));

// Добавим middleware для логирования запросов
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/sliders", sliderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Validate phone number format
const validatePhone = (phone: string): boolean => {
  // Just check if it contains any digits
  return /\d/.test(phone);
};

// Validate email format
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Test route
app.get("/api/test", (_req, res) => {
  res.json({ message: "Backend is working!" });
});

// Contact form submission endpoint
app.post("/api/contact", async (req, res) => {
  try {
    const formData: ContactFormData = req.body;
    console.log("Received form data:", formData);

    // Validate form data
    if (
      !formData.name ||
      !formData.phone ||
      !formData.service ||
      !formData.message
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields",
      } as ApiResponse);
    }

    if (!formData.privacyPolicy) {
      return res.status(400).json({
        success: false,
        message: "Please accept the privacy policy",
      } as ApiResponse);
    }

    // Validate phone format - just check if it contains any digits
    if (!validatePhone(formData.phone)) {
      return res.status(400).json({
        success: false,
        message: "Phone number must contain at least one digit",
      } as ApiResponse);
    }

    // Validate email if provided
    if (formData.email && !validateEmail(formData.email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      } as ApiResponse);
    }

    // Here you would typically save the form data to a database
    console.log("Form submission received:", formData);

    res.status(200).json({
      success: true,
      message: "Form submitted successfully",
    } as ApiResponse);
  } catch (error) {
    console.error("Error processing form submission:", error);
    res.status(500).json({
      success: false,
      message: "Error processing form submission",
    } as ApiResponse);
  }
});

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/barbershop")
  .then(() => {
    console.log("Connected to MongoDB");
    // Create test data on server start
    createTestServices();
    createInitialSliders();
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
