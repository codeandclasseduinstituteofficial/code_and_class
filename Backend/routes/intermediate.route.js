import express from "express";

import {
    createIntermediate,
    getIntermediate,
    getIntermediateById,
    updateIntermediate,
    deleteIntermediate,
    addChapter,
    addTopic,
    updateTopic,
    deleteTopic,
} from "../controllers/intermediate.controller.js";

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
    getIntermediate
);


// =====================================================
// GET ONE
// =====================================================

router.get(
    "/:id",
    getIntermediateById
);


// =====================================================
// ADMIN
// =====================================================

router.post(
    "/add",
    protect,
    admin,
    createIntermediate
);

router.put(
    "/:id",
    protect,
    admin,
    updateIntermediate
);

router.delete(
    "/:id",
    protect,
    admin,
    deleteIntermediate
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
// TOPIC / VIDEO
// =====================================================

router.post(
    "/:id/chapter/:chapterId/topic",
    protect,
    admin,
    addTopic
);

router.put(
    "/topic/:chapterId/:topicId",
    protect,
    admin,
    updateTopic
);

router.delete(
    "/topic/:chapterId/:topicId",
    protect,
    admin,
    deleteTopic
);

export default router;