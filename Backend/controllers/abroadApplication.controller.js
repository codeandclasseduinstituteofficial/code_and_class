import asyncHandler from 'express-async-handler';

import AbroadApplication from '../models/abroadApplication.model.js';
import Order from '../models/order.model.js';

/*
|--------------------------------------------------------------------------
| CREATE APPLICATION
|--------------------------------------------------------------------------
| POST /api/abroadapplication
| Private
|
| Offline:
|   Application gets submitted immediately.
|
| Online:
|   Application is created with pending payment.
|   Frontend then calls create-application-order.
|--------------------------------------------------------------------------
*/

export const createAbroadApplication = asyncHandler(async (req, res) => {
    const {
        country,
        fullName,
        email,
        phone,
        dateOfBirth,
        city,
        qualification,
        percentage,
        course,
        intake,
        passport,
        paymentMode,
    } = req.body;

    if (!country) {
        res.status(400);
        throw new Error('Country is required');
    }

    if (!fullName) {
        res.status(400);
        throw new Error('Full name is required');
    }

    if (!email) {
        res.status(400);
        throw new Error('Email is required');
    }

    if (!phone) {
        res.status(400);
        throw new Error('Phone number is required');
    }

    if (!dateOfBirth) {
        res.status(400);
        throw new Error('Date of birth is required');
    }

    if (!city) {
        res.status(400);
        throw new Error('City is required');
    }

    if (!qualification) {
        res.status(400);
        throw new Error('Qualification is required');
    }

    if (!percentage) {
        res.status(400);
        throw new Error('Percentage / CGPA is required');
    }

    if (!['online', 'offline'].includes(paymentMode)) {
        res.status(400);
        throw new Error('Invalid payment mode');
    }

    /*
    |--------------------------------------------------------------------------
    | Prevent duplicate pending applications
    |--------------------------------------------------------------------------
    */

    const existingApplication = await AbroadApplication.findOne({
        user: req.user.id,
        country,
        status: {
            $nin: ['completed', 'rejected'],
        },
        paymentStatus: paymentMode === 'online' ? 'pending' : 'paid',
    });

    if (existingApplication) {
        res.status(400);
        throw new Error(
            'You already have an active application for this country'
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Create application
    |--------------------------------------------------------------------------
    */

    const application = await AbroadApplication.create({
        user: req.user.id,

        country,
        fullName,
        email,
        phone,
        dateOfBirth,
        city,
        qualification,
        percentage,
        course,
        intake,
        passport,

        applicationFee: 199,

        paymentMode,

        /*
         * Offline application is considered submitted immediately,
         * but payment is still pending.
         *
         * Online application is also created first, but payment remains pending.
         */
        paymentStatus: 'pending',

        status: 'submitted',
    });

    res.status(201).json({
        success: true,
        message:
            paymentMode === 'offline'
                ? 'Application submitted successfully'
                : 'Application created. Continue to payment.',

        application,
    });
});

/*
|--------------------------------------------------------------------------
| GET MY APPLICATIONS
|--------------------------------------------------------------------------
| GET /api/abroadapplication/my
| Private
|--------------------------------------------------------------------------
*/

export const getMyAbroadApplications = asyncHandler(async (req, res) => {
    const applications = await AbroadApplication.find({
        user: req.user.id,
    })
        .populate('order')
        .sort({ createdAt: -1 });

    res.json({
        success: true,
        applications,
    });
});

/*
|--------------------------------------------------------------------------
| GET SINGLE MY APPLICATION
|--------------------------------------------------------------------------
| GET /api/abroadapplication/:id
| Private
|--------------------------------------------------------------------------
*/

export const getMyAbroadApplication = asyncHandler(async (req, res) => {
    const application = await AbroadApplication.findOne({
        _id: req.params.id,
        user: req.user.id,
    }).populate('order');

    if (!application) {
        res.status(404);
        throw new Error('Application not found');
    }

    res.json({
        success: true,
        application,
    });
});

/*
|--------------------------------------------------------------------------
| UPDATE MY APPLICATION
|--------------------------------------------------------------------------
| PUT /api/abroadapplication/:id
| Private
|--------------------------------------------------------------------------
*/

export const updateMyAbroadApplication = asyncHandler(async (req, res) => {
    const application = await AbroadApplication.findOne({
        _id: req.params.id,
        user: req.user.id,
    });

    if (!application) {
        res.status(404);
        throw new Error('Application not found');
    }

    /*
     * Don't allow modification after payment.
     * You can remove this restriction if required.
     */

    if (application.paymentStatus === 'paid') {
        res.status(400);
        throw new Error(
            'Paid applications cannot be edited. Please contact support.'
        );
    }

    const allowedFields = [
        'country',
        'fullName',
        'email',
        'phone',
        'dateOfBirth',
        'city',
        'qualification',
        'percentage',
        'course',
        'intake',
        'passport',
    ];

    allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
            application[field] = req.body[field];
        }
    });

    await application.save();

    res.json({
        success: true,
        message: 'Application updated successfully',
        application,
    });
});

/*
|--------------------------------------------------------------------------
| DELETE MY APPLICATION
|--------------------------------------------------------------------------
| DELETE /api/abroadapplication/:id
| Private
|--------------------------------------------------------------------------
*/

export const deleteMyAbroadApplication = asyncHandler(async (req, res) => {
    const application = await AbroadApplication.findOne({
        _id: req.params.id,
        user: req.user.id,
    });

    if (!application) {
        res.status(404);
        throw new Error('Application not found');
    }

    if (application.paymentStatus === 'paid') {
        res.status(400);
        throw new Error(
            'Paid applications cannot be deleted. Please contact support.'
        );
    }

    await application.deleteOne();

    res.json({
        success: true,
        message: 'Application deleted successfully',
    });
});

/*
|--------------------------------------------------------------------------
| ADMIN - GET ALL APPLICATIONS
|--------------------------------------------------------------------------
| GET /api/abroadapplication/admin
| Private/Admin
|--------------------------------------------------------------------------
*/

export const getAllAbroadApplications = asyncHandler(async (req, res) => {
    const applications = await AbroadApplication.find()
        .populate('user', 'name email phone')
        .populate('order')
        .sort({ createdAt: -1 });

    res.json({
        success: true,
        count: applications.length,
        applications,
    });
});

/*
|--------------------------------------------------------------------------
| ADMIN - GET SINGLE APPLICATION
|--------------------------------------------------------------------------
| GET /api/abroadapplication/admin/:id
| Private/Admin
|--------------------------------------------------------------------------
*/

export const getAdminAbroadApplication = asyncHandler(async (req, res) => {
    const application = await AbroadApplication.findById(req.params.id)
        .populate('user', 'name email phone')
        .populate('order');

    if (!application) {
        res.status(404);
        throw new Error('Application not found');
    }

    res.json({
        success: true,
        application,
    });
});

/*
|--------------------------------------------------------------------------
| ADMIN - UPDATE APPLICATION
|--------------------------------------------------------------------------
| PUT /api/abroadapplication/admin/:id
| Private/Admin
|--------------------------------------------------------------------------
*/

export const adminUpdateAbroadApplication = asyncHandler(
    async (req, res) => {
        const application = await AbroadApplication.findById(req.params.id);

        if (!application) {
            res.status(404);
            throw new Error('Application not found');
        }

        const allowedFields = [
            'country',
            'fullName',
            'email',
            'phone',
            'dateOfBirth',
            'city',
            'qualification',
            'percentage',
            'course',
            'intake',
            'passport',
            'status',
            'adminNotes',
        ];

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                application[field] = req.body[field];
            }
        });

        if (req.body.status) {
            application.reviewedAt = new Date();
        }

        await application.save();

        res.json({
            success: true,
            message: 'Application updated successfully',
            application,
        });
    }
);

/*
|--------------------------------------------------------------------------
| ADMIN - MARK PAYMENT AS PAID
|--------------------------------------------------------------------------
| PATCH /api/abroadapplication/admin/:id/mark-paid
| Private/Admin
|--------------------------------------------------------------------------
*/

export const adminMarkApplicationPaid = asyncHandler(async (req, res) => {
    const application = await AbroadApplication.findById(req.params.id);

    if (!application) {
        res.status(404);
        throw new Error('Application not found');
    }

    if (application.paymentStatus === 'paid') {
        res.status(400);
        throw new Error('Application is already marked as paid');
    }

    application.paymentStatus = 'paid';
    application.paidAt = new Date();

    await application.save();

    res.json({
        success: true,
        message: 'Application marked as paid',
        application,
    });
});

/*
|--------------------------------------------------------------------------
| ADMIN - DELETE APPLICATION
|--------------------------------------------------------------------------
| DELETE /api/abroadapplication/admin/:id
| Private/Admin
|--------------------------------------------------------------------------
*/

export const adminDeleteAbroadApplication = asyncHandler(
    async (req, res) => {
        const application = await AbroadApplication.findById(req.params.id);

        if (!application) {
            res.status(404);
            throw new Error('Application not found');
        }

        /*
         * Optional:
         * Don't delete paid applications accidentally.
         */

        if (application.paymentStatus === 'paid') {
            res.status(400);
            throw new Error(
                'Paid application cannot be deleted without additional confirmation.'
            );
        }

        await application.deleteOne();

        res.json({
            success: true,
            message: 'Application deleted successfully',
        });
    }
);