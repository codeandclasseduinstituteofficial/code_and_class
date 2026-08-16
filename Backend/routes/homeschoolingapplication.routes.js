import express from "express";

import {
    createHomeSchoolingApplication,
    getAllHomeSchoolingApplications,
    getHomeSchoolingApplicationById,
    updateHomeSchoolingApplicationStatus,
    updateHomeSchoolingPaymentStatus,
    updateHomeSchoolingApplication,
    deleteHomeSchoolingApplication,
} from "../controllers/homeschoolingapplication.controller.js";

import { protect, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// =====================================================
// /api/homeSchoolingApplication
// =====================================================

router
    .route("/")
    .post(protect, createHomeSchoolingApplication)
    .get(protect, admin, getAllHomeSchoolingApplications);

// =====================================================
// /api/homeSchoolingApplication/:id
// =====================================================

router
    .route("/:id")
    .get(protect, getHomeSchoolingApplicationById)
    .put(protect, admin, updateHomeSchoolingApplication)
    .delete(protect, admin, deleteHomeSchoolingApplication);

// =====================================================
// Status
// =====================================================

router
    .route("/:id/status")
    .patch(protect, admin, updateHomeSchoolingApplicationStatus);

// =====================================================
// Payment status
// =====================================================

router
    .route("/:id/payment-status")
    .patch(protect, updateHomeSchoolingPaymentStatus);

export default router;
