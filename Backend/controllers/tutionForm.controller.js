import TutionForm from "../models/tutionForm.model.js";

// =====================================================
// REGISTER STUDENT
// =====================================================

export const registerStudent = async (req, res) => {
    try {
        const {
            firstGrade,
            studentName,
            fatherName,
            motherName,
            nationality,
            motherTongue,
            gender,
            firstLanguage,
            secondLanguage,
            dateOfBirth,
            identificationMark,
            address,
            contactNumber1,
            contactNumber2,
            aadhaarNumber,
            paymentMode,
        } = req.body;

        const student = await TutionForm.create({
            firstGrade,
            studentName,
            fatherName,
            motherName,
            nationality,
            motherTongue,
            gender,
            firstLanguage,
            secondLanguage,
            dateOfBirth,
            identificationMark,
            address,
            contactNumber1,
            contactNumber2,
            aadhaarNumber,
            paymentMode,

            // NEVER trust frontend for these
            applicationFee: 100,
            paymentStatus: "pending",
        });

        return res.status(201).json({
            success: true,
            message: "Tuition application submitted successfully",
            data: {
                _id: student._id,
                applicationFee: student.applicationFee,
                paymentMode: student.paymentMode,
                paymentStatus: student.paymentStatus,
            },
        });

    } catch (error) {
        console.error("Tution form error:", error);

        // =================================================
        // MONGOOSE VALIDATION ERROR
        // =================================================

        if (error.name === "ValidationError") {
            const errors = {};

            Object.keys(error.errors).forEach((field) => {
                errors[field] = error.errors[field].message;
            });

            return res.status(400).json({
                success: false,
                message: "Please correct the validation errors",
                errors,
            });
        }

        // =================================================
        // DUPLICATE AADHAAR
        // =================================================

        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "A student with this Aadhaar number already exists.",
                errors: {
                    aadhaarNumber:
                        "This Aadhaar number is already registered.",
                },
            });
        }

        // =================================================
        // OTHER ERROR
        // =================================================

        return res.status(500).json({
            success: false,
            message: "Student registration failed",
        });
    }
};

// =====================================================
// EDIT STUDENT
// =====================================================

export const editStudent = async (req, res) => {
    try {
        const updateData = {
            firstGrade: req.body.firstGrade,
            studentName: req.body.studentName,
            fatherName: req.body.fatherName,
            motherName: req.body.motherName,
            nationality: req.body.nationality,
            motherTongue: req.body.motherTongue,
            gender: req.body.gender,
            firstLanguage: req.body.firstLanguage,
            secondLanguage: req.body.secondLanguage,
            dateOfBirth: req.body.dateOfBirth,
            identificationMark: req.body.identificationMark,
            address: req.body.address,
            contactNumber1: req.body.contactNumber1,
            contactNumber2: req.body.contactNumber2,
            aadhaarNumber: req.body.aadhaarNumber,
            paymentMode: req.body.paymentMode,
        };

        // =================================================
        // DO NOT ALLOW FRONTEND TO CHANGE THESE
        // =================================================

        delete updateData.applicationFee;
        delete updateData.paymentStatus;
        delete updateData.order;

        const updatedStudent =
            await TutionForm.findByIdAndUpdate(
                req.params.id,
                updateData,
                {
                    new: true,
                    runValidators: true,
                }
            );

        if (!updatedStudent) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Student details updated successfully",
            data: {
                _id: updatedStudent._id,
                applicationFee: updatedStudent.applicationFee,
                paymentMode: updatedStudent.paymentMode,
                paymentStatus: updatedStudent.paymentStatus,
            },
        });

    } catch (error) {
        console.error("Edit student error:", error);

        if (error.name === "ValidationError") {
            const errors = {};

            Object.keys(error.errors).forEach((field) => {
                errors[field] = error.errors[field].message;
            });

            return res.status(400).json({
                success: false,
                message: "Please correct the validation errors",
                errors,
            });
        }

        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "A student with this Aadhaar number already exists.",
                errors: {
                    aadhaarNumber:
                        "This Aadhaar number is already registered.",
                },
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to update student details",
        });
    }
};

// =====================================================
// DELETE STUDENT
// =====================================================

export const deleteStudent = async (req, res) => {
    try {
        const deletedStudent =
            await TutionForm.findByIdAndDelete(req.params.id);

        if (!deletedStudent) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Student deleted successfully",
        });

    } catch (error) {
        console.error("Delete student error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete student",
        });
    }
};

// =====================================================
// GET ALL STUDENTS
// =====================================================

export const getAllStudents = async (req, res) => {
    try {
        const students = await TutionForm
            .find()
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: students.length,
            data: students,
        });

    } catch (error) {
        console.error("Get students error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch students",
        });
    }
};