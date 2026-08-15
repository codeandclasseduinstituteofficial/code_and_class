import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        contentId: {
            type: String,
            required: true,
            trim: true,
        },

        contentType: {
            type: String,
            enum: [
                "Class10",
                "Intermediate",
                "Quiz",
            ],
            required: true,
        },

        amount: {
            type: Number,
            required: true,
            min: 0,
        },

        paymentStatus: {
            type: String,
            enum: [
                "pending",
                "success",
                "failed",
            ],
            default: "pending",
        },

        paymentId: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);


// =====================================================
// INDEX
// =====================================================

purchaseSchema.index({
    user: 1,
    contentId: 1,
    contentType: 1,
    paymentStatus: 1,
});


export default mongoose.model(
    "Purchase",
    purchaseSchema
);