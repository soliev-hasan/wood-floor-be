import { Request, Response } from "express";
import { Service } from "../models/Service";
import { ApiResponse } from "../types/index";
import fs from "fs";
import path from "path";

// Get all services
export const getServices = async (req: Request, res: Response) => {
  try {
    const services = await Service.find({ isActive: true });
    res.json({
      success: true,
      data: services,
    } as ApiResponse);
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching services",
    } as ApiResponse);
  }
};

// Create a new service
export const createService = async (req: Request, res: Response) => {
  try {
    const { name, description, price, unit } = req.body;

    if (!name || !description || !price || !unit) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      } as ApiResponse);
    }

    // Validate unit
    const validUnits = ["м²", "м", "pcs"];
    if (!validUnits.includes(unit)) {
      return res.status(400).json({
        success: false,
        message: `Invalid unit. Must be one of: ${validUnits.join(", ")}`,
      } as ApiResponse);
    }

    // Validate price
    const priceNum = Number(price);
    if (isNaN(priceNum) || priceNum < 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a positive number",
      } as ApiResponse);
    }

    const service = new Service({
      name,
      description,
      price: priceNum,
      unit,
      image: req.file ? `/uploads/${req.file.filename}` : undefined,
    });

    await service.save();

    res.status(201).json({
      success: true,
      data: service,
    } as ApiResponse);
  } catch (error: any) {
    console.error("Error creating service:", error);
    // Check for validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors)
          .map((err: any) => err.message)
          .join(", "),
      } as ApiResponse);
    }
    res.status(500).json({
      success: false,
      message: "Error creating service",
      error: error.message,
    } as ApiResponse);
  }
};

// Update a service
export const updateService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, price, unit, isActive } = req.body;

    const updateData: any = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (unit) updateData.unit = unit;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (req.file) updateData.image = `/uploads/${req.file.filename}`;

    const service = await Service.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      } as ApiResponse);
    }

    res.json({
      success: true,
      data: service,
    } as ApiResponse);
  } catch (error) {
    console.error("Error updating service:", error);
    res.status(500).json({
      success: false,
      message: "Error updating service",
    } as ApiResponse);
  }
};

// Delete a service
export const deleteService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const service = await Service.findByIdAndDelete(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      } as ApiResponse);
    }

    res.json({
      success: true,
      message: "Service deleted successfully",
    } as ApiResponse);
  } catch (error) {
    console.error("Error deleting service:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting service",
    } as ApiResponse);
  }
};

// Create test services
export const createTestServices = async () => {
  try {
    const services = await Service.find();
    if (services.length === 0) {
      const testServices = [
        {
          name: "Укладка газона",
          description: "Профессиональная укладка газона с подготовкой почвы",
          price: 500,
          unit: "м²",
        },
        {
          name: "Обрезка деревьев",
          description: "Профессиональная обрезка и формирование кроны деревьев",
          price: 2000,
          unit: "шт",
        },
        {
          name: "Полив растений",
          description: "Автоматический полив растений и газона",
          price: 300,
          unit: "м²",
        },
      ];

      await Service.insertMany(testServices);
      console.log("Test services created successfully");
    }
  } catch (error) {
    console.error("Error creating test services:", error);
  }
};

// Вызываем функцию при запуске сервера
// createTestServices();
