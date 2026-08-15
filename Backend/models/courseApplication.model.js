import mongoose from "mongoose";

const courseApplicationSchema = new mongoose.Schema(
  {
    serialNo: {
      type: String,
      unique: true,
    },

    // ==============================
    // PERSONAL DETAILS
    // ==============================

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

    mobileNumber: {
      type: String,
      required: true,
      match: [
        /^[6-9]\d{9}$/,
        "Please enter a valid mobile number",
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

    dateOfBirth: {
      type: Date,
      required: true,
    },

    religion: {
      type: String,
      enum: ["Islam", "Hinduism", "Others"],
      required: true,
    },

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

    // ==============================
    // ADDRESS
    // ==============================

    state: {
      type: String,
      required: true,
      trim: true,
    },

    district: {
      type: String,
      required: true,
      trim: true,
    },

    mandal: {
      type: String,
      required: true,
      trim: true,
    },

    village: {
      type: String,
      required: true,
      trim: true,
    },

    // ==============================
    // SPECIAL CATEGORIES
    // ==============================

    isDifferentlyAbled: {
      type: Boolean,
      required: true,
      default: false,
    },

    changeDomicileAddress: {
      type: Boolean,
      required: true,
      default: false,
    },

    // ==============================
    // FAMILY
    // ==============================

    family: {
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
    },

    maritalStatus: {
      type: String,
      enum: [
        "Single",
        "Unmarried",
        "Married",
        "Divorcee",
        "Widow",
        "Widower",
      ],
      required: true,
    },

    // ==============================
    // EDUCATION
    // ==============================

    higherEducation: {
      type: String,
      required: true,
      trim: true,
    },

    trainingStatus: {
      type: String,
      enum: ["Fresher", "Experienced"],
      required: true,
    },

    course: {
      type: String,
      required: true,
      trim: true,
    },

    // ==============================
    // PAYMENT
    // ==============================

    paymentMode: {
      type: String,
      enum: ["online", "offline"],
      required: true,
      default: "offline",
    },

    // FIXED APPLICATION FEE
    applicationFee: {
      type: Number,
      default: 100,
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

const CourseApplication = mongoose.model(
  "CourseApplication",
  courseApplicationSchema
);

export default CourseApplication;