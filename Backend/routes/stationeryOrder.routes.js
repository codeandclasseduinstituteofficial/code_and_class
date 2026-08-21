import express from 'express';
import {
    createOfflineOrder,
    createOnlineOrder,
    verifyStationeryPayment,
    getMyStationeryOrders,
    getAllStationeryOrders,
    adminUpdateDeliveryStatus,
} from '../controllers/stationeryOrder.controller.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Admin routes — keep before the generic ones for clarity, mirrors the
// abroadApplication.routes.js convention used elsewhere in this app.
router.get('/admin/all', protect, admin, getAllStationeryOrders);
router.patch('/admin/:id/status', protect, admin, adminUpdateDeliveryStatus);

router.post('/offline', protect, createOfflineOrder);
router.post('/create-online-order', protect, createOnlineOrder);
router.post('/verify', protect, verifyStationeryPayment);
router.get('/my', protect, getMyStationeryOrders);

export default router;
