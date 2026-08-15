import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthProvider";
import { authAxios } from "../../utils/authAxios";

// =====================================================
// REUSABLE INPUT
// =====================================================

const Input = ({
    label,
    name,
    value,
    onChange,
    type = "text",
    required = true,
    placeholder = "",
    maxLength,
}) => {
    return (
        <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
                {label}
                {required && (
                    <span className="text-red-500 ml-1">*</span>
                )}
            </label>

            <input
                type={type}
                name={name}
                value={value ?? ""}
                onChange={onChange}
                required={required}
                placeholder={placeholder}
                maxLength={maxLength}
                className="
                    w-full rounded-xl border border-slate-300
                    px-4 py-3 outline-none
                    focus:ring-2 focus:ring-indigo-500
                    focus:border-indigo-500
                    transition
                "
            />
        </div>
    );
};

// =====================================================
// REUSABLE TEXTAREA
// =====================================================

const TextArea = ({
    label,
    name,
    value,
    onChange,
    required = true,
    rows = 4,
    placeholder = "",
}) => {
    return (
        <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
                {label}
                {required && (
                    <span className="text-red-500 ml-1">*</span>
                )}
            </label>

            <textarea
                name={name}
                value={value ?? ""}
                onChange={onChange}
                required={required}
                rows={rows}
                placeholder={placeholder}
                className="
                    w-full rounded-xl border border-slate-300
                    px-4 py-3 outline-none
                    focus:ring-2 focus:ring-indigo-500
                    focus:border-indigo-500
                    transition
                    resize-none
                "
            />
        </div>
    );
};

// =====================================================
// REUSABLE SELECT
// =====================================================

const Select = ({
    label,
    name,
    value,
    onChange,
    children,
    required = true,
}) => {
    return (
        <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
                {label}
                {required && (
                    <span className="text-red-500 ml-1">*</span>
                )}
            </label>

            <select
                name={name}
                value={value ?? ""}
                onChange={onChange}
                required={required}
                className="
                    w-full rounded-xl border border-slate-300
                    px-4 py-3 bg-white
                    focus:ring-2 focus:ring-indigo-500
                    focus:border-indigo-500
                    outline-none
                "
            >
                <option value="">
                    Select {label}
                </option>

                {children}
            </select>
        </div>
    );
};

// =====================================================
// INITIAL FORM DATA
// =====================================================

const initialFormData = {
    firstGrade: "",
    studentName: "",
    fatherName: "",
    motherName: "",
    nationality: "",
    motherTongue: "",
    gender: "",
    firstLanguage: "",
    secondLanguage: "",
    dateOfBirth: "",
    identificationMark: "",
    address: "",
    contactNumber1: "",
    contactNumber2: "",
    aadhaarNumber: "",
    paymentMode: "offline",
};

// =====================================================
// MAIN COMPONENT
// =====================================================

const TuitionApplication = () => {
    const navigate = useNavigate();

    const { accessToken } = useContext(AuthContext);

    const api = authAxios(() => accessToken);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");

    // =================================================
    // FIXED APPLICATION FEE
    // =================================================

    const APPLICATION_FEE = 100;

    // =================================================
    // FORM DATA
    // =================================================

    const [formData, setFormData] = useState(
        initialFormData
    );

    // =================================================
    // HANDLE CHANGE
    // =================================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        let newValue = value;

        // ---------------------------------------------
        // CONTACT NUMBERS
        // ---------------------------------------------

        if (
            name === "contactNumber1" ||
            name === "contactNumber2"
        ) {
            newValue = value
                .replace(/\D/g, "")
                .slice(0, 10);
        }

        // ---------------------------------------------
        // AADHAAR
        // ---------------------------------------------

        if (name === "aadhaarNumber") {
            newValue = value
                .replace(/\D/g, "")
                .slice(0, 12);
        }

        setFormData((prev) => ({
            ...prev,
            [name]: newValue,
        }));
    };

    // =================================================
    // SHOW ERROR
    // =================================================

    const showError = (text) => {
        setMessageType("error");
        setMessage(text);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // =================================================
    // HANDLE SUBMIT
    // =================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        // ---------------------------------------------
        // IMPORTANT
        // DO NOT CALL API BEFORE VALIDATION
        // ---------------------------------------------

        setMessage("");

        const contactNumber1 =
            formData.contactNumber1.trim();

        const contactNumber2 =
            formData.contactNumber2.trim();

        const aadhaarNumber =
            formData.aadhaarNumber.trim();

        // =================================================
        // CONTACT NUMBER 1 VALIDATION
        // =================================================

        if (!/^[6-9]\d{9}$/.test(contactNumber1)) {
            showError(
                "Please enter a valid 10-digit Contact Number 1."
            );
            return;
        }

        // =================================================
        // CONTACT NUMBER 2 VALIDATION
        // OPTIONAL
        // =================================================

        if (
            contactNumber2 !== "" &&
            !/^[6-9]\d{9}$/.test(contactNumber2)
        ) {
            showError(
                "Please enter a valid 10-digit Contact Number 2, or leave it empty."
            );
            return;
        }

        // =================================================
        // AADHAAR VALIDATION
        // =================================================

        if (!/^\d{12}$/.test(aadhaarNumber)) {
            showError(
                "Aadhaar Number must contain exactly 12 digits."
            );
            return;
        }

        // =================================================
        // DATE OF BIRTH VALIDATION
        // =================================================

        if (!formData.dateOfBirth) {
            showError(
                "Please select the student's Date of Birth."
            );
            return;
        }

        // =================================================
        // PAYMENT MODE VALIDATION
        // =================================================

        if (
            !["online", "offline"].includes(
                formData.paymentMode
            )
        ) {
            showError(
                "Please select a valid payment mode."
            );
            return;
        }

        // =================================================
        // API REQUEST
        // Only reached when validation passes
        // =================================================

        try {
            setLoading(true);
            setMessage("");

            const payload = {
                ...formData,

                contactNumber1,
                contactNumber2,
                aadhaarNumber,

                // We don't trust the frontend fee.
                // Backend will force it to 100.
            };

            // console.log(
            //     "Submitting tuition application:",
            //     payload
            // );

            const { data } = await api.post(
                "/tutionForm",
                payload,
                {
                    withCredentials: true,
                }
            );

            // console.log(
            //     "Tuition application response:",
            //     data
            // );

            const applicationId =
                data?.data?._id;

            // =================================================
            // ONLINE PAYMENT
            // =================================================

            if (
                formData.paymentMode === "online" &&
                applicationId
            ) {
                navigate(
                    `/application-payment/tuition/${applicationId}`
                );

                return;
            }

            // =================================================
            // OFFLINE PAYMENT
            // =================================================

            setMessageType("success");

            setMessage(
                "Tuition application submitted successfully. Application fee: ₹100 (Offline)."
            );

            // =================================================
            // RESET FORM
            // =================================================

            setFormData(initialFormData);

            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        } catch (error) {
            console.error(
                "Tuition application error:",
                error
            );

            // ---------------------------------------------
            // MONGOOSE VALIDATION ERROR
            // ---------------------------------------------

            const serverMessage =
                error.response?.data?.message;

            const serverError =
                error.response?.data?.error;

            setMessageType("error");

            setMessage(
                serverError ||
                serverMessage ||
                "Something went wrong while submitting the application."
            );

            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        } finally {
            setLoading(false);
        }
    };

    // =================================================
    // RETURN
    // =================================================

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-5 md:py-20">

            <div
                className="
                    max-w-5xl mx-auto
                    bg-white
                    rounded-3xl
                    shadow-xl
                    border border-slate-200
                    p-6 md:p-12
                "
            >

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="text-center mb-10">

                    <h1
                        className="
                            text-3xl md:text-4xl
                            font-bold
                            text-slate-800
                        "
                    >
                        Tuition Application Form
                    </h1>

                    <p className="text-slate-500 mt-3">
                        Please fill in all the details carefully.
                    </p>

                </div>

                {/* =================================================
                    MESSAGE
                ================================================= */}

                {message && (
                    <div
                        className={`
                            mb-6
                            p-4
                            rounded-xl
                            text-center
                            font-medium
                            ${messageType === "error"
                                ? "bg-red-50 border border-red-200 text-red-700"
                                : "bg-green-50 border border-green-200 text-green-700"
                            }
                        `}
                    >
                        {message}
                    </div>
                )}

                {/* =================================================
                    FORM
                ================================================= */}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-10"
                    noValidate
                >

                    {/* =================================================
                        STUDENT DETAILS
                    ================================================= */}

                    <section>

                        <h2
                            className="
                                text-xl font-bold
                                text-slate-800
                                border-b
                                pb-3
                                mb-6
                            "
                        >
                            Student Details
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">

                            {/* First Grade */}

                            <Select
                                label="First Grade"
                                name="firstGrade"
                                value={formData.firstGrade}
                                onChange={handleChange}
                            >
                                <option value="Nursery">
                                    Nursery
                                </option>

                                <option value="LKG">
                                    LKG
                                </option>

                                <option value="UKG">
                                    UKG
                                </option>

                                <option value="1st Grade">
                                    1st Grade
                                </option>

                                <option value="2nd Grade">
                                    2nd Grade
                                </option>

                                <option value="3rd Grade">
                                    3rd Grade
                                </option>

                                <option value="4th Grade">
                                    4th Grade
                                </option>

                                <option value="5th Grade">
                                    5th Grade
                                </option>

                                <option value="6th Grade">
                                    6th Grade
                                </option>

                                <option value="7th Grade">
                                    7th Grade
                                </option>

                                <option value="8th Grade">
                                    8th Grade
                                </option>

                                <option value="9th Grade">
                                    9th Grade
                                </option>

                                <option value="10th Grade">
                                    10th Grade
                                </option>
                            </Select>

                            {/* Student Name */}

                            <Input
                                label="Student Name"
                                name="studentName"
                                value={formData.studentName}
                                onChange={handleChange}
                                placeholder="Enter student name"
                            />

                            {/* Father Name */}

                            <Input
                                label="Father Name"
                                name="fatherName"
                                value={formData.fatherName}
                                onChange={handleChange}
                                placeholder="Enter father's name"
                            />

                            {/* Mother Name */}

                            <Input
                                label="Mother Name"
                                name="motherName"
                                value={formData.motherName}
                                onChange={handleChange}
                                placeholder="Enter mother's name"
                            />

                            {/* Nationality */}

                            <Input
                                label="Nationality"
                                name="nationality"
                                value={formData.nationality}
                                onChange={handleChange}
                                placeholder="Enter nationality"
                            />

                            {/* Mother Tongue */}

                            <Input
                                label="Mother Tongue"
                                name="motherTongue"
                                value={formData.motherTongue}
                                onChange={handleChange}
                                placeholder="Enter mother tongue"
                            />

                            {/* Gender */}

                            <Select
                                label="Gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                            >
                                <option value="Male">
                                    Male
                                </option>

                                <option value="Female">
                                    Female
                                </option>

                                <option value="Other">
                                    Other
                                </option>
                            </Select>

                            {/* First Language */}

                            <Input
                                label="First Language"
                                name="firstLanguage"
                                value={formData.firstLanguage}
                                onChange={handleChange}
                                placeholder="Enter first language"
                            />

                            {/* Second Language */}

                            <Input
                                label="Second Language"
                                name="secondLanguage"
                                value={formData.secondLanguage}
                                onChange={handleChange}
                                placeholder="Enter second language"
                            />

                            {/* Date of Birth */}

                            <Input
                                label="Date of Birth"
                                name="dateOfBirth"
                                type="date"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                            />

                        </div>

                    </section>

                    {/* =================================================
                        IDENTIFICATION & ADDRESS
                    ================================================== */}

                    <section>

                        <h2
                            className="
                                text-xl font-bold
                                text-slate-800
                                border-b
                                pb-3
                                mb-6
                            "
                        >
                            Identification & Address
                        </h2>

                        <div className="space-y-6">

                            <TextArea
                                label="Identification Mark"
                                name="identificationMark"
                                value={
                                    formData.identificationMark
                                }
                                onChange={handleChange}
                                rows={5}
                                placeholder="Enter the student's identification mark"
                            />

                            <TextArea
                                label="Address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                rows={6}
                                placeholder="Enter complete residential address"
                            />

                        </div>

                    </section>

                    {/* =================================================
                        CONTACT DETAILS
                    ================================================== */}

                    <section>

                        <h2
                            className="
                                text-xl font-bold
                                text-slate-800
                                border-b
                                pb-3
                                mb-6
                            "
                        >
                            Contact & Aadhaar Details
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">

                            {/* Contact Number 1 */}

                            <Input
                                label="Contact Number 1"
                                name="contactNumber1"
                                type="tel"
                                value={
                                    formData.contactNumber1
                                }
                                onChange={handleChange}
                                required={true}
                                maxLength={10}
                                placeholder="Enter 10-digit mobile number"
                            />

                            {/* Contact Number 2 */}

                            <Input
                                label="Contact Number 2"
                                name="contactNumber2"
                                type="tel"
                                value={
                                    formData.contactNumber2
                                }
                                onChange={handleChange}
                                required={false}
                                maxLength={10}
                                placeholder="Optional 10-digit mobile number"
                            />

                            {/* Aadhaar */}

                            <Input
                                label="Aadhaar Number"
                                name="aadhaarNumber"
                                type="text"
                                value={
                                    formData.aadhaarNumber
                                }
                                onChange={handleChange}
                                required={true}
                                maxLength={12}
                                placeholder="Enter 12 digit Aadhaar number"
                            />

                        </div>

                        <div
                            className="
                                mt-4
                                bg-slate-50
                                border border-slate-200
                                rounded-xl
                                p-4
                            "
                        >
                            <p className="text-sm text-slate-600">
                                <strong>Contact Number 1:</strong>{" "}
                                Required, 10 digits.
                            </p>

                            <p className="text-sm text-slate-600 mt-1">
                                <strong>Contact Number 2:</strong>{" "}
                                Optional, but must contain 10 digits
                                if entered.
                            </p>

                            <p className="text-sm text-slate-600 mt-1">
                                <strong>Aadhaar:</strong>{" "}
                                Exactly 12 digits.
                            </p>
                        </div>

                    </section>

                    {/* =================================================
                        APPLICATION FEE
                    ================================================== */}

                    <section>

                        <h2
                            className="
                                text-xl font-bold
                                text-slate-800
                                border-b
                                pb-3
                                mb-6
                            "
                        >
                            Application Fee
                        </h2>

                        <div>

                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Application Fee
                            </label>

                            {/* FIXED FEE */}

                            <div
                                className="
                                    w-full
                                    rounded-xl
                                    border border-slate-300
                                    bg-slate-100
                                    px-4 py-3
                                    text-slate-800
                                    font-bold
                                    text-lg
                                "
                            >
                                ₹{APPLICATION_FEE}
                            </div>

                            <p className="text-sm text-slate-500 mt-2">
                                Application fee is fixed at ₹100
                                and cannot be changed.
                            </p>

                        </div>

                        {/* =================================================
                            PAYMENT MODE
                        ================================================== */}

                        <div className="mt-6">

                            <p className="font-semibold text-slate-700 mb-3">
                                Payment Mode
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">

                                {/* OFFLINE */}

                                <label className="flex items-center gap-2 cursor-pointer">

                                    <input
                                        type="radio"
                                        name="paymentMode"
                                        value="offline"
                                        checked={
                                            formData.paymentMode ===
                                            "offline"
                                        }
                                        onChange={handleChange}
                                        className="w-4 h-4"
                                    />

                                    <span>
                                        Pay Offline
                                    </span>

                                </label>

                                {/* ONLINE */}

                                <label className="flex items-center gap-2 cursor-pointer">

                                    <input
                                        type="radio"
                                        name="paymentMode"
                                        value="online"
                                        checked={
                                            formData.paymentMode ===
                                            "online"
                                        }
                                        onChange={handleChange}
                                        className="w-4 h-4"
                                    />

                                    <span>
                                        Pay Online Now
                                    </span>

                                </label>

                            </div>

                            {/* ONLINE MESSAGE */}

                            {formData.paymentMode ===
                                "online" && (
                                    <div
                                        className="
                                        mt-4
                                        bg-indigo-50
                                        border border-indigo-200
                                        rounded-xl
                                        p-4
                                    "
                                    >
                                        <p className="text-sm text-indigo-700">
                                            You will be redirected to
                                            a secure payment page after
                                            submitting the application.
                                        </p>
                                    </div>
                                )}

                            {/* OFFLINE MESSAGE */}

                            {formData.paymentMode ===
                                "offline" && (
                                    <div
                                        className="
                                        mt-4
                                        bg-amber-50
                                        border border-amber-200
                                        rounded-xl
                                        p-4
                                    "
                                    >
                                        <p className="text-sm text-amber-700">
                                            Your application will be
                                            submitted now. The fixed
                                            application fee of ₹100 can
                                            be paid offline.
                                        </p>
                                    </div>
                                )}

                        </div>

                    </section>

                    {/* =================================================
                        REQUIRED DOCUMENTS
                    ================================================== */}

                    <section>

                        <div
                            className="
                                bg-amber-50
                                border border-amber-200
                                rounded-2xl
                                p-5 md:p-6
                            "
                        >

                            <h2
                                className="
                                    text-lg md:text-xl
                                    font-bold
                                    text-amber-800
                                    mb-4
                                "
                            >
                                Required Documents
                            </h2>

                            <p className="text-amber-900 mb-3">
                                Please submit the following
                                documents along with the application:
                            </p>

                            <ul
                                className="
                                    list-disc
                                    pl-6
                                    space-y-2
                                    text-amber-900
                                "
                            >
                                <li>
                                    Aadhaar Card Xerox / Photocopy
                                </li>

                                <li>
                                    Birth Certificate
                                </li>

                                <li>
                                    2 Passport Size Photographs
                                </li>

                                <li>
                                    Transfer Certificate (TC) of the
                                    Last Class
                                </li>
                            </ul>

                            <p
                                className="
                                    mt-4
                                    font-semibold
                                    text-red-600
                                "
                            >
                                Note: All the above documents are
                                required for admission.
                            </p>

                        </div>

                    </section>

                    {/* =================================================
                        SUBMIT BUTTON
                    ================================================== */}

                    <button
                        type="submit"
                        disabled={loading}
                        className="
                            w-full
                            py-4
                            rounded-xl
                            bg-gradient-to-r
                            from-indigo-600
                            to-blue-600
                            text-white
                            font-bold
                            text-lg
                            hover:shadow-xl
                            hover:from-indigo-700
                            hover:to-blue-700
                            transition
                            disabled:opacity-50
                            disabled:cursor-not-allowed
                        "
                    >
                        {loading
                            ? "Submitting..."
                            : "Submit Application"}
                    </button>

                </form>

            </div>

        </div>
    );
};

export default TuitionApplication;