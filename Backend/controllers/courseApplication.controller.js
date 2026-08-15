import CourseApplication from "../models/courseApplication.model.js";

export const addCourseApplication = async (req, res) => {
    try {
        const application = new CourseApplication({
            ...req.body,

            // Always use fixed application fee
            applicationFee: 100,
        });

        const savedApplication = await application.save();

        res.status(201).json({
            success: true,
            message: "Course application submitted successfully",
            data: {
                _id: savedApplication._id,
                applicationFee: 100,
                paymentMode: savedApplication.paymentMode,
            },
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to submit course application",
            error: error.message,
        });
    }
};

export const updateCourseApplication = async (req, res) => {
    try {
        const updatedApplication = await CourseApplication.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true, // return updated document
                runValidators: true, // run schema validations
            }
        );

        if (!updatedApplication) {
            return res.status(404).json({
                success: false,
                message: "Course application not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Course application updated successfully",
            //   data: updatedApplication,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to update course application",
            error: error.message,
        });
    }
};

export const deleteCourseApplication = async (req, res) => {
    try {
        const deletedApplication = await CourseApplication.findByIdAndDelete(
            req.params.id
        );

        if (!deletedApplication) {
            return res.status(404).json({
                success: false,
                message: "Course application not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Course application deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete course application",
            error: error.message,
        });
    }
};

export const getAllCourseApplications = async (req, res) => {
    try {
        const applications = await CourseApplication.find().sort({
            createdAt: -1, // latest first
        });

        res.status(200).json({
            success: true,
            count: applications.length,
            data: applications,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch course applications",
            error: error.message,
        });
    }
};