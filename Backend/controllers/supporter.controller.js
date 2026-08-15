import Supporter from "../models/supporter.model.js";

// Get all supporters
export const getAllSupporters = async (req, res) => {
  try {
    const supporters = await Supporter.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: supporters.length,
      data: supporters,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add supporter
export const addSupporter = async (req, res) => {
  try {
    const { imgLink, name, designation, description } = req.body;

    const supporter = await Supporter.create({
      imgLink,
      name,
      designation,
      description,
    });

    res.status(201).json({
      success: true,
      message: "Supporter added successfully",
      data: supporter,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update supporter
export const updateSupporter = async (req, res) => {
  try {
    const { id } = req.params;

    const supporter = await Supporter.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!supporter) {
      return res.status(404).json({
        success: false,
        message: "Supporter not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Supporter updated successfully",
      data: supporter,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete supporter
export const deleteSupporter = async (req, res) => {
  try {
    const { id } = req.params;

    const supporter = await Supporter.findByIdAndDelete(id);

    if (!supporter) {
      return res.status(404).json({
        success: false,
        message: "Supporter not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Supporter deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};