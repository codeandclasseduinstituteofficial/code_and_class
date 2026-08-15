import React, { useState } from "react";
import {
    FaUser,
    FaBookOpen,
    FaVideo,
    FaRegCommentDots,
    FaPaperPlane,
} from "react-icons/fa";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthProvider";
import { authAxios } from "../../utils/authAxios";
import { toast } from "react-toastify";

const AddStudentVoice = () => {
    const [formData, setFormData] = useState({
        name: "",
        course: "",
        description: "",
        videoUrl: "",
    });

    const { accessToken } = useContext(AuthContext);

    const api = authAxios(() => accessToken);

    const maxWords = 30;

    const wordCount = formData.description
        .trim()
        .split(/\s+/)
        .filter(Boolean).length;

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "description") {
            const words = value.trim().split(/\s+/).filter(Boolean);

            if (words.length <= maxWords) {
                setFormData((prev) => ({
                    ...prev,
                    [name]: value,
                }));
            }
            return;
        }

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const response = await api.post(
                `${import.meta.env.VITE_API_URL || "https://code-and-class.onrender.com/api"}/studentVoice/`,
                formData
            );

            toast.success("Student Voice Submitted Successfully!");

            // reset form after successful submit
            setFormData({
                name: "",
                course: "",
                description: "",
                videoUrl: "",
            });

        } catch (error) {
            console.error(
                "Student Voice Submit Error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to submit student voice."
            );
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4 mt-10">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-brand-600 to-brand-700 rounded-3xl p-8 md:p-10 text-white shadow-xl">
                    <h1 className="text-3xl md:text-4xl font-bold">
                        Share Your Student Voice 🎥
                    </h1>

                    <p className="mt-3 text-brand-100 max-w-3xl leading-relaxed">
                        Inspire future students by sharing your learning experience. Tell us
                        about your journey, the course you completed, and upload your video
                        testimonial.
                    </p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-3xl shadow-xl mt-8 overflow-hidden">
                    <div className="grid lg:grid-cols-5">
                        {/* Left Side */}
                        <div className="hidden lg:flex lg:col-span-2 bg-gradient-to-br from-brand-600 to-brand-700 text-white p-8 flex-col justify-between">
                            <div>
                                <h2 className="text-2xl font-bold">
                                    Why Share Your Experience?
                                </h2>

                                <div className="space-y-5 mt-8">
                                    <div className="flex gap-3">
                                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                            ⭐
                                        </div>

                                        <div>
                                            <h3 className="font-semibold">
                                                Help Future Students
                                            </h3>

                                            <p className="text-sm text-brand-100">
                                                Your experience can guide students in choosing the right
                                                career path.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                            🎓
                                        </div>

                                        <div>
                                            <h3 className="font-semibold">
                                                Showcase Your Journey
                                            </h3>

                                            <p className="text-sm text-brand-100">
                                                Share how the course helped improve your skills and
                                                confidence.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                            🚀
                                        </div>

                                        <div>
                                            <h3 className="font-semibold">
                                                Inspire Others
                                            </h3>

                                            <p className="text-sm text-brand-100">
                                                Encourage others to begin their learning journey.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10 text-sm text-brand-100 border-t border-white/20 pt-5">
                                Your testimonial will be reviewed by the admin before it
                                appears on our website.
                            </div>
                        </div>

                        {/* Right Side */}
                        <div className="lg:col-span-3 p-6 md:p-8">
                            <form
                                onSubmit={handleSubmit}
                                className="space-y-6"
                            >
                                {/* Name */}
                                <div>
                                    <label className="font-semibold text-slate-700 mb-2 block">
                                        Full Name
                                    </label>

                                    <div className="relative">
                                        <FaUser className="absolute left-4 top-4 text-slate-400" />

                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Enter your full name"
                                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none transition"
                                        />
                                    </div>
                                </div>

                                {/* Course */}
                                <div>
                                    <label className="font-semibold text-slate-700 mb-2 block">
                                        Course Completed
                                    </label>

                                    <div className="relative">
                                        <FaBookOpen className="absolute left-4 top-4 text-slate-400" />

                                        <input
                                            type="text"
                                            name="course"
                                            required
                                            value={formData.course}
                                            onChange={handleChange}
                                            placeholder="Example: Full Stack Development"
                                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none transition"
                                        />
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="font-semibold text-slate-700 mb-2 block">
                                        Your Experience
                                    </label>

                                    <div className="relative">
                                        <FaRegCommentDots className="absolute left-4 top-4 text-slate-400" />

                                        <textarea
                                            rows={5}
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            required
                                            placeholder="Describe your learning experience in about 30 words..."
                                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none resize-none transition"
                                        />
                                    </div>

                                    <div className="flex justify-between mt-2">
                                        <p className="text-sm text-slate-500">
                                            Maximum 30 words
                                        </p>

                                        <p
                                            className={`text-sm font-medium ${wordCount >= maxWords
                                                ? "text-red-500"
                                                : "text-brand-600"
                                                }`}
                                        >
                                            {wordCount}/{maxWords}
                                        </p>
                                    </div>
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    className="w-full md:w-auto px-8 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-semibold flex items-center justify-center gap-3 transition shadow-lg hover:shadow-xl"
                                >
                                    <FaPaperPlane />
                                    Submit Student Voice
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Bottom Note */}
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mt-8">
                    <h3 className="font-semibold text-amber-700">
                        Before You Submit
                    </h3>

                    <ul className="mt-3 space-y-2 text-sm text-slate-600 list-disc ml-5">
                        <li>Keep your description concise (maximum 30 words).</li>
                        <li>Only YouTube video links are accepted.</li>
                        <li>Your testimonial will be reviewed before publishing.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AddStudentVoice;