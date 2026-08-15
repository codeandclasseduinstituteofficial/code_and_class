import express from 'express'
import { getAllNgos, addNgo, updateNgo, deleteNgo } from '../controllers/ngo.controller.js';
import { admin, protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Route to get all NGOs
router.get('/ngos', getAllNgos);

// Route to add a new NGO (optional)
router.post('/ngos', protect, admin, addNgo);

// Route to update an NGO by ID
router.put('/ngos/:id', protect, admin, updateNgo);

// Route to delete an NGO by ID
router.delete('/ngos/:id', protect, admin, deleteNgo);

export default router
