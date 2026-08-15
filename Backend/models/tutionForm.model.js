import mongoose from "mongoose";

const mobileRegex = /^[6-9]\d{9}$/;

const TutionFormSchema = new mongoose.Schema(
    {
        // =====================================================
        // STUDENT DETAILS
        // =====================================================

        firstGrade: {
            type: String,
            required: true,
            trim: true,
        },

        studentName: {
            type: String,
            required: true,
            trim: true,
        },

        fatherName: {
            type: String,
            required: true,
            trim: true,
        },

        motherName: {
            type: String,
            required: true,
            trim: true,
        },

        nationality: {
            type: String,
            required: true,
            trim: true,
        },

        motherTongue: {
            type: String,
            required: true,
            trim: true,
        },

        gender: {
            type: String,
            enum: ["Male", "Female", "Other"],
            required: true,
        },

        firstLanguage: {
            type: String,
            required: true,
            trim: true,
        },

        secondLanguage: {
            type: String,
            required: true,
            trim: true,
        },

        dateOfBirth: {
            type: Date,
            required: true,
        },

        // =====================================================
        // IDENTIFICATION & ADDRESS
        // =====================================================

        identificationMark: {
            type: String,
            required: true,
            trim: true,
        },

        address: {
            type: String,
            required: true,
            trim: true,
        },

        // =====================================================
        // CONTACT DETAILS
        // =====================================================

        contactNumber1: {
            type: String,
            required: true,
            trim: true,
            match: [
                mobileRegex,
                "Please enter a valid 10-digit contact number",
            ],
        },

        contactNumber2: {
            type: String,
            trim: true,
            default: "",

            validate: {
                validator: function (value) {
                    // Optional field:
                    // empty string is allowed.
                    if (!value || value.trim() === "") {
                        return true;
                    }

                    return mobileRegex.test(value);
                },

                message:
                    "Please enter a valid 10-digit alternate contact number",
            },
        },

        // =====================================================
        // AADHAAR
        // =====================================================

        aadhaarNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            match: [
                /^\d{12}$/,
                "Aadhaar number must be exactly 12 digits",
            ],
        },

        // =====================================================
        // PAYMENT
        // =====================================================

        paymentMode: {
            type: String,
            enum: ["online", "offline"],
            required: true,
            default: "offline",
        },

        // =====================================================
        // APPLICATION FEE
        // ALWAYS ₹100
        // =====================================================

        applicationFee: {
            type: Number,
            default: 100,
        },

        // =====================================================
        // PAYMENT STATUS
        // =====================================================

        paymentStatus: {
            type: String,
            enum: ["pending", "paid"],
            default: "pending",
        },

        // =====================================================
        // ORDER
        // =====================================================

        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
        },
    },
    {
        timestamps: true,
    }
);

const TutionForm = mongoose.model(
    "TutionForm",
    TutionFormSchema
);

export default TutionForm;