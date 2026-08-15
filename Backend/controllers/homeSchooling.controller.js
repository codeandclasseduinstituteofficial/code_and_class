import HomeSchooling from "../models/homeSchooling.model.js";


// Add Home Schooling
export const createHomeSchooling = async (req, res) => {
  try {
    const { title, videoLink, ageLimit } = req.body;

    const data = await HomeSchooling.create({
      title,
      videoLink,
      ageLimit
    });

    res.status(201).json({
      success: true,
      message: "Home schooling added successfully",
      data
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// Get All Home Schooling
export const getHomeSchooling = async (req, res) => {
  try {
    const data = await HomeSchooling.find();

    res.status(200).json({
      success: true,
      data
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// Get Single Home Schooling
export const getSingleHomeSchooling = async (req, res) => {
  try {
    const data = await HomeSchooling.findById(req.params.id);

    res.status(200).json({
      success: true,
      data
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// Update Home Schooling
export const updateHomeSchooling = async (req, res) => {
  try {
    const data = await HomeSchooling.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Updated successfully",
      data
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// Delete Home Schooling
export const deleteHomeSchooling = async (req, res) => {
  try {
    await HomeSchooling.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};