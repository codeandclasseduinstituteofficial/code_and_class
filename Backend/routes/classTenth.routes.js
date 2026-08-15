import express from "express";

import {
    createClassTen,
    getClassTen,
    getClassTenById,
    updateClassTen,
    deleteClassTen,
    addChapter,
    addProblem,
    updateProblem,
    deleteProblem,
} from "../controllers/classTenth.controller.js";

import {
    admin,
    protect,
} from "../middlewares/authMiddleware.js";

const router = express.Router();


// =====================================================
// GET ALL
// =====================================================

router.get(
    "/",
    getClassTen
);


// =====================================================
// GET ONE
// =====================================================

router.get(
    "/:id",
    getClassTenById
);


// =====================================================
// ADMIN
// =====================================================

router.post(
    "/add",
    protect,
    admin,
    createClassTen
);

router.put(
    "/:id",
    protect,
    admin,
    updateClassTen
);

router.delete(
    "/:id",
    protect,
    admin,
    deleteClassTen
);


// =====================================================
// CHAPTER
// =====================================================

router.post(
    "/:id/chapter",
    protect,
    admin,
    addChapter
);


// =====================================================
// PROBLEM / VIDEO
// =====================================================

router.post(
    "/:id/chapter/:chapterId/problem",
    protect,
    admin,
    addProblem
);

router.put(
    "/problem/:chapterId/:problemId",
    protect,
    admin,
    updateProblem
);

router.delete(
    "/problem/:chapterId/:problemId",
    protect,
    admin,
    deleteProblem
);

export default router;