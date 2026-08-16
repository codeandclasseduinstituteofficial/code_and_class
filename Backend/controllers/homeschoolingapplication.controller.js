import asyncHandler from "express-async-handler";
import HomeSchoolingApplication from "../models/homeschoolingapplication.model.js";

// =====================================================
// Helper: turn a Mongoose ValidationError into one readable string
// =====================================================
const formatValidationError = (err) => {
    if (err?.name === "ValidationError") {
        return Object.values(err.errors)
            .map((e) => e.message)
            .join(" ");
    }
    return null;
};

// =====================================================
// @desc    Submit a new Home Schooling application
// @route   POST /api/homeSchoolingApplication
// @access  Private
// =====================================================

export const createHomeSchoolingApplication = asyncHandler(async (req, res) => {
    if (!req.user?._id) {
        res.status(401);
        throw new Error("User authentication required.");
    }

    const {
        salutation,
        parentName,
        relationToChild,
        mobileNumber,
        alternateMobileNumber,
        email,
        childName,
        childDateOfBirth,
        childGender,
        preferredBatchTiming,
        state,
        district,
        mandal,
        village,
        isDifferentlyAbled,
        hasPriorLearningExperience,
        howDidYouHear,
        specialNotes,
        paymentMode,
    } = req.body;

    // ---- Explicit pre-checks (fast, clear messages before hitting the DB) ----
    const requiredFields = {
        salutation,
        parentName,
        relationToChild,
        mobileNumber,
        childName,
        childDateOfBirth,
        childGender,
        preferredBatchTiming,
        paymentMode,
    };

    const missingField = Object.entries(requiredFields).find(
        ([, value]) => value === undefined || value === null || value === ""
    );

    if (missingField) {
        res.status(400);
        throw new Error(`${missingField[0]} is required.`);
    }

    if (!/^[6-9]\d{9}$/.test(mobileNumber)) {
        res.status(400);
        throw new Error("Mobile number must be a valid 10-digit number.");
    }

    if (
        alternateMobileNumber &&
        alternateMobileNumber !== "" &&
        !/^[6-9]\d{9}$/.test(alternateMobileNumber)
    ) {
        res.status(400);
        throw new Error("Alternate mobile number must be a valid 10-digit number, or left empty.");
    }

    if (!["online", "offline"].includes(paymentMode)) {
        res.status(400);
        throw new Error("Payment mode must be either 'online' or 'offline'.");
    }

    try {
        const application = await HomeSchoolingApplication.create({
            user: req.user._id,
            salutation,
            parentName,
            relationToChild,
            mobileNumber,
            alternateMobileNumber: alternateMobileNumber || "",
            email,
            childName,
            childDateOfBirth,
            childGender,
            preferredBatchTiming,
            state,
            district,
            mandal,
            village,
            isDifferentlyAbled: Boolean(isDifferentlyAbled),
            hasPriorLearningExperience: Boolean(hasPriorLearningExperience),
            howDidYouHear: howDidYouHear || "",
            specialNotes: specialNotes || "",
            paymentMode,
        });

        res.status(201).json({
            success: true,
            message: "Home schooling application submitted successfully.",
            data: application,
        });
    } catch (err) {
        const friendlyMessage = formatValidationError(err);
        res.status(400);
        throw new Error(friendlyMessage || "Failed to submit application. Please check your inputs.");
    }
});


// =====================================================
// @desc    Get all Home Schooling applications
// @route   GET /api/homeSchoolingApplication
// @access  Private/Admin
// =====================================================

export const getAllHomeSchoolingApplications = asyncHandler(
    async (req, res) => {
        const applications = await HomeSchoolingApplication.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: applications.length,
            data: applications,
        });
    }
);

// =====================================================
// @desc    Get a single Home Schooling application
// @route   GET /api/homeSchoolingApplication/:id
// @access  Private
// =====================================================

export const getHomeSchoolingApplicationById = asyncHandler(
    async (req, res) => {
        const application = await HomeSchoolingApplication.findById(
            req.params.id
        ).populate("user", "name email");

        if (!application) {
            res.status(404);
            throw new Error("Application not found.");
        }

        const isOwner =
            application.user?._id?.toString() === req.user?._id?.toString();

        const isAdmin = req.user?.role === "admin";

        if (!isOwner && !isAdmin) {
            res.status(403);
            throw new Error(
                "You are not authorized to view this application."
            );
        }

        res.status(200).json({
            success: true,
            data: application,
        });
    }
);

// =====================================================
// @desc    Update application status
// @route   PATCH /api/homeSchoolingApplication/:id/status
// @access  Private/Admin
// =====================================================

export const updateHomeSchoolingApplicationStatus = asyncHandler(
    async (req, res) => {
        const { status } = req.body;

        if (!["pending", "approved", "rejected"].includes(status)) {
            res.status(400);
            throw new Error("Invalid status value.");
        }

        const application =
            await HomeSchoolingApplication.findByIdAndUpdate(
                req.params.id,
                { status },
                { new: true, runValidators: true }
            );

        if (!application) {
            res.status(404);
            throw new Error("Application not found.");
        }

        res.status(200).json({
            success: true,
            message: "Application status updated.",
            data: application,
        });
    }
);

// =====================================================
// @desc    Update payment status
// @route   PATCH /api/homeSchoolingApplication/:id/payment-status
// @access  Private
// =====================================================

export const updateHomeSchoolingPaymentStatus = asyncHandler(
    async (req, res) => {
        const { paymentStatus } = req.body;

        if (!["pending", "paid", "failed"].includes(paymentStatus)) {
            res.status(400);
            throw new Error("Invalid payment status value.");
        }

        const application =
            await HomeSchoolingApplication.findByIdAndUpdate(
                req.params.id,
                { paymentStatus },
                { new: true, runValidators: true }
            );

        if (!application) {
            res.status(404);
            throw new Error("Application not found.");
        }

        res.status(200).json({
            success: true,
            message: "Payment status updated.",
            data: application,
        });
    }
);

// =====================================================
// @desc    Generic admin update
// @route   PUT /api/homeSchoolingApplication/:id
// @access  Private/Admin
// =====================================================

export const updateHomeSchoolingApplication = asyncHandler(
    async (req, res) => {
        const allowedFields = ["paymentStatus", "status"];

        const updates = {};

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        if (Object.keys(updates).length === 0) {
            res.status(400);
            throw new Error("No valid fields provided to update.");
        }

        const application =
            await HomeSchoolingApplication.findByIdAndUpdate(
                req.params.id,
                updates,
                {
                    new: true,
                    runValidators: true,
                }
            );

        if (!application) {
            res.status(404);
            throw new Error("Application not found.");
        }

        res.status(200).json({
            success: true,
            message: "Application updated.",
            data: application,
        });
    }
);

// =====================================================
// @desc    Delete a Home Schooling application
// @route   DELETE /api/homeSchoolingApplication/:id
// @access  Private/Admin
// =====================================================

export const deleteHomeSchoolingApplication = asyncHandler(
    async (req, res) => {
        const application =
            await HomeSchoolingApplication.findByIdAndDelete(req.params.id);

        if (!application) {
            res.status(404);
            throw new Error("Application not found.");
        }

        res.status(200).json({
            success: true,
            message: "Application deleted.",
        });
    }
);