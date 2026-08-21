import React, { useEffect, useRef, useState } from "react";
import { Zoom } from "react-awesome-reveal";
import { FaDownload } from "react-icons/fa";

const Gallery = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    // Counter states
    const [photoCount, setPhotoCount] = useState(0);
    const [eventCount, setEventCount] = useState(0);
    const [studentCount, setStudentCount] = useState(0);

    // Tracks which card's overlay is "open" on tap (mobile has no :hover)
    const [activeIndex, setActiveIndex] = useState(null);
    const [downloadingIndex, setDownloadingIndex] = useState(null);

    const statsRef = useRef(null);
    const hasAnimated = useRef(false);

    // ---- Google Drive URL helpers ---------------------------------------
    // Drive "share" links (…/file/d/ID/view or …/open?id=ID) don't work
    // directly as an <img src>. We pull the file ID out and rebuild a URL
    // that Drive will actually render as an image / serve as a download.
    // const getDriveFileId = (url) => {
    //     if (!url) return null;
    //     const match =
    //         url.match(/\/d\/([a-zA-Z0-9_-]+)/) ||       // .../file/d/ID/view
    //         url.match(/[?&]id=([a-zA-Z0-9_-]+)/);        // .../open?id=ID or ?id=ID
    //     return match ? match[1] : null;
    // };

    // const getDisplayUrl = (url) => {
    //     if (!url) return url;
    //     if (!url.includes("drive.google.com")) return url;
    //     const fileId = getDriveFileId(url);
    //     if (!fileId) return url;
    //     // Drive's thumbnail endpoint is the most reliable one for <img> tags
    //     return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
    // };

    const getDriveFileId = (url) => {
        if (!url) return null;
        const match =
            url.match(/\/d\/([a-zA-Z0-9_-]+)/) ||
            url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
        return match ? match[1] : null;
    };

    const getResourceKey = (url) => {
        if (!url) return null;
        const match = url.match(/resourcekey=([a-zA-Z0-9_-]+)/);
        return match ? match[1] : null;
    };

    const getDisplayUrl = (url) => {
        if (!url) return url;
        if (!url.includes("drive.google.com")) return url;
        const fileId = getDriveFileId(url);
        if (!fileId) return url;
        const resourceKey = getResourceKey(url);
        let thumbUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
        if (resourceKey) thumbUrl += `&resourcekey=${resourceKey}`;
        return thumbUrl;
    };

    const getDownloadUrl = (url) => {
        if (!url) return url;
        if (!url.includes("drive.google.com")) return url;
        const fileId = getDriveFileId(url);
        if (!fileId) return url;
        return `https://drive.google.com/uc?export=download&id=${fileId}`;
    };

    // Fetch gallery images
    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL || "https://code-and-class.onrender.com/api"}/gallery`
                );
                const data = await res.json();
                setImages(data);
            } catch (err) {
                console.error("Error fetching gallery:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchGallery();
    }, []);

    // Counter animation
    const animateCounter = (target, setter) => {
        const duration = 1500;
        const steps = 60;
        const increment = target / steps;

        let current = 0;
        let step = 0;

        const timer = setInterval(() => {
            step++;
            current += increment;

            if (step >= steps) {
                setter(target);
                clearInterval(timer);
            } else {
                setter(Math.floor(current));
            }
        }, duration / steps);
    };

    // Start animation when stats become visible
    useEffect(() => {
        if (images.length === 0) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;

                    animateCounter(images.length, setPhotoCount);
                    animateCounter(50, setEventCount);
                    animateCounter(1000, setStudentCount);
                }
            },
            { threshold: 0.3 }
        );

        if (statsRef.current) {
            observer.observe(statsRef.current);
        }

        return () => observer.disconnect();
    }, [images]);

    // Download handler: tries a same-origin/CORS-friendly fetch->blob first
    // (gives a clean forced download), and falls back to just opening the
    // direct download URL (works for Drive, which blocks cross-origin fetch).
    const handleDownload = async (e, img, index) => {
        e.stopPropagation();
        e.preventDefault();

        const downloadUrl = getDownloadUrl(img.imageUrl);
        setDownloadingIndex(index);

        try {
            const response = await fetch(downloadUrl, { mode: "cors" });
            if (!response.ok) throw new Error("Network response was not ok");
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = `code-and-class-gallery-${index + 1}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (err) {
            console.error("Direct download failed, opening image instead:", err);
            window.open(downloadUrl, "_blank", "noopener,noreferrer");
        } finally {
            setDownloadingIndex(null);
        }
    };

    const toggleActive = (index) => {
        setActiveIndex((prev) => (prev === index ? null : index));
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white relative top-16">

            {/* Hero */}
            <section className="py-20 px-6 text-center">
                <span className="inline-block bg-brand-100 text-brand-600 px-4 py-1 rounded-full text-sm font-semibold mb-4">
                    📸 Code and Class Gallery
                </span>

                <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900">
                    Moments That{" "}
                    <span className="relative inline-block text-brand-600">
                        Inspire

                        <svg
                            className="absolute left-0 top-full mt-1 w-full h-3"
                            viewBox="0 0 100 10"
                            preserveAspectRatio="none"
                        >
                            <path
                                d="M0 8 Q50 0 100 8"
                                stroke="currentColor"
                                strokeWidth="2"
                                fill="transparent"
                                className="text-accent-400"
                            />
                        </svg>
                    </span>
                </h1>

                <p className="max-w-2xl mx-auto mt-6 text-slate-500 text-lg">
                    Explore our workshops, classrooms, student achievements,
                    certifications, campus life, and unforgettable memories.
                </p>
            </section>

            {/* Animated Stats */}
            <section ref={statsRef} className="max-w-6xl mx-auto px-6 mb-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    <div className="bg-white rounded-3xl shadow-lg p-8 text-center hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
                        <h2 className="text-5xl font-extrabold text-brand-600">
                            {photoCount}+
                        </h2>
                        <p className="mt-3 text-slate-500 font-medium">
                            Gallery Photos
                        </p>
                    </div>

                    <div className="bg-white rounded-3xl shadow-lg p-8 text-center hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
                        <h2 className="text-5xl font-extrabold text-brand-600">
                            {eventCount}+
                        </h2>
                        <p className="mt-3 text-slate-500 font-medium">
                            Events Conducted
                        </p>
                    </div>

                    <div className="bg-white rounded-3xl shadow-lg p-8 text-center hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
                        <h2 className="text-5xl font-extrabold text-brand-600">
                            {studentCount.toLocaleString()}+
                        </h2>
                        <p className="mt-3 text-slate-500 font-medium">
                            Happy Students
                        </p>
                    </div>

                </div>
            </section>

            {/* Gallery */}
            <section className="max-w-7xl mx-auto px-6 pb-24">

                {loading ? (
                    <div className="text-center text-slate-500 text-lg">
                        Loading Gallery...
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

                        {images.map((img, index) => {
                            const displayUrl = getDisplayUrl(img.imageUrl);
                            const isActive = activeIndex === index;
                            const isDownloading = downloadingIndex === index;

                            return (
                                <Zoom key={index} triggerOnce>

                                    <div
                                        className="group relative overflow-hidden rounded-3xl shadow-xl bg-white cursor-pointer"
                                        onClick={() => toggleActive(index)}
                                    >

                                        {/* <img
                                            src={displayUrl}
                                            alt={`Gallery ${index + 1}`}
                                            loading="lazy"
                                            referrerPolicy="no-referrer"
                                            className="w-full h-80 object-cover transition-all duration-700 group-hover:scale-110"
                                        /> */}

                                        <img
                                            src={displayUrl}
                                            alt={`Gallery ${index + 1}`}
                                            loading="lazy"
                                            referrerPolicy="no-referrer"
                                            onError={(e) => {
                                                const fileId = getDriveFileId(img.imageUrl);
                                                if (fileId && !e.target.dataset.fallbackTried) {
                                                    e.target.dataset.fallbackTried = "true";
                                                    e.target.src = `https://lh3.googleusercontent.com/d/${fileId}=w1000`;
                                                }
                                            }}
                                            className="w-full h-80 object-cover transition-all duration-700 group-hover:scale-110"
                                        />

                                        <div
                                            className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-all duration-500 flex items-end justify-between
                                                ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                                        >

                                            <div className="p-6 text-white">

                                                <h3 className="text-xl font-bold">
                                                    Code and Class
                                                </h3>

                                                <p className="text-sm text-slate-200 mt-1">
                                                    Learning • Innovation • Success
                                                </p>

                                            </div>

                                            <button
                                                type="button"
                                                onClick={(e) => handleDownload(e, img, index)}
                                                disabled={isDownloading}
                                                aria-label="Download image"
                                                className="m-4 flex items-center gap-2 bg-white/90 hover:bg-white text-slate-900 text-sm font-semibold px-3 py-2 rounded-full shadow-lg transition-all disabled:opacity-60"
                                            >
                                                <FaDownload className={isDownloading ? "animate-bounce" : ""} />
                                                <span className="hidden sm:inline">
                                                    {isDownloading ? "Downloading..." : "Download"}
                                                </span>
                                            </button>

                                        </div>

                                    </div>

                                </Zoom>
                            );
                        })}

                    </div>
                )}

            </section>

        </div>
    );
};

export default Gallery;