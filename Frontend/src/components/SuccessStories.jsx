import axios from "axios";
import React, { useEffect, useState } from "react";

const SuccessStories = () => {
    const [activeTab, setActiveTab] = useState("voices");

    const [successStories, setSuccessStories] = useState([]);
    const [studentVoices, setStudentVoices] = useState([]);

    const [loading, setLoading] = useState(true);
    const [mobileIndex, setMobileIndex] = useState(0);

    // ===============================
    // Fetch Success Story Videos
    // ===============================
    const fetchSuccessStories = async () => {
        try {
            const { data } = await axios.get(
                `${import.meta.env.VITE_API_URL || "https://code-and-class.onrender.com/api"}/successStories/`
            );

            setSuccessStories(data.stories || []);
        } catch (error) {
            console.log("Success story error", error);
        }
    };

    // ===============================
    // Fetch Student Reviews
    // ===============================
    const fetchStudentVoices = async () => {
        try {
            const { data } = await axios.get(
                `${import.meta.env.VITE_API_URL || "https://code-and-class.onrender.com/api"}/studentVoice/`
            );

            setStudentVoices(data.voices || []);
        } catch (error) {
            console.log("Student voice error", error);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);

            await Promise.all([
                fetchSuccessStories(),
                fetchStudentVoices(),
            ]);

            setLoading(false);
        };

        loadData();
    }, []);

    // ===============================
    // Convert Video URL
    // ===============================
    const getVideoSource = (url) => {
        if (!url) return null;

        if (
            url.includes("youtube.com") ||
            url.includes("youtu.be")
        ) {
            let videoId = "";

            if (url.includes("watch?v=")) {
                videoId = url
                    .split("watch?v=")[1]
                    .split("&")[0];
            } else {
                videoId = url.split("/").pop();
            }

            return {
                type: "iframe",
                url: `https://www.youtube.com/embed/${videoId}`,
            };
        }

        if (url.includes("drive.google.com")) {
            const id = url
                .split("/d/")[1]
                ?.split("/")[0];

            return {
                type: "iframe",
                url: `https://drive.google.com/file/d/${id}/preview`,
            };
        }

        return {
            type: "video",
            url,
        };
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setMobileIndex(0);
    };

    const goPrev = () => {
        setMobileIndex((prev) =>
            Math.max(prev - 1, 0)
        );
    };

    const goNext = () => {
        setMobileIndex((prev) =>
            Math.min(
                prev + 1,
                successStories.length - 1
            )
        );
    };

    // ===============================
    // Video Card
    // ===============================
    const VideoCard = ({ item }) => {
        const video = getVideoSource(item.videoUrl);

        return (
            <div
                className="
                bg-white
                rounded-2xl
                overflow-hidden
                shadow-md
                hover:shadow-2xl
                transition-all
                duration-300
                hover:-translate-y-2
            "
            >
                <div className="relative aspect-video">
                    {video?.type === "iframe" ? (
                        <iframe
                            src={video.url}
                            title="Success Story"
                            className="absolute inset-0 w-full h-full"
                            allow="autoplay; encrypted-media; fullscreen"
                            allowFullScreen
                        />
                    ) : (
                        <video
                            src={video?.url}
                            controls
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    )}
                </div>
            </div>
        );
    };

    // ===============================
    // Review Card
    // ===============================
    const ReviewCard = ({ item }) => {
        return (
            <div
                className="
                bg-white
                rounded-2xl
                border
                border-gray-100
                shadow-md
                hover:shadow-2xl
                hover:-translate-y-2
                transition-all
                duration-300
                p-6
                flex
                flex-col
                h-full
            "
            >
                <div className="text-6xl text-brand-600/20 font-serif leading-none">
                    ❝
                </div>

                <p
                    className="
                    mt-3
                    text-gray-600
                    italic
                    leading-8
                    flex-1
                "
                >
                    {item.description}
                </p>

                <div className="flex items-center mt-8">
                    <div
                        className="
                        w-14
                        h-14
                        rounded-full
                        bg-gradient-to-r
                        from-brand-600
                        to-blue-700
                        text-white
                        flex
                        items-center
                        justify-center
                        font-bold
                        text-xl
                    "
                    >
                        {item.name?.charAt(0)}
                    </div>

                    <div className="ml-4">
                        <h3
                            className="
                            font-semibold
                            text-lg
                            text-[#162f51]
                        "
                        >
                            {item.name}
                        </h3>

                        <p
                            className="
                            text-sm
                            text-brand-600
                            font-medium
                        "
                        >
                            {item.course}
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-gradient-to-br from-white via-slate-50 to-white py-14 px-4 main_container">

            {/* Heading */}
            <div className="text-center mb-10">

                <h2 className="text-3xl xl:text-4xl font-bold text-[#162f51]">

                    Our Success{" "}

                    <span className="relative inline-block text-brand-600">
                        Stories

                        <svg
                            className="absolute left-0 top-full mt-1 w-full h-[10px]"
                            viewBox="0 0 100 10"
                            preserveAspectRatio="none"
                        >
                            <path
                                d="M0 8 Q50 0 100 8"
                                stroke="orangered"
                                strokeWidth="1.5"
                                fill="transparent"
                            />
                        </svg>
                    </span>

                </h2>

                <p className="mt-5 text-gray-500 max-w-2xl mx-auto">
                    Hear directly from our students through inspiring success stories
                    and genuine learning experiences.
                </p>

            </div>

            {/* Tabs */}

            <div className="flex justify-center gap-5 mb-12">

                <button
                    onClick={() => handleTabChange("voices")}
                    className={`px-6 py-3 rounded-full font-medium transition-all duration-300 border
    
                    ${activeTab === "voices"
                            ? "bg-brand-600 text-white shadow-lg"
                            : "bg-white border-brand-600 text-brand-600 hover:bg-brand-600 hover:text-white"
                        }
                `}
                >
                    Student Voices
                </button>

                <button
                    onClick={() => handleTabChange("experience")}
                    className={`px-6 py-3 rounded-full font-medium transition-all duration-300 border
    
                    ${activeTab === "experience"
                            ? "bg-brand-600 text-white shadow-lg"
                            : "bg-white border-brand-600 text-brand-600 hover:bg-brand-600 hover:text-white"
                        }
                `}
                >
                    Learning Experience
                </button>

            </div>

            {/* Loading */}

            {loading ? (

                <div className="flex justify-center py-20">

                    <div className="h-12 w-12 rounded-full border-4 border-brand-600 border-t-transparent animate-spin"></div>

                </div>

            ) : (

                <>

                    {activeTab === "voices" && (

                        <>
                            {
                                successStories.length === 0 ? (

                                    <div className="text-center py-20 text-gray-400">

                                        No Success Stories Available

                                    </div>

                                ) : (

                                    <>
                                        {/* Desktop */}

                                        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-7">

                                            {
                                                successStories.map((item) => (

                                                    <VideoCard
                                                        key={item._id}
                                                        item={item}
                                                    />

                                                ))
                                            }

                                        </div>

                                        {/* Mobile */}

                                        <div className="sm:hidden">

                                            <VideoCard
                                                item={
                                                    successStories[mobileIndex]
                                                }
                                            />

                                            <div className="flex justify-center items-center gap-5 mt-5">

                                                <button
                                                    onClick={goPrev}
                                                    disabled={mobileIndex === 0}
                                                    className="w-10 h-10 rounded-full bg-white shadow text-brand-600 disabled:opacity-30"
                                                >
                                                    ◀
                                                </button>

                                                <div className="flex gap-2">

                                                    {
                                                        successStories.map(
                                                            (_, index) => (

                                                                <button
                                                                    key={index}
                                                                    onClick={() =>
                                                                        setMobileIndex(index)
                                                                    }
                                                                    className={`transition-all rounded-full

                                            ${mobileIndex === index
                                                                            ? "bg-brand-600 w-6 h-2"
                                                                            : "bg-gray-300 w-2 h-2"
                                                                        }

                                        `}
                                                                />

                                                            )
                                                        )
                                                    }

                                                </div>

                                                <button
                                                    onClick={goNext}
                                                    disabled={
                                                        mobileIndex ===
                                                        successStories.length - 1
                                                    }
                                                    className="w-10 h-10 rounded-full bg-white shadow text-brand-600 disabled:opacity-30"
                                                >
                                                    ▶
                                                </button>

                                            </div>

                                        </div>

                                    </>

                                )
                            }

                        </>

                    )}

                    {/* Learning Experience */}

                    {activeTab === "experience" && (

                        <>
                            {
                                studentVoices.length === 0 ? (

                                    <div className="text-center py-20 text-gray-400">

                                        No Student Reviews Available

                                    </div>

                                ) : (

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                                        {
                                            studentVoices.map((item) => (

                                                <ReviewCard
                                                    key={item._id}
                                                    item={item}
                                                />

                                            ))
                                        }

                                    </div>

                                )
                            }

                        </>

                    )}

                </>

            )}

        </div>

    );

};

export default SuccessStories;