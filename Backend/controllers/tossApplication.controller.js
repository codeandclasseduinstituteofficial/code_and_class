import TossApplication from "../models/tossApplication.model.js";

// =====================================================
// ADD TOSS APPLICATION
// =====================================================

export const addTossApplication = async (req, res) => {
  try {
    const {
      tossLevel,
      ...rest
    } = req.body;

    // =================================================
    // VALIDATE LEVEL
    // =================================================

    if (
      !["SSC", "Intermediate"].includes(
        tossLevel
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please select SSC or Intermediate",
      });
    }

    // =================================================
    // SERVER-SIDE APPLICATION FEE
    // =================================================

    const applicationFee =
      tossLevel === "Intermediate"
        ? 500
        : 100;

    // =================================================
    // INTERMEDIATE GROUP VALIDATION
    // =================================================

    if (
      tossLevel === "Intermediate" &&
      !rest.group
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Intermediate group is required",
      });
    }

    // =================================================
    // CREATE APPLICATION
    // =================================================

    const application =
      await TossApplication.create({
        ...rest,

        tossLevel,

        // Server decides fee
        applicationFee,
      });

    // =================================================
    // RESPONSE
    // =================================================

    res.status(201).json({
      success: true,

      message:
        "TOSS application submitted successfully",

      data: {
        _id: application._id,
        tossLevel:
          application.tossLevel,
        group:
          application.group || null,
        applicationFee:
          application.applicationFee,
        paymentMode:
          application.paymentMode,
        paymentStatus:
          application.paymentStatus,
      },
    });
  } catch (error) {
    console.error(
      "TOSS application error:",
      error
    );

    res.status(400).json({
      success: false,
      message:
        "Failed to submit TOSS application",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE TOSS APPLICATION
// =====================================================

export const updateTossApplication = async (
  req,
  res
) => {
  try {
    const {
      tossLevel,
      applicationFee,
      ...updateData
    } = req.body;

    // =================================================
    // IF LEVEL IS BEING UPDATED
    // =================================================

    if (tossLevel) {
      if (
        ![
          "SSC",
          "Intermediate",
        ].includes(tossLevel)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid TOSS level",
        });
      }

      updateData.tossLevel =
        tossLevel;

      // Recalculate fee on server
      updateData.applicationFee =
        tossLevel ===
          "Intermediate"
          ? 500
          : 100;

      // Intermediate requires group
      if (
        tossLevel ===
        "Intermediate" &&
        !updateData.group
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Intermediate group is required",
        });
      }

      // SSC doesn't need group
      if (
        tossLevel === "SSC"
      ) {
        updateData.group =
          undefined;
      }
    }

    const updated =
      await TossApplication.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message:
          "TOSS application not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "TOSS application updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        "Failed to update TOSS application",
      error: error.message,
    });
  }
};

// =====================================================
// DELETE
// =====================================================

export const deleteTossApplication = async (
  req,
  res
) => {
  try {
    const deleted =
      await TossApplication.findByIdAndDelete(
        req.params.id
      );

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message:
          "TOSS application not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "TOSS application deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Failed to delete TOSS application",
      error: error.message,
    });
  }
};

// =====================================================
// GET ALL
// =====================================================

export const getAllTossApplications = async (
  req,
  res
) => {
  try {
    const applications =
      await TossApplication.find()
        .sort({
          createdAt: -1,
        });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Failed to fetch TOSS applications",
      error: error.message,
    });
  }
};