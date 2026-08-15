import mongoose from "mongoose";

const TossApplicationSchema = new mongoose.Schema(
  {
    // =====================================================
    // APPLICATION LEVEL
    // =====================================================

    tossLevel: {
      type: String,
      enum: ["SSC", "Intermediate"],
      required: true,
    },

    // =====================================================
    // STUDENT DETAILS
    // =====================================================

    firstGrade: {
      type: String,
      required: true,
      trim: true,
    },

    salutation: {
      type: String,
      enum: ["Mr", "Ms", "Mrs", "Dr"],
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
    // CONTACT
    // =====================================================

    contactNumber1: {
      type: String,
      required: true,
      match: [
        /^[6-9]\d{9}$/,
        "Please enter a valid Contact Number 1",
      ],
    },

    contactNumber2: {
      type: String,
      match: [
        /^[6-9]\d{9}$/,
        "Please enter a valid Contact Number 2",
      ],
    },

    aadhaarLinkedMobile: {
      type: String,
      match: [
        /^[6-9]\d{9}$/,
        "Please enter a valid Aadhaar linked mobile number",
      ],
    },

    aadhaarNumber: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^\d{12}$/,
        "Aadhaar number must be 12 digits",
      ],
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [
        /^\S+@\S+\.\S+$/,
        "Please enter a valid email address",
      ],
    },

    // =====================================================
    // CATEGORY
    // =====================================================

    category: {
      type: String,
      enum: [
        "OBC",
        "ST",
        "SC",
        "GEN",
        "Not Disclosed",
      ],
      required: true,
    },

    // =====================================================
    // INTERMEDIATE GROUP
    // =====================================================

    tossLevel: {
      type: String,
      enum: ["10th Class", "Intermediate"],
      required: true,
    },

    subjectsOpted: {
      type: String,
      required: true,
    },

    group: {
      type: String,
      trim: true,
      required: function () {
        return this.tossLevel === "Intermediate";
      },
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

    // IMPORTANT:
    // This value is calculated by the controller.
    // Frontend should NOT be trusted for this value.

    applicationFee: {
      type: Number,
      enum: [500, 500],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  },
  {
    timestamps: true,
  }
);

const TossApplication =
  mongoose.model(
    "TossApplication",
    TossApplicationSchema
  );

export default TossApplication;
