import mongoose from "mongoose";
import ProgressModel from "../models/ProgressModel.js";

export const createProgress = async (req, res) => {
  try {
    const { description } = req.body;

    if (!req.user || !req.user.user_id) {
      return res.status(403).json({
        message: "User tidak terautentikasi",
        data: null
      });
    }

    if (!req.file || !description) {
      return res.status(400).json({
        message: "Image dan Deskripsi wajib diisi",
        data: null
      });
    }

    const imageUrl = `upload/${req.file.filename}`;

    const response = await ProgressModel.create({
      imageUrl,
      description,
      userId: new mongoose.Types.ObjectId(req.user.user_id),
      isPosted: false // ✅ default draft
    });

    return res.status(200).json({
      message: "Progress berhasil ditambahkan",
      data: response
    });
  } catch (error) {
    console.error("CREATE PROGRESS ERROR:", error);
    return res.status(500).json({
      message: error.message,
      data: null
    });
  }
};

// ✅ Feed publik (Dashboard)
export const listProgress = async (req, res) => {
  try {
    const response = await ProgressModel.find({ isPosted: true })
      .sort({ createdAt: -1 })
      .populate("userId", "username email");

    return res.status(200).json({
      message: "List semua progress yang sudah dipost",
      data: response
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error",
      error: error.message,
      data: null
    });
  }
};

// ✅ Draft milik user sendiri
export const listDraftProgress = async (req, res) => {
  try {
    const response = await ProgressModel.find({
      userId: req.user.user_id,
      isPosted: false
    })
      .sort({ createdAt: -1 })
      .populate("userId", "username email");

    return res.status(200).json({
      message: "List draft progress milik user",
      data: response
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error",
      error: error.message,
      data: null
    });
  }
};

export const detailProgress = async (req, res) => {
  try {
    const id = req.params?.id;

    if (!id) {
      return res.status(400).json({
        message: "Id progress wajib diisi",
        data: null
      });
    }

    const response = await ProgressModel.findOne({
      _id: id,
      userId: req.user.user_id
    });

    if (!response) {
      return res.status(404).json({
        message: "Progress tidak ditemukan",
        data: null
      });
    }

    return res.status(200).json({
      message: "Detail progress",
      data: response
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      data: null
    });
  }
};

export const updateProgress = async (req, res) => {
  try {
    const id = req.params?.id;
    const { description, isPosted } = req.body; // ✅ bisa update isPosted

    if (!id) {
      return res.status(400).json({
        message: "Id progress wajib diisi",
        data: null
      });
    }

    const updateData = {};
    if (description) updateData.description = description;
    if (typeof isPosted !== "undefined") updateData.isPosted = isPosted; // 🚀 publish

    if (req.file) {
      updateData.imageUrl = `upload/${req.file.filename}`;
    }

    const response = await ProgressModel.findOneAndUpdate(
      { _id: id, userId: req.user.user_id },
      updateData,
      { new: true }
    );

    if (!response) {
      return res.status(500).json({
        message: "Progress gagal diupdate",
        data: null
      });
    }

    return res.status(200).json({
      message: "Progress berhasil diupdate",
      data: response
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      data: null
    });
  }
};

export const deleteProgress = async (req, res) => {
  try {
    const id = req.params?.id;

    if (!id) {
      return res.status(400).json({
        message: "Id progress wajib diisi",
        data: null
      });
    }

    const response = await ProgressModel.findOneAndDelete({
      _id: id,
      userId: req.user.user_id
    });

    if (!response) {
      return res.status(404).json({
        message: "Progress tidak ditemukan",
        data: null
      });
    }

    return res.status(200).json({
      message: "Progress berhasil dihapus",
      data: null
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      data: null
    });
  }
};