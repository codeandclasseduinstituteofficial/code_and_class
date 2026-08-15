import express from "express";
import {
    createFee,
    getAllFees,
    recordPayment,
    updateFee,
    deleteFee,
    getMyFees,
} from "../controllers/fee.controller.js";
import { admin, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/my", protect, getMyFees);

router.route("/")
    .get(protect, admin, getAllFees)
    .post(protect, admin, createFee);

router.post("/:id/payments", protect, admin, recordPayment);

router.route("/:id")
    .put(protect, admin, updateFee)
    .delete(protect, admin, deleteFee);

export default router;
