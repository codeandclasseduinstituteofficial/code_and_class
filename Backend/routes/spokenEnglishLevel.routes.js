import express from "express";
import {
    createLevel,
    getAllLevels,
    getLevelsBySkill,
    getLevelById,
    updateLevel,
    deleteLevel,
} from "../controllers/spokenEnglishLevel.controller.js";
import { admin, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/skill/:skill", getLevelsBySkill);

router.route("/")
    .get(getAllLevels)
    .post(protect, admin, createLevel);

router.route("/:id")
    .get(getLevelById)
    .put(protect, admin, updateLevel)
    .delete(protect, admin, deleteLevel);

export default router;
