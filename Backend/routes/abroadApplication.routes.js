import express from 'express';

import {
    createAbroadApplication,
    getMyAbroadApplications,
    getMyAbroadApplication,
    updateMyAbroadApplication,
    deleteMyAbroadApplication,

    getAllAbroadApplications,
    getAdminAbroadApplication,
    adminUpdateAbroadApplication,
    adminMarkApplicationPaid,
    adminDeleteAbroadApplication,
} from '../controllers/abroadApplication.controller.js';

import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

/*
|--------------------------------------------------------------------------
| ADMIN ROUTES
| Keep these BEFORE /:id
|--------------------------------------------------------------------------
*/

router.get(
    '/admin/all',
    protect,
    admin,
    getAllAbroadApplications
);

router.get(
    '/admin/:id',
    protect,
    admin,
    getAdminAbroadApplication
);

router.put(
    '/admin/:id',
    protect,
    admin,
    adminUpdateAbroadApplication
);

router.patch(
    '/admin/:id/mark-paid',
    protect,
    admin,
    adminMarkApplicationPaid
);

router.delete(
    '/admin/:id',
    protect,
    admin,
    adminDeleteAbroadApplication
);

/*
|--------------------------------------------------------------------------
| USER ROUTES
|--------------------------------------------------------------------------
*/

router.post(
    '/',
    protect,
    createAbroadApplication
);

router.get(
    '/my',
    protect,
    getMyAbroadApplications
);

router.get(
    '/:id',
    protect,
    getMyAbroadApplication
);

router.put(
    '/:id',
    protect,
    updateMyAbroadApplication
);

router.delete(
    '/:id',
    protect,
    deleteMyAbroadApplication
);

export default router;