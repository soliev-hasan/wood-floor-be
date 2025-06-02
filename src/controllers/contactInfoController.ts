import { Request, Response } from "express";
import ContactInfo from "../models/ContactInfo";
import mongoose from "mongoose";

export const getContactInfo = async (req: Request, res: Response) => {
  try {
    // Проверяем подключение к MongoDB
    if (mongoose.connection.readyState !== 1) {
      console.error(
        "MongoDB connection is not ready. State:",
        mongoose.connection.readyState
      );
      throw new Error("Database connection is not ready");
    }

    // Try to find the first contact info document
    let contactInfo = await ContactInfo.findOne();
    console.log("Find result:", contactInfo);

    if (!contactInfo) {
      // Create document with default values if it doesn't exist
      contactInfo = await ContactInfo.create({
        phone: "651-999-94-96",
        email: "woodfloorsllc1@gmail.com",
        address: "14300 34th Ave N Plymouth MN 55447",
        socialLinks: {
          instagram: "https://www.instagram.com/woodfloorsllc",
          facebook: "https://www.facebook.com/share/1XB8BJd6TX",
          whatsapp: "https://wa.me/message/GOINJV7Y4UEMO1",
        },
      });
      console.log("Default contact info created:", contactInfo);
    }

    res.json({ success: true, data: contactInfo });
  } catch (error) {
    console.error("Detailed error in getContactInfo:", {
      error: error,
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      mongooseState: mongoose.connection.readyState,
    });

    res.status(500).json({
      success: false,
      message: "Error fetching contact info",
      error: error instanceof Error ? error.message : "Unknown error",
      details:
        process.env.NODE_ENV === "development"
          ? {
              stack: error instanceof Error ? error.stack : undefined,
              mongooseState: mongoose.connection.readyState,
            }
          : undefined,
    });
  }
};

export const updateContactInfo = async (req: Request, res: Response) => {
  try {
    // Проверяем подключение к MongoDB
    if (mongoose.connection.readyState !== 1) {
      console.error(
        "MongoDB connection is not ready. State:",
        mongoose.connection.readyState
      );
      throw new Error("Database connection is not ready");
    }

    const { phone, email, address, socialLinks } = req.body;
    console.log("Updating contact info with:", {
      phone,
      email,
      address,
      socialLinks,
    });

    // Try to find and update the first contact info document
    const contactInfo = await ContactInfo.findOneAndUpdate(
      {}, // Empty filter to match first document
      { phone, email, address, socialLinks },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );
    console.log("Update result:", contactInfo);

    res.json({ success: true, data: contactInfo });
  } catch (error) {
    console.error("Detailed error in updateContactInfo:", {
      error: error,
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      mongooseState: mongoose.connection.readyState,
    });

    res.status(500).json({
      success: false,
      message: "Error updating contact info",
      error: error instanceof Error ? error.message : "Unknown error",
      details:
        process.env.NODE_ENV === "development"
          ? {
              stack: error instanceof Error ? error.stack : undefined,
              mongooseState: mongoose.connection.readyState,
            }
          : undefined,
    });
  }
};
