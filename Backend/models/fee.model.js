import mongoose from "mongoose";

const paymentEntrySchema = new mongoose.Schema(
    {
        amount: { type: Number, required: true },
        date: { type: Date, default: Date.now },
        mode: { type: String, enum: ["online", "offline"], default: "offline" },
        note: { type: String, trim: true },
        recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    { _id: false }
);

const feeSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
        },

        // Free-text label for the fee if it isn't tied to a specific course
        // (e.g. "Tuition Fee", "TOSS Fee")
        label: {
            type: String,
            trim: true,
        },

        totalFee: {
            type: Number,
            required: true,
        },

        amountPaid: {
            type: Number,
            default: 0,
        },

        payments: [paymentEntrySchema],
    },
    { timestamps: true }
);

feeSchema.virtual("dueAmount").get(function () {
    return Math.max(this.totalFee - this.amountPaid, 0);
});

feeSchema.set("toJSON", { virtuals: true });
feeSchema.set("toObject", { virtuals: true });

export default mongoose.model("Fee", feeSchema);
