import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthProvider";
import { authAxios } from "../../utils/authAxios";

// =====================================================
// HELPER: Extract a Drive file ID from any common share
// link format. Returns null for non-Drive URLs.
//
// Handles formats like:
//   https://drive.google.com/file/d/FILE_ID/view?usp=sharing
//   https://drive.google.com/open?id=FILE_ID
//   https://drive.google.com/uc?id=FILE_ID&export=download
// =====================================================
const extractDriveFileId = (url) => {
    if (!url || !url.includes("drive.google.com")) return null;

    const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileMatch) return fileMatch[1];

    const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idMatch) return idMatch[1];

    return null;
};

// =====================================================
// HELPER: Build an ordered list of candidate image URLs
// to try, in order of reliability. For non-Drive URLs
// this is just a single-item array (the original URL).
//
// `size` controls the requested Drive thumbnail width in
// pixels (smaller = lighter request = less likely to hit
// rate limits). Pass null for the original/full-size URL.
//
// NOTE: hotlinking Drive images this way is unofficial.
// Google can (and does) rate-limit / throttle these
// endpoints (HTTP 429) with no warning and no SLA. This
// fallback chain reduces how often that shows up as a
// broken image, but it is NOT a permanent fix. For a
// reliable gallery, move images to real image hosting
// (Cloudinary/S3/ImageKit) or proxy them through your
// own backend using the Drive API.
// =====================================================
const getImageUrlCandidates = (url, size = 1000) => {
    if (!url) return [url];

    const trimmed = url.trim();
    const fileId = extractDriveFileId(trimmed);

    if (!fileId) {
        return [trimmed];
    }

    return [
        `https://lh3.googleusercontent.com/d/${fileId}=w${size}`,
        `https://drive.google.com/thumbnail?id=${fileId}&sz=w${size}`,
        `https://drive.google.com/uc?export=view&id=${fileId}`,
    ];
};

// For the "save to backend" case we still just want one
// normalized URL (the primary candidate, full size).
const getDirectImageUrl = (url) => getImageUrlCandidates(url, 1000)[0];

// Once the gallery grows past this many images, switch the
// grid to small thumbnail requests instead of full-size ones.
const PREVIEW_THRESHOLD = 50;
const THUMBNAIL_SIZE = 300;
const FULL_SIZE = 1200;

// =====================================================
// GalleryImage: renders an <img> that walks through the
// fallback URL candidates on error, and stops at a
// placeholder once all candidates are exhausted.
// =====================================================
const GalleryImage = ({ src, alt, className, size, onClick }) => {
    const candidates = React.useMemo(
        () => getImageUrlCandidates(src, size),
        [src, size]
    );
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        setAttempt(0);
    }, [src, size]);

    const handleError = () => {
        setAttempt((prev) => prev + 1);
    };

    const currentSrc =
        attempt < candidates.length
            ? candidates[attempt]
            : "https://via.placeholder.com/400x300?text=Image+unavailable";

    return (
        <img
            src={currentSrc}
            alt={alt}
            loading="lazy"
            onError={attempt < candidates.length ? handleError : undefined}
            onClick={onClick}
            className={className}
        />
    );
};

// =====================================================
// ImageLightbox: full-screen overlay showing the
// full-size version of a clicked thumbnail.
// =====================================================
const ImageLightbox = ({ src, onClose }) => {
    if (!src) return null;

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
        >
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white text-3xl leading-none hover:opacity-70"
                aria-label="Close preview"
            >
                &times;
            </button>

            <GalleryImage
                src={src}
                alt="Full preview"
                size={FULL_SIZE}
                className="max-w-full max-h-full object-contain rounded-md"
            />
        </div>
    );
};

const AddEditGallery = () => {
    const { accessToken } = useContext(AuthContext);

    const [gallery, setGallery] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editUrl, setEditUrl] = useState("");
    const [newImageUrl, setNewImageUrl] = useState("");
    const [lightboxSrc, setLightboxSrc] = useState(null);

    // =====================================================
    // BATCHED LOADING: show images 10 at a time instead of
    // rendering (and requesting) every image at once. This
    // cuts down on simultaneous <img> requests, which helps
    // avoid tripping Google's rate limit on Drive-hosted
    // images (see getImageUrlCandidates above).
    // =====================================================
    const BATCH_SIZE = 10;
    const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
    const loadMoreRef = useRef(null);

    const api = authAxios(() => accessToken);

    // =====================================================
    // FETCH GALLERY
    // =====================================================

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const { data } = await api.get("/gallery");

                setGallery(data);
                setVisibleCount(BATCH_SIZE); // reset batching on fresh load
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
    // AUTO-LOAD NEXT BATCH ON SCROLL
    // Watches a sentinel element near the bottom of the
    // rendered list; when it scrolls into view, reveal the
    // next 10 images.
    // =====================================================
    useEffect(() => {
        const node = loadMoreRef.current;
        if (!node) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setVisibleCount((prev) =>
                        Math.min(prev + BATCH_SIZE, gallery.length)
                    );
                }
            },
            { rootMargin: "200px" } // start loading a bit before it's fully in view
        );

        observer.observe(node);

        return () => observer.disconnect();
    }, [gallery.length, visibleCount]);

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
                    imageUrl: getDirectImageUrl(editUrl.trim()),
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
                    imageUrl: getDirectImageUrl(newImageUrl.trim()),
                }
            );

            setGallery((prev) => [
                added,
                ...prev,
            ]);
            setVisibleCount((prev) => prev + 1);

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

                <p className="text-xs text-slate-400 mb-3">
                    Paste a direct image URL, or a Google Drive share link
                    (make sure it's shared as "Anyone with the link").
                </p>

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

                {gallery.slice(0, visibleCount).map((item) => (

                    <div
                        key={item._id}
                        className="bg-white p-4 rounded-xl border border-slate-200 shadow-md hover:border-brand-400 transition space-y-4"
                    >

                        <GalleryImage
                            src={item.imageUrl}
                            alt="Gallery"
                            size={
                                gallery.length > PREVIEW_THRESHOLD
                                    ? THUMBNAIL_SIZE
                                    : FULL_SIZE
                            }
                            onClick={() => setLightboxSrc(item.imageUrl)}
                            className="w-full h-56 object-cover rounded-md cursor-pointer"
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

            {/* =====================================================
                LOAD MORE (auto via scroll, or manual click)
            ===================================================== */}

            {visibleCount < gallery.length && (
                <div
                    ref={loadMoreRef}
                    className="flex justify-center mt-10"
                >
                    <button
                        onClick={() =>
                            setVisibleCount((prev) =>
                                Math.min(prev + BATCH_SIZE, gallery.length)
                            )
                        }
                        className="border border-brand-500 text-brand-600 hover:bg-brand-600 hover:text-white px-6 py-2 rounded-md transition"
                    >
                        Load More ({gallery.length - visibleCount} remaining)
                    </button>
                </div>
            )}

            {/* =====================================================
                LIGHTBOX (full-size preview on click)
            ===================================================== */}

            <ImageLightbox
                src={lightboxSrc}
                onClose={() => setLightboxSrc(null)}
            />

        </div>
    );
};

export default AddEditGallery;