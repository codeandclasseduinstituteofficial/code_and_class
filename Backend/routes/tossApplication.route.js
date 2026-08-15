import express from "express";
import {
  addTossApplication,
  updateTossApplication,
  deleteTossApplication,
  getAllTossApplications,
} from "../controllers/tossApplication.controller.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, admin, getAllTossApplications);
router.post("/", addTossApplication);
router.put("/:id", protect, admin, updateTossApplication);
router.delete("/:id", protect, admin, deleteTossApplication);

export default router;
