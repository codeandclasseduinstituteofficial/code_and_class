import mongoose from 'mongoose';

const abroadApplicationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },

        // Destination
        country: {
            type: String,
            required: true,
            trim: true,
        },

        // Student details
        fullName: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },

        phone: {
            type: String,
            required: true,
            trim: true,
        },

        dateOfBirth: {
            type: Date,
            required: true,
        },

        city: {
            type: String,
            required: true,
            trim: true,
        },

        qualification: {
            type: String,
            required: true,
            trim: true,
        },

        percentage: {
            type: String,
            required: true,
            trim: true,
        },

        course: {
            type: String,
            trim: true,
            default: '',
        },

        intake: {
            type: String,
            trim: true,
            default: '',
        },

        passport: {
            type: String,
            trim: true,
            default: '',
        },

        // Payment
        applicationFee: {
            type: Number,
            required: true,
            default: 199,
        },

        paymentMode: {
            type: String,
            enum: ['online', 'offline'],
            required: true,
        },

        paymentStatus: {
            type: String,
            enum: ['pending', 'paid', 'failed'],
            default: 'pending',
        },

        // Razorpay order reference
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
            default: null,
        },

        razorpayPaymentId: {
            type: String,
            default: null,
        },

        // Application status
        status: {
            type: String,
            enum: [
                'submitted',
                'under_review',
                'contacted',
                'processing',
                'completed',
                'rejected',
            ],
            default: 'submitted',
        },

        // Admin notes
        adminNotes: {
            type: String,
            default: '',
            trim: true,
        },

        // Tracking
        reviewedAt: {
            type: Date,
            default: null,
        },

        paidAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const AbroadApplication = mongoose.model(
    'AbroadApplication',
    abroadApplicationSchema
);

export default AbroadApplication;