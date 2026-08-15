import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthProvider";
import { authAxios } from "../../utils/authAxios";

// =====================================================
// FIXED APPLICATION FEE
// =====================================================

const APPLICATION_FEE = 100;

// =====================================================
// INITIAL FORM DATA
// =====================================================

const initialFormData = {
    salutation: "",
    studentName: "",
    mobileNumber: "",
    aadhaarLinkedMobile: "",
    aadhaarNumber: "",
    email: "",
    dateOfBirth: "",
    religion: "",
    category: "",

    state: "",
    district: "",
    mandal: "",
    village: "",

    isDifferentlyAbled: false,
    changeDomicileAddress: false,

    fatherName: "",
    motherName: "",

    maritalStatus: "",

    higherEducation: "",
    trainingStatus: "",
    course: "",

    paymentMode: "offline",
};

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
// MAIN COMPONENT
// =====================================================

const CourseApplication = () => {
    const navigate = useNavigate();

    const { accessToken } = useContext(AuthContext);

    // Authenticated Axios instance
    const api = authAxios(() => accessToken);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");

    const [formData, setFormData] = useState(
        initialFormData
    );

    // =================================================
    // HANDLE CHANGE
    // =================================================

    const handleChange = (e) => {
        const { name, value, type } = e.target;

        let newValue = value;

        // ---------------------------------------------
        // BOOLEAN RADIO FIELDS
        // ---------------------------------------------

        if (
            type === "radio" &&
            (
                name === "isDifferentlyAbled" ||
                name === "changeDomicileAddress"
            )
        ) {
            newValue = value === "true";
        }

        // ---------------------------------------------
        // MOBILE NUMBER
        // ---------------------------------------------

        if (
            name === "mobileNumber" ||
            name === "aadhaarLinkedMobile"
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

        setMessage("");

        // ---------------------------------------------
        // VALUES
        // ---------------------------------------------

        const mobileNumber =
            formData.mobileNumber.trim();

        const aadhaarLinkedMobile =
            formData.aadhaarLinkedMobile.trim();

        const aadhaarNumber =
            formData.aadhaarNumber.trim();

        // =================================================
        // MOBILE VALIDATION
        // =================================================

        if (!/^[6-9]\d{9}$/.test(mobileNumber)) {
            showError(
                "Please enter a valid 10-digit Mobile Number."
            );
            return;
        }

        // =================================================
        // AADHAAR LINKED MOBILE VALIDATION
        // OPTIONAL
        // =================================================

        if (
            aadhaarLinkedMobile !== "" &&
            !/^[6-9]\d{9}$/.test(
                aadhaarLinkedMobile
            )
        ) {
            showError(
                "Please enter a valid 10-digit Aadhaar Linked Mobile Number, or leave it empty."
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
        // DATE OF BIRTH
        // =================================================

        if (!formData.dateOfBirth) {
            showError(
                "Please select the student's Date of Birth."
            );
            return;
        }

        // =================================================
        // PAYMENT MODE
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

        try {
            setLoading(true);
            setMessage("");

            // ---------------------------------------------
            // REMOVE FATHER/MOTHER FROM ROOT
            // AND PUT THEM INSIDE FAMILY
            // ---------------------------------------------

            const {
                fatherName,
                motherName,
                ...rest
            } = formData;

            const payload = {
                ...rest,

                mobileNumber,
                aadhaarLinkedMobile,
                aadhaarNumber,

                family: {
                    fatherName,
                    motherName,
                },

                // Backend should also force this to 100.
                applicationFee: APPLICATION_FEE,
            };

            // ---------------------------------------------
            // API REQUEST
            // ---------------------------------------------

            const { data } = await api.post(
                "/courseApplication",
                payload,
                {
                    withCredentials: true,
                }
            );

            // ---------------------------------------------
            // GET APPLICATION ID
            // ---------------------------------------------

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
                    `/application-payment/course/${applicationId}`
                );

                return;
            }

            // =================================================
            // OFFLINE SUCCESS
            // =================================================

            setMessageType("success");

            setMessage(
                "Course application submitted successfully. Application fee: ₹100 (Offline)."
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
                "Course application error:",
                error
            );

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

    // =====================================================
    // RETURN
    // =====================================================

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
                        Course Application Form
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
                        PERSONAL DETAILS
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
                            Personal Details
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">

                            <Select
                                label="Salutation"
                                name="salutation"
                                value={formData.salutation}
                                onChange={handleChange}
                            >
                                <option value="Mr">
                                    Mr
                                </option>

                                <option value="Ms">
                                    Ms
                                </option>

                                <option value="Mrs">
                                    Mrs
                                </option>

                                <option value="Dr">
                                    Dr
                                </option>
                            </Select>

                            <Input
                                label="Student Name"
                                name="studentName"
                                value={formData.studentName}
                                onChange={handleChange}
                                placeholder="Enter student name"
                            />

                            <Input
                                label="Mobile Number"
                                name="mobileNumber"
                                type="tel"
                                value={formData.mobileNumber}
                                onChange={handleChange}
                                maxLength={10}
                                placeholder="Enter 10-digit mobile number"
                            />

                            <Input
                                label="Aadhaar Linked Mobile"
                                name="aadhaarLinkedMobile"
                                type="tel"
                                value={
                                    formData.aadhaarLinkedMobile
                                }
                                onChange={handleChange}
                                required={false}
                                maxLength={10}
                                placeholder="Optional 10-digit mobile number"
                            />

                            <Input
                                label="Aadhaar Number"
                                name="aadhaarNumber"
                                type="text"
                                value={formData.aadhaarNumber}
                                onChange={handleChange}
                                maxLength={12}
                                placeholder="Enter 12 digit Aadhaar number"
                            />

                            <Input
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter email address"
                            />

                            <Input
                                label="Date of Birth"
                                name="dateOfBirth"
                                type="date"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                            />

                            <Select
                                label="Religion"
                                name="religion"
                                value={formData.religion}
                                onChange={handleChange}
                            >
                                <option value="Islam">
                                    Islam
                                </option>

                                <option value="Hinduism">
                                    Hinduism
                                </option>

                                <option value="Others">
                                    Others
                                </option>
                            </Select>

                            <Select
                                label="Category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                            >
                                <option value="OBC">
                                    OBC
                                </option>

                                <option value="ST">
                                    ST
                                </option>

                                <option value="SC">
                                    SC
                                </option>

                                <option value="GEN">
                                    GEN
                                </option>

                                <option value="Not Disclosed">
                                    Not Disclosed
                                </option>
                            </Select>

                        </div>

                    </section>

                    {/* =================================================
                        ADDRESS DETAILS
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
                            Address Details
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">

                            <Input
                                label="State"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                placeholder="Enter state"
                            />

                            <Input
                                label="District"
                                name="district"
                                value={formData.district}
                                onChange={handleChange}
                                placeholder="Enter district"
                            />

                            <Input
                                label="Mandal"
                                name="mandal"
                                value={formData.mandal}
                                onChange={handleChange}
                                placeholder="Enter mandal"
                            />

                            <Input
                                label="Village"
                                name="village"
                                value={formData.village}
                                onChange={handleChange}
                                placeholder="Enter village"
                            />

                        </div>

                    </section>

                    {/* =================================================
                        SPECIAL CATEGORIES
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
                            Special Categories
                        </h2>

                        <div className="grid md:grid-cols-2 gap-8">

                            {/* DIFFERENTLY ABLED */}

                            <div>

                                <label
                                    className="
                                        block text-sm
                                        font-semibold
                                        text-slate-700
                                        mb-3
                                    "
                                >
                                    Differently Abled?
                                </label>

                                <div className="flex gap-6">

                                    <label className="flex items-center gap-2 cursor-pointer">

                                        <input
                                            type="radio"
                                            name="isDifferentlyAbled"
                                            value="true"
                                            checked={
                                                formData.isDifferentlyAbled ===
                                                true
                                            }
                                            onChange={handleChange}
                                            className="w-4 h-4"
                                        />

                                        Yes

                                    </label>

                                    <label className="flex items-center gap-2 cursor-pointer">

                                        <input
                                            type="radio"
                                            name="isDifferentlyAbled"
                                            value="false"
                                            checked={
                                                formData.isDifferentlyAbled ===
                                                false
                                            }
                                            onChange={handleChange}
                                            className="w-4 h-4"
                                        />

                                        No

                                    </label>

                                </div>

                            </div>

                            {/* CHANGE DOMICILE */}

                            <div>

                                <label
                                    className="
                                        block text-sm
                                        font-semibold
                                        text-slate-700
                                        mb-3
                                    "
                                >
                                    Change Domicile Address?
                                </label>

                                <div className="flex gap-6">

                                    <label className="flex items-center gap-2 cursor-pointer">

                                        <input
                                            type="radio"
                                            name="changeDomicileAddress"
                                            value="true"
                                            checked={
                                                formData.changeDomicileAddress ===
                                                true
                                            }
                                            onChange={handleChange}
                                            className="w-4 h-4"
                                        />

                                        Yes

                                    </label>

                                    <label className="flex items-center gap-2 cursor-pointer">

                                        <input
                                            type="radio"
                                            name="changeDomicileAddress"
                                            value="false"
                                            checked={
                                                formData.changeDomicileAddress ===
                                                false
                                            }
                                            onChange={handleChange}
                                            className="w-4 h-4"
                                        />

                                        No

                                    </label>

                                </div>

                            </div>

                        </div>

                    </section>

                    {/* =================================================
                        FAMILY DETAILS
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
                            Family Details
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">

                            <Input
                                label="Father Name"
                                name="fatherName"
                                value={formData.fatherName}
                                onChange={handleChange}
                                placeholder="Enter father's name"
                            />

                            <Input
                                label="Mother Name"
                                name="motherName"
                                value={formData.motherName}
                                onChange={handleChange}
                                placeholder="Enter mother's name"
                            />

                            <Select
                                label="Marital Status"
                                name="maritalStatus"
                                value={formData.maritalStatus}
                                onChange={handleChange}
                            >
                                <option value="Single">
                                    Single
                                </option>

                                <option value="Unmarried">
                                    Unmarried
                                </option>

                                <option value="Married">
                                    Married
                                </option>

                                <option value="Divorcee">
                                    Divorcee
                                </option>

                                <option value="Widow">
                                    Widow
                                </option>

                                <option value="Widower">
                                    Widower
                                </option>
                            </Select>

                        </div>

                    </section>

                    {/* =================================================
                        EDUCATION & EMPLOYMENT
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
                            Education & Employment
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">

                            <Input
                                label="Higher Education"
                                name="higherEducation"
                                value={
                                    formData.higherEducation
                                }
                                onChange={handleChange}
                                placeholder="Enter highest qualification"
                            />

                            <Select
                                label="Training Status"
                                name="trainingStatus"
                                value={
                                    formData.trainingStatus
                                }
                                onChange={handleChange}
                            >
                                <option value="Fresher">
                                    Fresher
                                </option>

                                <option value="Experienced">
                                    Experienced
                                </option>
                            </Select>

                            <Input
                                label="Course Applying For"
                                name="course"
                                value={formData.course}
                                onChange={handleChange}
                                placeholder="Enter course name"
                            />

                        </div>

                    </section>

                    {/* =================================================
                        APPLICATION FEE
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
                            Application Fee
                        </h2>

                        {/* FIXED FEE */}

                        <div>

                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Application Fee
                            </label>

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

                        {/* PAYMENT MODE */}

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
                    ================================================= */}

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
                            </ul>

                            <p
                                className="
                                    mt-4
                                    font-semibold
                                    text-red-600
                                "
                            >
                                Note: Please bring all required
                                documents for admission.
                            </p>

                        </div>

                    </section>

                    {/* =================================================
                        SUBMIT BUTTON
                    ================================================= */}

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
                            shadow-lg
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

export default CourseApplication;