import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAxios } from "../utils/authAxios";
import { AuthContext } from "../context/AuthProvider";


// =====================================================
// FIXED APPLICATION FEE
// (Assumption: same ₹100 fee used for CourseApplication.
//  Change this if the Home Schooling program has a different fee.)
// =====================================================

const APPLICATION_FEE = 100;

// =====================================================
// INITIAL FORM DATA
// =====================================================

const initialFormData = {
    salutation: "",
    parentName: "",
    relationToChild: "",

    childName: "",
    childDateOfBirth: "",
    childGender: "",

    mobileNumber: "",
    alternateMobileNumber: "",
    email: "",

    state: "",
    district: "",
    mandal: "",
    village: "",

    preferredBatchTiming: "",
    isDifferentlyAbled: false,
    hasPriorLearningExperience: false,

    howDidYouHear: "",
    specialNotes: "",

    paymentMode: "offline",
};

// Human-readable labels used in the "please fill this in" error message.
const REQUIRED_SELECT_LABELS = {
    salutation: "Salutation",
    relationToChild: "Relation to Child",
    childGender: "Child's Gender",
    preferredBatchTiming: "Preferred Batch Timing",
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
                {required && <span className="text-red-500 ml-1">*</span>}
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

const TextArea = ({ label, name, value, onChange, required = false, placeholder = "" }) => {
    return (
        <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>

            <textarea
                name={name}
                value={value ?? ""}
                onChange={onChange}
                required={required}
                placeholder={placeholder}
                rows={3}
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

const Select = ({ label, name, value, onChange, children, required = true }) => {
    return (
        <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
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
                <option value="">Select {label}</option>
                {children}
            </select>
        </div>
    );
};

// =====================================================
// MAIN COMPONENT
// =====================================================

const HomeSchoolingApplicationForm = () => {
    const navigate = useNavigate();
    const { accessToken } = useContext(AuthContext);

    const api = authAxios(() => accessToken);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");

    const [formData, setFormData] = useState(initialFormData);

    // =================================================
    // HANDLE CHANGE
    // =================================================

    const handleChange = (e) => {
        const { name, value, type } = e.target;

        let newValue = value;

        if (
            type === "radio" &&
            (name === "isDifferentlyAbled" || name === "hasPriorLearningExperience")
        ) {
            newValue = value === "true";
        }

        if (name === "mobileNumber" || name === "alternateMobileNumber") {
            newValue = value.replace(/\D/g, "").slice(0, 10);
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
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // =================================================
    // HANDLE SUBMIT
    // =================================================

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        const parentName = formData.parentName.trim();
        const childName = formData.childName.trim();
        const mobileNumber = formData.mobileNumber.trim();
        const alternateMobileNumber = formData.alternateMobileNumber.trim();

        // REQUIRED TEXT FIELDS
        if (!parentName) {
            showError("Please enter the Parent / Guardian Name.");
            return;
        }

        if (!childName) {
            showError("Please enter the Child's Name.");
            return;
        }

        // REQUIRED DROPDOWNS
        // (Needed because the <form> uses noValidate, so native "required"
        //  enforcement on <select> elements never fires.)
        const missingSelect = Object.keys(REQUIRED_SELECT_LABELS).find(
            (key) => !formData[key]
        );

        if (missingSelect) {
            showError(`Please select a value for "${REQUIRED_SELECT_LABELS[missingSelect]}".`);
            return;
        }

        // MOBILE VALIDATION
        if (!/^[6-9]\d{9}$/.test(mobileNumber)) {
            showError("Please enter a valid 10-digit Mobile Number.");
            return;
        }

        // ALTERNATE MOBILE (OPTIONAL)
        if (alternateMobileNumber !== "" && !/^[6-9]\d{9}$/.test(alternateMobileNumber)) {
            showError("Please enter a valid 10-digit alternate mobile number, or leave it empty.");
            return;
        }

        // CHILD DOB
        if (!formData.childDateOfBirth) {
            showError("Please select the child's Date of Birth.");
            return;
        }

        // PAYMENT MODE
        if (!["online", "offline"].includes(formData.paymentMode)) {
            showError("Please select a valid payment mode.");
            return;
        }

        try {
            setLoading(true);
            setMessage("");

            const payload = {
                ...formData,
                parentName,
                childName,
                mobileNumber,
                alternateMobileNumber,
                applicationFee: APPLICATION_FEE,
            };

            const { data } = await api.post("/homeSchoolingApplication", payload, {
                withCredentials: true,
            });

            const applicationId = data?.data?._id;

            // ONLINE PAYMENT
            if (formData.paymentMode === "online" && applicationId) {
                navigate(`/application-payment/homeschooling/${applicationId}`);
                return;
            }

            // OFFLINE SUCCESS
            setMessageType("success");
            setMessage(
                "Home Schooling application submitted successfully. Application fee: ₹100 (Offline)."
            );

            setFormData(initialFormData);
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (error) {
            console.error("Home schooling application error:", error);

            const serverMessage = error.response?.data?.message;
            const serverError = error.response?.data?.error;

            setMessageType("error");
            setMessage(
                serverError || serverMessage || "Something went wrong while submitting the application."
            );

            window.scrollTo({ top: 0, behavior: "smooth" });
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // RETURN
    // =====================================================

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-5 md:py-20">
            <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-200 p-6 md:p-12">

                {/* HEADER */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
                        Nursery Home Schooling Application
                    </h1>
                    <p className="text-slate-500 mt-3">
                        Please fill in your child's details carefully to reserve a seat.
                    </p>
                </div>

                {/* MESSAGE */}
                {message && (
                    <div
                        className={`mb-6 p-4 rounded-xl text-center font-medium ${messageType === "error"
                            ? "bg-red-50 border border-red-200 text-red-700"
                            : "bg-green-50 border border-green-200 text-green-700"
                            }`}
                    >
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-10" noValidate>

                    {/* PARENT / GUARDIAN DETAILS */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-800 border-b pb-3 mb-6">
                            Parent / Guardian Details
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            <Select
                                label="Salutation"
                                name="salutation"
                                value={formData.salutation}
                                onChange={handleChange}
                            >
                                <option value="Mr">Mr</option>
                                <option value="Ms">Ms</option>
                                <option value="Mrs">Mrs</option>
                                <option value="Dr">Dr</option>
                            </Select>

                            <Input
                                label="Parent / Guardian Name"
                                name="parentName"
                                value={formData.parentName}
                                onChange={handleChange}
                                placeholder="Enter parent or guardian name"
                            />

                            <Select
                                label="Relation to Child"
                                name="relationToChild"
                                value={formData.relationToChild}
                                onChange={handleChange}
                            >
                                <option value="Father">Father</option>
                                <option value="Mother">Mother</option>
                                <option value="Guardian">Guardian</option>
                            </Select>

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
                                label="Alternate Mobile Number"
                                name="alternateMobileNumber"
                                type="tel"
                                value={formData.alternateMobileNumber}
                                onChange={handleChange}
                                required={false}
                                maxLength={10}
                                placeholder="Optional 10-digit mobile number"
                            />

                            <Input
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter email address"
                            />
                        </div>
                    </section>

                    {/* CHILD DETAILS */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-800 border-b pb-3 mb-6">
                            Child Details
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            <Input
                                label="Child's Name"
                                name="childName"
                                value={formData.childName}
                                onChange={handleChange}
                                placeholder="Enter child's name"
                            />

                            <Input
                                label="Child's Date of Birth"
                                name="childDateOfBirth"
                                type="date"
                                value={formData.childDateOfBirth}
                                onChange={handleChange}
                            />

                            <Select
                                label="Child's Gender"
                                name="childGender"
                                value={formData.childGender}
                                onChange={handleChange}
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </Select>

                            <Select
                                label="Preferred Batch Timing"
                                name="preferredBatchTiming"
                                value={formData.preferredBatchTiming}
                                onChange={handleChange}
                            >
                                <option value="Morning">Morning</option>
                                <option value="Afternoon">Afternoon</option>
                                <option value="Evening">Evening</option>
                            </Select>
                        </div>
                    </section>

                    {/* ADDRESS DETAILS */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-800 border-b pb-3 mb-6">
                            Address Details
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            <Input
                                label="State"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                required={false}
                                placeholder="Enter state"
                            />
                            <Input
                                label="District"
                                name="district"
                                value={formData.district}
                                onChange={handleChange}
                                required={false}
                                placeholder="Enter district"
                            />
                            <Input
                                label="Mandal"
                                name="mandal"
                                value={formData.mandal}
                                onChange={handleChange}
                                required={false}
                                placeholder="Enter mandal"
                            />
                            <Input
                                label="Village"
                                name="village"
                                value={formData.village}
                                onChange={handleChange}
                                required={false}
                                placeholder="Enter village"
                            />
                        </div>
                    </section>

                    {/* ADDITIONAL DETAILS */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-800 border-b pb-3 mb-6">
                            Additional Details
                        </h2>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-3">
                                    Is the child differently abled?
                                </label>
                                <div className="flex gap-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="isDifferentlyAbled"
                                            value="true"
                                            checked={formData.isDifferentlyAbled === true}
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
                                            checked={formData.isDifferentlyAbled === false}
                                            onChange={handleChange}
                                            className="w-4 h-4"
                                        />
                                        No
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-3">
                                    Any prior learning / preschool experience?
                                </label>
                                <div className="flex gap-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="hasPriorLearningExperience"
                                            value="true"
                                            checked={formData.hasPriorLearningExperience === true}
                                            onChange={handleChange}
                                            className="w-4 h-4"
                                        />
                                        Yes
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="hasPriorLearningExperience"
                                            value="false"
                                            checked={formData.hasPriorLearningExperience === false}
                                            onChange={handleChange}
                                            className="w-4 h-4"
                                        />
                                        No
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mt-6">
                            <Select
                                label="How did you hear about us?"
                                name="howDidYouHear"
                                value={formData.howDidYouHear}
                                onChange={handleChange}
                                required={false}
                            >
                                <option value="WhatsApp">WhatsApp</option>
                                <option value="YouTube">YouTube</option>
                                <option value="Instagram">Instagram</option>
                                <option value="Friend/Family Referral">Friend/Family Referral</option>
                                <option value="Other">Other</option>
                            </Select>
                        </div>

                        <div className="mt-6">
                            <TextArea
                                label="Anything else we should know?"
                                name="specialNotes"
                                value={formData.specialNotes}
                                onChange={handleChange}
                                placeholder="Allergies, special needs, preferred learning style, etc. (optional)"
                            />
                        </div>
                    </section>

                    {/* APPLICATION FEE */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-800 border-b pb-3 mb-6">
                            Application Fee
                        </h2>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Application Fee
                            </label>

                            <div className="w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-slate-800 font-bold text-lg">
                                ₹{APPLICATION_FEE}
                            </div>

                            <p className="text-sm text-slate-500 mt-2">
                                Application fee is fixed at ₹{APPLICATION_FEE} and cannot be changed.
                            </p>
                        </div>

                        <div className="mt-6">
                            <p className="font-semibold text-slate-700 mb-3">Payment Mode</p>

                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="paymentMode"
                                        value="offline"
                                        checked={formData.paymentMode === "offline"}
                                        onChange={handleChange}
                                        className="w-4 h-4"
                                    />
                                    <span>Pay Offline</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="paymentMode"
                                        value="online"
                                        checked={formData.paymentMode === "online"}
                                        onChange={handleChange}
                                        className="w-4 h-4"
                                    />
                                    <span>Pay Online Now</span>
                                </label>
                            </div>

                            {formData.paymentMode === "online" && (
                                <div className="mt-4 bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                                    <p className="text-sm text-indigo-700">
                                        You will be redirected to a secure payment page after submitting the
                                        application.
                                    </p>
                                </div>
                            )}

                            {formData.paymentMode === "offline" && (
                                <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
                                    <p className="text-sm text-amber-700">
                                        Your application will be submitted now. The fixed application fee of ₹
                                        {APPLICATION_FEE} can be paid offline.
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* SUBMIT BUTTON */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="
                            w-full py-4 rounded-xl
                            bg-gradient-to-r from-indigo-600 to-blue-600
                            text-white font-bold text-lg shadow-lg
                            hover:shadow-xl hover:from-indigo-700 hover:to-blue-700
                            transition disabled:opacity-50 disabled:cursor-not-allowed
                        "
                    >
                        {loading ? "Submitting..." : "Submit Application"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default HomeSchoolingApplicationForm;