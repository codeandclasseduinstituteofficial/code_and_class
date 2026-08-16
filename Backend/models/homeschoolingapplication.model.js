import mongoose from "mongoose";

// =====================================================
// HOME SCHOOLING APPLICATION SCHEMA
// =====================================================

const homeSchoolingApplicationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        // ---- Parent / Guardian details ----
        salutation: {
            type: String,
            enum: {
                values: ["Mr", "Ms", "Mrs", "Dr"],
                message: "Please select a valid salutation.",
            },
            required: [true, "Salutation is required."],
        },

        parentName: {
            type: String,
            required: [true, "Parent/Guardian name is required."],
            trim: true,
        },

        relationToChild: {
            type: String,
            enum: {
                values: ["Father", "Mother", "Guardian"],
                message: "Please select a valid relation to child.",
            },
            required: [true, "Relation to child is required."],
        },

        mobileNumber: {
            type: String,
            required: [true, "Mobile number is required."],
            match: [/^[6-9]\d{9}$/, "Mobile number must be a valid 10-digit number."],
        },

        // Optional field — must be either empty or a valid 10-digit number.
        alternateMobileNumber: {
            type: String,
            default: "",
            validate: {
                validator: (v) => v === "" || v === undefined || v === null || /^[6-9]\d{9}$/.test(v),
                message: "Alternate mobile number must be a valid 10-digit number, or left empty.",
            },
        },

        email: {
            type: String,
            trim: true,
            lowercase: true,
        },

        // ---- Child details ----
        childName: {
            type: String,
            required: [true, "Child's name is required."],
            trim: true,
        },

        childDateOfBirth: {
            type: Date,
            required: [true, "Child's date of birth is required."],
        },

        childGender: {
            type: String,
            enum: {
                values: ["Male", "Female", "Other"],
                message: "Please select a valid gender.",
            },
            required: [true, "Child's gender is required."],
        },

        preferredBatchTiming: {
            type: String,
            enum: {
                values: ["Morning", "Afternoon", "Evening"],
                message: "Please select a valid batch timing.",
            },
            required: [true, "Preferred batch timing is required."],
        },

        // ---- Address ----
        state: { type: String, trim: true },
        district: { type: String, trim: true },
        mandal: { type: String, trim: true },
        village: { type: String, trim: true },

        // ---- Additional details ----
        isDifferentlyAbled: {
            type: Boolean,
            default: false,
        },

        hasPriorLearningExperience: {
            type: Boolean,
            default: false,
        },

        // Optional — allow empty string alongside the enum values.
        howDidYouHear: {
            type: String,
            enum: {
                values: [
                    "WhatsApp",
                    "YouTube",
                    "Instagram",
                    "Friend/Family Referral",
                    "Other",
                    "",
                ],
                message: "Please select a valid option for 'How did you hear about us'.",
            },
            default: "",
        },

        specialNotes: {
            type: String,
            trim: true,
            default: "",
        },

        // ---- Fee & payment ----
        applicationFee: {
            type: Number,
            default: 100,
            set: () => 100,
        },

        paymentMode: {
            type: String,
            enum: {
                values: ["online", "offline"],
                message: "Please select a valid payment mode.",
            },
            required: [true, "Payment mode is required."],
        },

        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending",
        },

        // ---- Application status ----
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
    },
    {
        timestamps: true,
    }
);

const HomeSchoolingApplication = mongoose.model(
    "HomeSchoolingApplication",
    homeSchoolingApplicationSchema
);

export default HomeSchoolingApplication;