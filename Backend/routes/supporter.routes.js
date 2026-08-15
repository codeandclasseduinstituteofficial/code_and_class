import express from 'express';
import { addSupporter, deleteSupporter, getAllSupporters, updateSupporter } from '../controllers/supporter.controller.js';

import { admin, protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get("/", getAllSupporters);

router.post("/", protect, admin, addSupporter);

router.put("/:id", protect, admin, updateSupporter);

router.delete("/:id", protect, admin, deleteSupporter);

export default router;
