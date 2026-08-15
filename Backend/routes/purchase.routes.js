import express from "express";

import {
    createPurchase,
    markPurchaseSuccess,
    checkAccess,
} from "../controllers/purchase.controller.js";

import {
    protect,
} from "../middlewares/authMiddleware.js";

const router = express.Router();


// =====================================================
// CREATE PURCHASE
// =====================================================

router.post(
    "/create",
    protect,
    createPurchase
);


// =====================================================
// TEST PAYMENT SUCCESS
// =====================================================

router.put(
    "/success/:purchaseId",
    protect,
    markPurchaseSuccess
);


// =====================================================
// CHECK ACCESS
// =====================================================

router.get(
    "/access/:id",
    protect,
    checkAccess
);


export default router;