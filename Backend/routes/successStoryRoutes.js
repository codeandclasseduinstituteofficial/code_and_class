import express from "express";
import { protect, admin } from "../middlewares/authMiddleware.js";
import { createSuccessStory, deleteSuccessStory, getSuccessStories } from "../controllers/successStoryController.js";

const router = express.Router();

router.get("/", getSuccessStories);

router.post(
    "/",
    protect,
    admin,
    createSuccessStory
);

router.delete(
    "/:id",
    protect,
    admin,
    deleteSuccessStory
);

export default router;