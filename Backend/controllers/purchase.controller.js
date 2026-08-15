import Purchase from "../models/Purchase.model.js";

// =====================================================
// CREATE PURCHASE
// =====================================================

export const createPurchase = async (req, res) => {
    try {
        const {
            contentId,
            contentType,
            amount,
        } = req.body;

        // =================================================
        // VALIDATION
        // =================================================

        if (!contentId) {
            return res.status(400).json({
                success: false,
                message: "contentId is required",
            });
        }

        if (!contentType) {
            return res.status(400).json({
                success: false,
                message: "contentType is required",
            });
        }

        if (
            !["Class10", "Intermediate"].includes(
                contentType
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid contentType",
            });
        }

        if (
            amount === undefined ||
            amount === null ||
            Number(amount) < 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Valid amount is required",
            });
        }

        // =================================================
        // CHECK EXISTING SUCCESSFUL PURCHASE
        // =================================================

        const existingPurchase =
            await Purchase.findOne({
                user: req.user.id,
                contentId,
                contentType,
                paymentStatus: "success",
            });

        if (existingPurchase) {
            return res.status(400).json({
                success: false,
                message:
                    "You already purchased this video",
                data: existingPurchase,
            });
        }

        // =================================================
        // CHECK EXISTING PENDING PURCHASE
        // =================================================

        const existingPending =
            await Purchase.findOne({
                user: req.user.id,
                contentId,
                contentType,
                paymentStatus: "pending",
            });

        if (existingPending) {
            return res.status(200).json({
                success: true,
                message:
                    "Pending purchase already exists",
                data: existingPending,
            });
        }

        // =================================================
        // CREATE PURCHASE
        // =================================================

        const purchase =
            await Purchase.create({
                user: req.user.id,
                contentId,
                contentType,
                amount: Number(amount),
                paymentStatus: "pending",
            });

        return res.status(201).json({
            success: true,
            message: "Purchase created",
            data: purchase,
        });

    } catch (error) {
        console.error(
            "Create purchase error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// =====================================================
// TEST PAYMENT SUCCESS
// =====================================================
// IMPORTANT:
// This is only for development/testing.
// Replace this with Razorpay/Stripe verification
// when you integrate a real payment gateway.
// =====================================================

export const markPurchaseSuccess = async (
    req,
    res
) => {
    try {
        const { purchaseId } = req.params;

        if (!purchaseId) {
            return res.status(400).json({
                success: false,
                message:
                    "purchaseId is required",
            });
        }

        const purchase =
            await Purchase.findOneAndUpdate(
                {
                    _id: purchaseId,
                    user: req.user.id,
                    paymentStatus: "pending",
                },
                {
                    $set: {
                        paymentStatus: "success",
                        paymentId:
                            `TEST-${Date.now()}`,
                    },
                },
                {
                    new: true,
                }
            );

        if (!purchase) {
            return res.status(404).json({
                success: false,
                message:
                    "Pending purchase not found",
            });
        }

        return res.status(200).json({
            success: true,
            message:
                "Payment marked as successful",
            data: purchase,
        });

    } catch (error) {
        console.error(
            "Mark purchase success error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// =====================================================
// CHECK ACCESS
// =====================================================

export const checkAccess = async (
    req,
    res
) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message:
                    "Video ID is required",
            });
        }

        const purchase =
            await Purchase.findOne({
                user: req.user.id,
                contentId: id,
                paymentStatus: "success",
            });

        return res.status(200).json({
            success: true,
            hasAccess:
                Boolean(purchase),
        });

    } catch (error) {
        console.error(
            "Check access error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};