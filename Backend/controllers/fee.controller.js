import asyncHandler from "express-async-handler";
import Fee from "../models/fee.model.js";

// @desc  Admin: create a fee record for a student (total amount they owe)
// @route POST /api/fees
// @access Private/Admin
export const createFee = asyncHandler(async (req, res) => {
    const { user, course, label, totalFee } = req.body;

    if (!user || !totalFee) {
        res.status(400);
        throw new Error("user and totalFee are required");
    }

    const fee = await Fee.create({ user, course, label, totalFee });
    res.status(201).json({ success: true, data: fee });
});

// @desc  Admin: list every student's fee records (who paid how much / who's due)
// @route GET /api/fees
// @access Private/Admin
export const getAllFees = asyncHandler(async (req, res) => {
    const fees = await Fee.find()
        .populate("user", "name email")
        .populate("course", "title")
        .sort({ createdAt: -1 });

    res.json({ success: true, data: fees });
});

// @desc  Admin: record a payment against a fee record (cash/offline or manual online entry)
// @route POST /api/fees/:id/payments
// @access Private/Admin
export const recordPayment = asyncHandler(async (req, res) => {
    const { amount, mode, note } = req.body;

    if (!amount || amount <= 0) {
        res.status(400);
        throw new Error("A valid payment amount is required");
    }

    const fee = await Fee.findById(req.params.id);
    if (!fee) {
        res.status(404);
        throw new Error("Fee record not found");
    }

    fee.payments.push({
        amount,
        mode: mode || "offline",
        note,
        recordedBy: req.user.id,
    });
    fee.amountPaid += Number(amount);
    await fee.save();

    res.json({ success: true, data: fee });
});

// @desc  Admin: update a fee record's total amount / label
// @route PUT /api/fees/:id
// @access Private/Admin
export const updateFee = asyncHandler(async (req, res) => {
    const { totalFee, label, course } = req.body;

    const fee = await Fee.findById(req.params.id);
    if (!fee) {
        res.status(404);
        throw new Error("Fee record not found");
    }

    if (totalFee !== undefined) fee.totalFee = totalFee;
    if (label !== undefined) fee.label = label;
    if (course !== undefined) fee.course = course;
    await fee.save();

    res.json({ success: true, data: fee });
});

// @desc  Admin: delete a fee record
// @route DELETE /api/fees/:id
// @access Private/Admin
export const deleteFee = asyncHandler(async (req, res) => {
    const fee = await Fee.findByIdAndDelete(req.params.id);

    if (!fee) {
        res.status(404);
        throw new Error("Fee record not found");
    }

    res.json({ success: true, message: "Fee record deleted" });
});

// @desc  Student: get my own fee records (used to show the "fees due" toast)
// @route GET /api/fees/my
// @access Private
export const getMyFees = asyncHandler(async (req, res) => {
    const fees = await Fee.find({ user: req.user.id })
        .populate("course", "title")
        .sort({ createdAt: -1 });

    res.json({ success: true, data: fees });
});
