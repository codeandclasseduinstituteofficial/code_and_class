import React, { useEffect, useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthProvider";
import { authAxios } from "../../utils/authAxios";
import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaVideo,
    FaSearch,
    FaTimes,
    FaSave,
} from "react-icons/fa";
import { toast } from "react-toastify";

const AdminSuccessStories = () => {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);

    const [videoUrl, setVideoUrl] = useState("");

    const { accessToken } = useContext(AuthContext);

    const api = authAxios(() => accessToken);

    // ===========================
    // Fetch Success Stories
    // ===========================

    const fetchSuccessStories = async () => {
        try {
            setLoading(true);

            const { data } = await axios.get(
                `${import.meta.env.VITE_API_URL || "https://code-and-class.onrender.com/api"}/successStories/`
            );

            // Adjust according to your backend response
            setStories(data?.stories);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch success stories.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSuccessStories();
    }, []);

    // ===========================
    // Search
    // ===========================

    const filteredStories = Array.isArray(stories)
        ? stories.filter((story) =>
            story.videoUrl.toLowerCase().includes(search.toLowerCase())
        )
        : [];

    // ===========================
    // Open Add Modal
    // ===========================

    const openAddModal = () => {
        setEditing(null);
        setVideoUrl("");
        setShowModal(true);
    };

    // ===========================
    // Create / Update
    // ===========================

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editing) {
                // Replace with your update API when available

                toast.error("Update API is not available.");

                return;
            }

            await api.post(
                `${import.meta.env.VITE_API_URL || "https://code-and-class.onrender.com/api"}/successStories/`,
                {
                    videoUrl,
                }
            );

            setVideoUrl("");
            setEditing(null);
            setShowModal(false);

            fetchSuccessStories();
        } catch (error) {
            console.error(error);
            toast.error("Unable to save success story.");
        }
    };

    // ===========================
    // Delete Story
    // ===========================

    const deleteStory = async (id) => {
        const confirmDelete = window.confirm(
            "Delete this success story?"
        );

        if (!confirmDelete) return;

        try {
            await api.delete(
                `${import.meta.env.VITE_API_URL || "https://code-and-class.onrender.com/api"}/successStories/${id}`
            );

            fetchSuccessStories();
        } catch (error) {
            console.error(error);
            toast.error("Unable to delete success story.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8 mt-10">
            <div className="max-w-7xl mx-auto">

                {/* Header */}

                <div className="bg-gradient-to-r from-brand-600 to-brand-700 rounded-3xl p-8 text-white shadow-xl">

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold">
                                Success Stories
                            </h1>

                            <p className="text-brand-100 mt-2">
                                Manage all success story videos displayed on your website.
                            </p>
                        </div>

                        <button
                            onClick={openAddModal}
                            className="bg-white text-brand-600 font-semibold px-6 py-3 rounded-xl flex items-center gap-3 hover:shadow-xl transition"
                        >
                            <FaPlus />
                            Add Success Story
                        </button>

                    </div>

                </div>

                {/* Stats */}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

                    <div className="bg-white rounded-2xl shadow p-6">

                        <div className="flex justify-between items-center">

                            <div>

                                <p className="text-slate-500">
                                    Total Stories
                                </p>

                                <h2 className="text-3xl font-bold mt-2">
                                    {stories.length}
                                </h2>

                            </div>

                            <div className="w-14 h-14 rounded-xl bg-brand-100 flex items-center justify-center">
                                <FaVideo className="text-brand-600 text-xl" />
                            </div>

                        </div>

                    </div>

                    <div className="bg-white rounded-2xl shadow p-6">

                        <p className="text-slate-500">
                            Latest Upload
                        </p>

                        <h2 className="text-xl font-semibold mt-2">
                            {stories.length
                                ? new Date(stories[0].createdAt).toLocaleDateString()
                                : "--"}
                        </h2>

                    </div>

                    <div className="bg-white rounded-2xl shadow p-6">

                        <p className="text-slate-500">
                            Status
                        </p>

                        <h2 className="text-xl font-semibold mt-2 text-green-600">
                            Active
                        </h2>

                    </div>

                </div>

                {/* Search */}

                <div className="bg-white rounded-3xl shadow mt-8 overflow-hidden">

                    <div className="p-6 border-b">

                        <div className="relative max-w-md">

                            <FaSearch className="absolute left-4 top-4 text-slate-400" />

                            <input
                                type="text"
                                placeholder="Search by Video URL..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 rounded-xl border outline-none focus:border-brand-600"
                            />

                        </div>

                    </div>

                    {/* Loading */}

                    {loading ? (

                        <div className="py-20 flex justify-center">

                            <div className="animate-spin h-12 w-12 rounded-full border-4 border-brand-600 border-t-transparent"></div>

                        </div>

                    ) : filteredStories.length === 0 ? (

                        <div className="py-20 text-center">

                            <FaVideo className="mx-auto text-6xl text-slate-300 mb-5" />

                            <h2 className="text-2xl font-semibold text-slate-700">
                                No Success Stories Found
                            </h2>

                            <p className="text-slate-500 mt-2">
                                Upload your first success story video.
                            </p>

                        </div>

                    ) : (

                        <>
                            {/* Desktop */}

                            <div className="hidden md:block overflow-x-auto">

                                <table className="w-full">

                                    <thead className="bg-slate-100">

                                        <tr>

                                            <th className="text-left p-4">
                                                S.No
                                            </th>

                                            <th className="text-left p-4">
                                                Video URL
                                            </th>

                                            <th className="text-left p-4">
                                                Uploaded
                                            </th>

                                            <th className="text-center p-4">
                                                Actions
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {filteredStories.map((story, index) => (

                                            <tr
                                                key={story._id}
                                                className="border-t hover:bg-slate-50"
                                            >

                                                <td className="p-4">
                                                    {index + 1}
                                                </td>

                                                <td className="p-4">

                                                    <a
                                                        href={story.videoUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-brand-600 hover:underline break-all"
                                                    >
                                                        {story.videoUrl}
                                                    </a>

                                                </td>

                                                <td className="p-4">

                                                    {new Date(
                                                        story.createdAt
                                                    ).toLocaleDateString()}

                                                </td>

                                                <td className="p-4">

                                                    <div className="flex justify-center gap-3">
                                                        <button
                                                            onClick={() =>
                                                                deleteStory(story._id)
                                                            }
                                                            className="w-10 h-10 rounded-lg bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition"
                                                        >
                                                            <FaTrash className="mx-auto" />
                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>

                            </div>

                            {/* Mobile */}

                            <div className="md:hidden p-4 space-y-5">

                                {filteredStories.map((story) => (

                                    <div
                                        key={story._id}
                                        className="bg-slate-50 rounded-2xl p-5 border"
                                    >

                                        <div className="flex justify-between items-start">

                                            <div>

                                                <h3 className="font-semibold">
                                                    Success Story
                                                </h3>

                                                <p className="text-sm text-slate-500 mt-1">
                                                    {new Date(
                                                        story.createdAt
                                                    ).toLocaleDateString()}
                                                </p>

                                            </div>

                                            <FaVideo className="text-brand-600 text-xl" />

                                        </div>

                                        <a
                                            href={story.videoUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="block mt-4 break-all text-brand-600 text-sm"
                                        >
                                            {story.videoUrl}
                                        </a>

                                        <div className="flex gap-3 mt-6">

                                            <button
                                                onClick={() =>
                                                    deleteStory(story._id)
                                                }
                                                className="flex-1 bg-red-600 text-white py-2 rounded-lg"
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    </div>

                                ))}

                            </div>

                        </>

                    )}

                </div>
            </div>

            {/* Modal */}

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">

                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl animate-[fadeIn_.25s_ease]">

                        {/* Header */}

                        <div className="flex items-center justify-between px-6 py-5 border-b">

                            <div>

                                <h2 className="text-2xl font-bold text-slate-800">
                                    {editing
                                        ? "Edit Success Story"
                                        : "Add Success Story"}
                                </h2>

                                <p className="text-slate-500 text-sm mt-1">
                                    Add a YouTube or video URL to display on your website.
                                </p>

                            </div>

                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setEditing(null);
                                    setVideoUrl("");
                                }}
                                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-red-100 hover:text-red-600 transition flex items-center justify-center"
                            >
                                <FaTimes />
                            </button>

                        </div>

                        {/* Body */}

                        <form
                            onSubmit={handleSubmit}
                            className="p-6 space-y-6"
                        >

                            <div>

                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Video URL
                                </label>

                                <input
                                    type="url"
                                    required
                                    value={videoUrl}
                                    onChange={(e) => setVideoUrl(e.target.value)}
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
                                />

                                <p className="text-xs text-slate-400 mt-2">
                                    Paste a YouTube, Vimeo or any public video URL.
                                </p>

                            </div>

                            {/* Preview */}

                            {videoUrl && (
                                <div className="rounded-2xl border bg-slate-50 p-5">

                                    <div className="flex items-center gap-3">

                                        <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center">
                                            <FaVideo className="text-brand-600 text-xl" />
                                        </div>

                                        <div>

                                            <h3 className="font-semibold text-slate-800">
                                                Video Preview
                                            </h3>

                                            <a
                                                href={videoUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-brand-600 text-sm break-all hover:underline"
                                            >
                                                {videoUrl}
                                            </a>

                                        </div>

                                    </div>

                                </div>
                            )}

                            {/* Footer */}

                            <div className="flex justify-end gap-4 pt-2">

                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditing(null);
                                        setVideoUrl("");
                                    }}
                                    className="px-6 py-3 rounded-xl border border-slate-300 hover:bg-slate-100 transition font-medium"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold flex items-center gap-2 transition shadow-lg hover:shadow-xl"
                                >
                                    {editing ? (
                                        <>
                                            <FaSave />
                                            Update Story
                                        </>
                                    ) : (
                                        <>
                                            <FaPlus />
                                            Publish Story
                                        </>
                                    )}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

        </div>
    );
};

export default AdminSuccessStories;