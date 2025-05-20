import { Request, Response } from "express";
import RequestModel from "../models/Request";

export const createRequest = async (req: Request, res: Response) => {
  try {
    const {
      serviceId,
      name,
      phone,
      email,
      preferredDate,
      preferredTime,
      notes,
    } = req.body;

    const request = new RequestModel({
      serviceId,
      name,
      phone,
      email,
      preferredDate,
      preferredTime,
      notes,
    });

    await request.save();

    res.status(201).json({
      success: true,
      data: request,
    });
  } catch (error) {
    console.error("Error in createRequest:", error);
    res.status(500).json({
      success: false,
      message: "Ошибка при создании заявки",
    });
  }
};

export const getRequests = async (req: Request, res: Response) => {
  try {
    const requests = await RequestModel.find()
      .populate("serviceId", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: requests,
    });
  } catch (error) {
    console.error("Error in getRequests:", error);
    res.status(500).json({
      success: false,
      message: "Ошибка при получении заявок",
    });
  }
};

export const updateRequestStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const request = await RequestModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Заявка не найдена",
      });
    }

    res.json({
      success: true,
      data: request,
    });
  } catch (error) {
    console.error("Error in updateRequestStatus:", error);
    res.status(500).json({
      success: false,
      message: "Ошибка при обновлении статуса заявки",
    });
  }
};
