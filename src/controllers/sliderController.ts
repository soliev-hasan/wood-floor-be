import { Request, Response } from "express";
import Slider, { ISlider } from "../models/Slider";
import fs from "fs";
import path from "path";

export const getSliders = async (req: Request, res: Response) => {
  try {
    const sliders = await Slider.find().sort({ order: 1 });
    res.json({
      success: true,
      message: "Sliders fetched successfully",
      data: sliders,
    });
  } catch (error) {
    console.error("Error fetching sliders:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching sliders",
      error,
    });
  }
};

export const createSlider = async (req: Request, res: Response) => {
  try {
    console.log("Create slider request body:", req.body);
    console.log("Create slider request file:", req.file);

    const { title, description, order, isActive } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

    console.log("Creating slider with image:", imageUrl);

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
        data: null,
      });
    }

    const slider = new Slider({
      title,
      description,
      imageUrl,
      order: order || 0,
      isActive: isActive === "true" || isActive === true,
    });

    await slider.save();
    res.status(201).json({
      success: true,
      message: "Slider created successfully",
      data: slider,
    });
  } catch (error) {
    console.error("Error in createSlider:", error);
    // If there was an error and a file was uploaded, delete it
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error("Error deleting file:", unlinkError);
      }
    }
    res.status(400).json({
      success: false,
      message: "Error creating slider",
      data: null,
      error,
    });
  }
};

export const updateSlider = async (req: Request, res: Response) => {
  try {
    console.log("Update slider request body:", req.body);
    console.log("Update slider request file:", req.file);

    const { id } = req.params;
    const { title, description, order, isActive } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

    console.log("Updating slider with image:", imageUrl);

    // Get current slider
    const currentSlider = await Slider.findById(id);
    if (!currentSlider) {
      if (req.file) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (unlinkError) {
          console.error("Error deleting file:", unlinkError);
        }
      }
      return res.status(404).json({
        success: false,
        message: "Slider not found",
        data: null,
      });
    }

    // If there's a new image and an old image exists, delete the old one
    if (imageUrl && currentSlider.imageUrl) {
      const oldImagePath = path.join(
        __dirname,
        "..",
        "..",
        "uploads",
        path.basename(currentSlider.imageUrl)
      );
      if (fs.existsSync(oldImagePath)) {
        try {
          fs.unlinkSync(oldImagePath);
        } catch (unlinkError) {
          console.error("Error deleting old file:", unlinkError);
        }
      }
    }

    const slider = await Slider.findByIdAndUpdate(
      id,
      {
        title,
        description,
        ...(imageUrl && { imageUrl }), // Only update imageUrl if a new image was uploaded
        order: order || currentSlider.order,
        isActive: isActive === "true" || isActive === true,
      },
      { new: true }
    );

    res.json({
      success: true,
      message: "Slider updated successfully",
      data: slider,
    });
  } catch (error) {
    console.error("Error in updateSlider:", error);
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error("Error deleting file:", unlinkError);
      }
    }
    res.status(400).json({
      success: false,
      message: "Error updating slider",
      data: null,
      error,
    });
  }
};

export const deleteSlider = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const slider = await Slider.findByIdAndDelete(id);

    if (!slider) {
      return res.status(404).json({ message: "Slider not found" });
    }

    res.json({ message: "Slider deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error deleting slider", error });
  }
};

export const createInitialSliders = async () => {
  try {
    const initialSliders = [
      {
        title: "Профессиональный уход за волосами",
        description: "Современные техники стрижки и окрашивания",
        imageUrl:
          "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3",
        order: 1,
        isActive: true,
      },
      {
        title: "Маникюр и педикюр",
        description: "Уход за руками и ногами",
        imageUrl:
          "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3",
        order: 2,
        isActive: true,
      },
      {
        title: "Массаж и спа-процедуры",
        description: "Релаксация и восстановление",
        imageUrl:
          "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?ixlib=rb-4.0.3",
        order: 3,
        isActive: true,
      },
    ];

    // Check if sliders already exist
    const existingSliders = await Slider.find();
    if (existingSliders.length === 0) {
      await Slider.insertMany(initialSliders);
      console.log("Initial sliders created successfully");
    }
  } catch (error) {
    console.error("Error creating initial sliders:", error);
  }
};
