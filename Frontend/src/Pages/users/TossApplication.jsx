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
                    transition resize-none
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
// INITIAL FORM
// =====================================================

const initialFormData = {
    salutation: "",
    studentName: "",
    mobileNumber: "",
    aadhaarLinkedMobile: "",
    aadhaarNumber: "",
    email: "",
    dateOfBirth: "",
    category: "",

    state: "",
    district: "",
    mandal: "",
    village: "",

    isDifferentlyAbled: false,

    fatherName: "",
    motherName: "",

    tossLevel: "",
    subjectsOpted: "",

    // Intermediate group
    group: "",

    paymentMode: "offline",
};

// =====================================================
// MAIN COMPONENT
// =====================================================

const TossApplication = () => {
    const navigate = useNavigate();

    const { accessToken } = useContext(AuthContext);

    const api = authAxios(() => accessToken);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");

    const [formData, setFormData] =
        useState(initialFormData);

    // =================================================
    // APPLICATION FEE
    // =================================================

    const APPLICATION_FEE =
        formData.tossLevel === "Intermediate"
            ? 500
            : 500;

    // =================================================
    // HANDLE CHANGE
    // =================================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        let newValue = value;

        // ---------------------------------------------
        // MOBILE NUMBER
        // ---------------------------------------------

        if (
            name === "contactNumber1" ||
            name === "contactNumber2" ||
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

        // ---------------------------------------------
        // TOSS LEVEL
        // ---------------------------------------------

        if (name === "tossLevel") {
            setFormData((prev) => ({
                ...prev,
                tossLevel: newValue,

                // Clear group when switching to SSC
                group:
                    newValue === "Intermediate"
                        ? prev.group
                        : "",
            }));

            return;
        }

        setFormData((prev) => ({
            ...prev,
            [name]: newValue,
        }));
    };

    // =================================================
    // ERROR MESSAGE
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
    // SUBMIT
    // =================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");

        // =================================================
        // LEVEL VALIDATION
        // =================================================

        if (
            !["SSC", "Intermediate"].includes(
                formData.tossLevel
            )
        ) {
            showError(
                "Please select SSC or Intermediate."
            );
            return;
        }

        // =================================================
        // INTERMEDIATE GROUP VALIDATION
        // =================================================

        if (
            formData.tossLevel === "Intermediate" &&
            !formData.group
        ) {
            showError(
                "Please select an Intermediate group."
            );
            return;
        }

        // =================================================
        // CONTACT 1
        // =================================================

        const contactNumber1 =
            formData.contactNumber1.trim();

        if (
            !/^[6-9]\d{9}$/.test(
                contactNumber1
            )
        ) {
            showError(
                "Please enter a valid 10-digit Contact Number 1."
            );
            return;
        }

        // =================================================
        // CONTACT 2
        // OPTIONAL
        // =================================================

        const contactNumber2 =
            formData.contactNumber2.trim();

        if (
            contactNumber2 !== "" &&
            !/^[6-9]\d{9}$/.test(
                contactNumber2
            )
        ) {
            showError(
                "Please enter a valid Contact Number 2, or leave it empty."
            );
            return;
        }

        // =================================================
        // AADHAAR
        // =================================================

        const aadhaarNumber =
            formData.aadhaarNumber.trim();

        if (
            !/^\d{12}$/.test(
                aadhaarNumber
            )
        ) {
            showError(
                "Aadhaar Number must contain exactly 12 digits."
            );
            return;
        }

        // =================================================
        // AADHAAR LINKED MOBILE
        // OPTIONAL
        // =================================================

        const aadhaarLinkedMobile =
            formData.aadhaarLinkedMobile.trim();

        if (
            aadhaarLinkedMobile !== "" &&
            !/^[6-9]\d{9}$/.test(
                aadhaarLinkedMobile
            )
        ) {
            showError(
                "Please enter a valid Aadhaar linked mobile number."
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

        // =================================================
        // SUBMIT
        // =================================================

        try {
            setLoading(true);
            setMessage("");

            const payload = {
                ...formData,

                contactNumber1,
                contactNumber2,
                aadhaarNumber,
                aadhaarLinkedMobile,

                // Do NOT send applicationFee from frontend.
                // Backend will calculate it securely.
            };

            const { data } = await api.post(
                "/tossApplication",
                payload,
                {
                    withCredentials: true,
                }
            );

            const applicationId =
                data?.data?._id;

            // =================================================
            // ONLINE PAYMENT
            // =================================================

            if (
                formData.paymentMode ===
                "online" &&
                applicationId
            ) {
                navigate(
                    `/application-payment/toss/${applicationId}`
                );

                return;
            }

            // =================================================
            // OFFLINE
            // =================================================

            setMessageType("success");

            setMessage(
                `TOSS ${formData.tossLevel} application submitted successfully. Application fee: ₹${APPLICATION_FEE} (Offline).`
            );

            setFormData(initialFormData);

            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        } catch (error) {
            console.error(
                "TOSS application error:",
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
                        TOSS Application Form
                    </h1>

                    <p className="text-slate-500 mt-3">
                        Telangana Open School Society
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

                <form
                    onSubmit={handleSubmit}
                    className="space-y-10"
                    noValidate
                >

                    {/* =================================================
                        SSC / INTERMEDIATE SELECTION
                    ================================================= */}

                    <section>
                        <h2
                            className="
                                text-xl font-bold
                                text-slate-800
                                border-b pb-3 mb-6
                            "
                        >
                            Select Application Type
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">

                            <Select
                                label="Application Level"
                                name="tossLevel"
                                value={
                                    formData.tossLevel
                                }
                                onChange={
                                    handleChange
                                }
                            >
                                <option value="SSC">
                                    SSC
                                </option>

                                <option value="Intermediate">
                                    Intermediate
                                </option>
                            </Select>

                            {/* APPLICATION FEE */}

                            {formData.tossLevel && (
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
                                </div>
                            )}

                        </div>

                        {formData.tossLevel === "SSC" && (
                            <div
                                className="
                                    mt-4
                                    bg-blue-50
                                    border border-blue-200
                                    rounded-xl
                                    p-4
                                    text-blue-700
                                "
                            >
                                SSC application fee is ₹500.
                            </div>
                        )}

                        {formData.tossLevel === "Intermediate" && (
                            <div
                                className="
                                    mt-4
                                    bg-indigo-50
                                    border border-indigo-200
                                    rounded-xl
                                    p-4
                                    text-indigo-700
                                "
                            >
                                Intermediate application fee is ₹500.
                            </div>
                        )}
                    </section>

                    {/* =================================================
    INTERMEDIATE GROUP
================================================= */}

                    {formData.tossLevel === "Intermediate" && (
                        <section>
                            <h2
                                className="
                text-xl font-bold
                text-slate-800
                border-b pb-3 mb-6
            "
                            >
                                Intermediate Details
                            </h2>

                            <div className="grid md:grid-cols-2 gap-6">

                                <Input
                                    label="Group"
                                    name="group"
                                    value={formData.group}
                                    onChange={handleChange}
                                    placeholder="Enter your group"
                                    required={true}
                                />

                            </div>
                        </section>
                    )}

                    {/* =================================================
                        STUDENT DETAILS
                    ================================================= */}

                    {formData.tossLevel && (
                        <>
                            <section>

                                <h2
                                    className="
                                        text-xl font-bold
                                        text-slate-800
                                        border-b pb-3 mb-6
                                    "
                                >
                                    Student Details
                                </h2>

                                <div className="grid md:grid-cols-2 gap-6">

                                    {/* FIRST GRADE */}

                                    <Select
                                        label="Class / Grade"
                                        name="firstGrade"
                                        value={
                                            formData.firstGrade
                                        }
                                        onChange={
                                            handleChange
                                        }
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

                                    <Input
                                        label="Student Name"
                                        name="studentName"
                                        value={
                                            formData.studentName
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter student name"
                                    />

                                    <Input
                                        label="Father Name"
                                        name="fatherName"
                                        value={
                                            formData.fatherName
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter father's name"
                                    />

                                    <Input
                                        label="Mother Name"
                                        name="motherName"
                                        value={
                                            formData.motherName
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter mother's name"
                                    />

                                    <Input
                                        label="Nationality"
                                        name="nationality"
                                        value={
                                            formData.nationality
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter nationality"
                                    />

                                    <Input
                                        label="Mother Tongue"
                                        name="motherTongue"
                                        value={
                                            formData.motherTongue
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter mother tongue"
                                    />

                                    <Select
                                        label="Gender"
                                        name="gender"
                                        value={
                                            formData.gender
                                        }
                                        onChange={
                                            handleChange
                                        }
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

                                    <Input
                                        label="First Language"
                                        name="firstLanguage"
                                        value={
                                            formData.firstLanguage
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter first language"
                                    />

                                    <Input
                                        label="Second Language"
                                        name="secondLanguage"
                                        value={
                                            formData.secondLanguage
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter second language"
                                    />

                                    <Input
                                        label="Date of Birth"
                                        name="dateOfBirth"
                                        type="date"
                                        value={
                                            formData.dateOfBirth
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />

                                    <Select
                                        label="Category"
                                        name="category"
                                        value={
                                            formData.category
                                        }
                                        onChange={
                                            handleChange
                                        }
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
                                IDENTIFICATION & ADDRESS
                            ================================================= */}

                            <section>

                                <h2
                                    className="
                                        text-xl font-bold
                                        text-slate-800
                                        border-b pb-3 mb-6
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
                                        onChange={
                                            handleChange
                                        }
                                        rows={4}
                                        placeholder="Enter identification mark"
                                    />

                                    <TextArea
                                        label="Address"
                                        name="address"
                                        value={
                                            formData.address
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        rows={5}
                                        placeholder="Enter complete residential address"
                                    />

                                </div>

                            </section>

                            {/* =================================================
                                CONTACT DETAILS
                            ================================================= */}

                            <section>

                                <h2
                                    className="
                                        text-xl font-bold
                                        text-slate-800
                                        border-b pb-3 mb-6
                                    "
                                >
                                    Contact & Aadhaar Details
                                </h2>

                                <div className="grid md:grid-cols-2 gap-6">

                                    <Input
                                        label="Contact Number 1"
                                        name="contactNumber1"
                                        type="tel"
                                        value={
                                            formData.contactNumber1
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        maxLength={10}
                                        placeholder="10-digit mobile number"
                                    />

                                    <Input
                                        label="Contact Number 2"
                                        name="contactNumber2"
                                        type="tel"
                                        value={
                                            formData.contactNumber2
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required={false}
                                        maxLength={10}
                                        placeholder="Optional"
                                    />

                                    <Input
                                        label="Aadhaar Linked Mobile"
                                        name="aadhaarLinkedMobile"
                                        type="tel"
                                        value={
                                            formData.aadhaarLinkedMobile
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required={false}
                                        maxLength={10}
                                        placeholder="Optional"
                                    />

                                    <Input
                                        label="Aadhaar Number"
                                        name="aadhaarNumber"
                                        value={
                                            formData.aadhaarNumber
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        maxLength={12}
                                        placeholder="12-digit Aadhaar"
                                    />

                                    <Input
                                        label="Email"
                                        name="email"
                                        type="email"
                                        value={
                                            formData.email
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter email address"
                                    />

                                </div>

                            </section>

                            {/* =================================================
                                PAYMENT
                            ================================================= */}

                            <section>

                                <h2
                                    className="
                                        text-xl font-bold
                                        text-slate-800
                                        border-b pb-3 mb-6
                                    "
                                >
                                    Application Fee & Payment
                                </h2>

                                <div
                                    className="
                                        rounded-xl
                                        bg-slate-100
                                        border
                                        border-slate-300
                                        p-5
                                    "
                                >
                                    <p className="text-sm text-slate-600">
                                        Application Fee
                                    </p>

                                    <p className="text-3xl font-bold text-slate-800 mt-1">
                                        ₹{APPLICATION_FEE}
                                    </p>

                                    <p className="text-sm text-slate-500 mt-2">
                                        {formData.tossLevel ===
                                            "Intermediate"
                                            ? "Intermediate application fee"
                                            : "SSC application fee"}
                                    </p>
                                </div>

                                <div className="mt-6">

                                    <p className="font-semibold text-slate-700 mb-3">
                                        Payment Mode
                                    </p>

                                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">

                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="paymentMode"
                                                value="offline"
                                                checked={
                                                    formData.paymentMode ===
                                                    "offline"
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                className="w-4 h-4"
                                            />

                                            <span>
                                                Pay Offline
                                            </span>
                                        </label>

                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="paymentMode"
                                                value="online"
                                                checked={
                                                    formData.paymentMode ===
                                                    "online"
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                className="w-4 h-4"
                                            />

                                            <span>
                                                Pay Online Now
                                            </span>
                                        </label>

                                    </div>

                                    {formData.paymentMode ===
                                        "online" && (
                                            <div className="mt-4 bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                                                <p className="text-sm text-indigo-700">
                                                    You will be redirected
                                                    to the secure payment
                                                    page after submitting.
                                                </p>
                                            </div>
                                        )}

                                    {formData.paymentMode ===
                                        "offline" && (
                                            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
                                                <p className="text-sm text-amber-700">
                                                    Your application will
                                                    be submitted now. The
                                                    application fee can be
                                                    paid offline.
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

                                    {formData.tossLevel ===
                                        "SSC" && (
                                            <>
                                                <p className="text-amber-900 mb-3">
                                                    Please submit:
                                                </p>

                                                <ul className="list-disc pl-6 space-y-2 text-amber-900">
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
                                                        Transfer Certificate (TC)
                                                    </li>
                                                </ul>
                                            </>
                                        )}

                                    {formData.tossLevel ===
                                        "Intermediate" && (
                                            <>
                                                <p className="text-amber-900 mb-3">
                                                    Please submit:
                                                </p>

                                                <ul className="list-disc pl-6 space-y-2 text-amber-900">
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
                                                        10th Class Transfer Certificate (TC)
                                                    </li>

                                                    <li>
                                                        10th Class Long Memo
                                                    </li>

                                                    <li>
                                                        10th Class Short Memo
                                                    </li>

                                                    <li>
                                                        Bonafide Certificate
                                                    </li>
                                                </ul>
                                            </>
                                        )}

                                    <p className="mt-4 font-semibold text-red-600">
                                        Note: Please submit all
                                        applicable documents during
                                        admission.
                                    </p>

                                </div>

                            </section>

                            {/* =================================================
                                SUBMIT
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
                        </>
                    )}

                </form>
            </div>
        </div>
    );
};

export default TossApplication;
