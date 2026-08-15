import express from 'express';
import {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
  getAllUsers,
  deleteUser,
  updateUser
} from '../controllers/user.controller.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh', refreshToken);
router.post('/logout', logoutUser);

router.get('/', protect, admin, getAllUsers);
router.delete('/:id', protect, admin, deleteUser);
router.put('/:id', protect, admin, updateUser);

export default router;
