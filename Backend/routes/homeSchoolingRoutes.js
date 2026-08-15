import express from "express";

import { protect, admin } from "../middlewares/authMiddleware.js";
import { createHomeSchooling,
    getHomeSchooling,
    getSingleHomeSchooling,
    updateHomeSchooling,
    deleteHomeSchooling } from "../controllers/homeSchooling.controller.js";

const router = express.Router();


router.post(
  "/add", protect, admin,
  createHomeSchooling
);


router.get(
  "/",
  getHomeSchooling
);


router.get(
  "/:id", protect, admin,
  getSingleHomeSchooling
);


router.put(
  "/:id", protect, admin,
  updateHomeSchooling
);


router.delete(
  "/:id", protect, admin,
  deleteHomeSchooling
);


export default router;