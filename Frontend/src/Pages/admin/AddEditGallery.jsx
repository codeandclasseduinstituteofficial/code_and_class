import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthProvider";
import { authAxios } from "../../utils/authAxios";

const AddEditGallery = () => {
    const { accessToken } = useContext(AuthContext);

    const [gallery, setGallery] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editUrl, setEditUrl] = useState("");
    const [newImageUrl, setNewImageUrl] = useState("");

    const api = authAxios(() => accessToken);

    // =====================================================
    // FETCH GALLERY
    // =====================================================

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const { data } = await api.get("/gallery");

                setGallery(data);
            } catch (error) {
                console.error(
                    "Error fetching gallery:",
                    error.response?.data || error.message
                );
            }
        };

        fetchGallery();
    }, [accessToken]);

    // =====================================================
    // DELETE IMAGE
    // =====================================================

    const handleDelete = async (id) => {
        try {
            await api.delete(`/gallery/${id}`);

            setGallery((prev) =>
                prev.filter((img) => img._id !== id)
            );
        } catch (error) {
            console.error(
                "Delete failed:",
                error.response?.data || error.message
            );
        }
    };

    // =====================================================
    // EDIT IMAGE
    // =====================================================

    const handleEditSave = async () => {
        if (!editId || !editUrl.trim()) {
            return;
        }

        try {
            const { data: updated } = await api.put(
                `/gallery/${editId}`,
                {
                    imageUrl: editUrl.trim(),
                }
            );

            setGallery((prev) =>
                prev.map((img) =>
                    img._id === editId ? updated : img
                )
            );

            setEditId(null);
            setEditUrl("");
        } catch (error) {
            console.error(
                "Edit failed:",
                error.response?.data || error.message
            );
        }
    };

    // =====================================================
    // ADD NEW IMAGE
    // =====================================================

    const handleAddImage = async () => {
        if (!newImageUrl.trim()) {
            return;
        }

        try {
            const { data: added } = await api.post(
                "/gallery",
                {
                    imageUrl: newImageUrl.trim(),
                }
            );

            setGallery((prev) => [
                added,
                ...prev,
            ]);

            setNewImageUrl("");
        } catch (error) {
            console.error(
                "Error adding image:",
                error.response?.data || error.message
            );
        }
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div className="min-h-screen bg-white text-slate-800 px-4 py-24 md:px-10 lg:px-20 relative top-16">

            <h1 className="text-3xl md:text-5xl font-bold text-center text-brand-600 mb-4">
                Manage Gallery
            </h1>

            <p className="text-slate-500 text-center max-w-xl mx-auto mb-10 text-sm md:text-base">
                View, add, update or remove gallery images from here.
            </p>

            {/* =====================================================
                ADD NEW IMAGE
            ===================================================== */}

            <div className="max-w-2xl mx-auto mb-12 bg-white border border-slate-200 p-6 rounded-xl shadow-lg">

                <h3 className="text-xl font-semibold text-brand-600 mb-4">
                    Add New Image
                </h3>

                <div className="flex flex-col md:flex-row items-center gap-4">

                    <input
                        type="text"
                        placeholder="Enter image URL"
                        value={newImageUrl}
                        onChange={(e) =>
                            setNewImageUrl(e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-md text-slate-800 border border-slate-300 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
                    />

                    <button
                        onClick={handleAddImage}
                        className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-2 rounded-md transition"
                    >
                        Add Image
                    </button>

                </div>
            </div>

            {/* =====================================================
                IMAGE GALLERY
            ===================================================== */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

                {gallery.map((item) => (

                    <div
                        key={item._id}
                        className="bg-white p-4 rounded-xl border border-slate-200 shadow-md hover:border-brand-400 transition space-y-4"
                    >

                        <img
                            src={item.imageUrl}
                            alt="Gallery"
                            className="w-full h-56 object-cover rounded-md"
                        />

                        {/* EDIT MODE */}

                        {editId === item._id ? (

                            <div className="space-y-3">

                                <input
                                    value={editUrl}
                                    onChange={(e) =>
                                        setEditUrl(e.target.value)
                                    }
                                    placeholder="Update Image URL"
                                    className="w-full px-3 py-2 rounded-md text-slate-800 border border-slate-300 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
                                />

                                <div className="flex gap-3">

                                    <button
                                        onClick={handleEditSave}
                                        className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-4 py-2 rounded-md transition"
                                    >
                                        Save
                                    </button>

                                    <button
                                        onClick={() => {
                                            setEditId(null);
                                            setEditUrl("");
                                        }}
                                        className="border border-slate-400 text-slate-600 hover:bg-slate-100 px-4 py-2 rounded-md transition"
                                    >
                                        Cancel
                                    </button>

                                </div>

                            </div>

                        ) : (

                            /* NORMAL MODE */

                            <div className="flex gap-4 justify-center">

                                <button
                                    onClick={() => {
                                        setEditId(item._id);
                                        setEditUrl(item.imageUrl);
                                    }}
                                    className="border border-brand-500 text-brand-600 hover:bg-brand-600 hover:text-white px-4 py-1 rounded-md transition"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() =>
                                        handleDelete(item._id)
                                    }
                                    className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-4 py-1 rounded-md transition"
                                >
                                    Delete
                                </button>

                            </div>

                        )}

                    </div>

                ))}

            </div>

        </div>
    );
};

export default AddEditGallery;