import express from "express";

import {
    getVideoDetails,
} from "../controllers/video.controller.js";

const router = express.Router();

router.get(
    "/:id",
    getVideoDetails
);

export default router;