import express from "express";

import {
    approveStudentVoice,
    createStudentVoice,
    deleteStudentVoice,
    getStudentVoices,
    getAllStudentVoicesAdmin,
    getHomeSchoolingVoices
} from "../controllers/studentVoiceController.js";

import { protect, admin } from "../middlewares/authMiddleware.js";


const router = express.Router();


// Public approved voices
router.get(
    "/",
    getStudentVoices
);

router.get(
    "/get-homeschooling-voices",
    getHomeSchoolingVoices
);


// Student submit
router.post(
    "/",
    protect,
    createStudentVoice
);


// Admin get all voices
router.get(
    "/admin/all",
    protect,
    admin,
    getAllStudentVoicesAdmin
);


// Approve
router.put(
    "/approve/:id",
    protect,
    admin,
    approveStudentVoice
);


// Delete
router.delete(
    "/:id",
    protect,
    admin,
    deleteStudentVoice
);


export default router;