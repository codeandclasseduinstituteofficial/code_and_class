import React, {
    useContext,
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    FaLock,
    FaPlayCircle,
    FaArrowLeft,
} from "react-icons/fa";

import {
    AuthContext,
} from "../context/AuthProvider";


const API_URL = (
    import.meta.env.VITE_API_URL ||
    "http://localhost:8080/api"
).replace(/\/+$/, "");


const TopicVideo = () => {

    const { id } = useParams();

    const navigate =
        useNavigate();

    const {
        accessToken,
    } = useContext(AuthContext);


    const [hasAccess, setHasAccess] =
        useState(false);

    const [video, setVideo] =
        useState(null);

    const [contentType, setContentType] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // =====================================================
    // LOAD VIDEO
    // =====================================================

    useEffect(() => {

        if (!id) {

            setError(
                "Video ID is missing."
            );

            setLoading(false);

            return;
        }


        const loadVideo = async () => {

            try {

                setLoading(true);

                setError("");

                setVideo(null);

                setHasAccess(false);


                // =================================================
                // GET VIDEO
                // =================================================

                const videoUrl =
                    `${API_URL}/video/${encodeURIComponent(
                        id
                    )}`;


                console.log(
                    "Loading video:",
                    videoUrl
                );


                const res =
                    await fetch(
                        videoUrl
                    );


                const data =
                    await res.json();


                if (!res.ok) {

                    throw new Error(
                        data.message ||
                        `Video API returned ${res.status}`
                    );
                }


                if (!data?.data) {

                    setError(
                        "Video not found."
                    );

                    return;
                }


                setVideo(
                    data.data
                );

                setContentType(
                    data.type
                );


                // =================================================
                // FREE VIDEO
                // =================================================

                if (
                    !data.data.isPaid
                ) {

                    setHasAccess(
                        true
                    );

                    return;
                }


                // =================================================
                // PAID VIDEO
                // =================================================

                if (!accessToken) {

                    setHasAccess(
                        false
                    );

                    return;
                }


                const accessResponse =
                    await fetch(
                        `${API_URL}/purchase/access/${encodeURIComponent(
                            id
                        )}`,
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${accessToken}`,
                            },
                        }
                    );


                if (!accessResponse.ok) {

                    setHasAccess(
                        false
                    );

                    return;
                }


                const accessData =
                    await accessResponse.json();


                setHasAccess(
                    Boolean(
                        accessData.hasAccess
                    )
                );

            } catch (error) {

                console.error(
                    "Video loading error:",
                    error
                );

                setVideo(null);

                setError(
                    error.message ||
                    "Unable to load video."
                );

            } finally {

                setLoading(false);

            }
        };


        loadVideo();

    }, [
        id,
        accessToken,
    ]);


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <div className="
                min-h-screen
                flex
                items-center
                justify-center
                bg-gray-100
                mt-10
            ">

                <div className="
                    text-center
                ">

                    <div className="
                        text-xl
                        font-semibold
                    ">
                        Loading video...
                    </div>

                    <p className="
                        text-gray-500
                        mt-2
                    ">
                        Please wait
                    </p>

                </div>

            </div>
        );
    }


    // =====================================================
    // VIDEO NOT FOUND
    // =====================================================

    if (!video) {

        return (
            <div className="
                min-h-screen
                bg-gray-100
                p-5
                md:p-10
                mt-10
            ">

                <div className="
                    max-w-4xl
                    mx-auto
                    bg-white
                    rounded-3xl
                    shadow
                    p-10
                    text-center
                ">

                    <h1 className="
                        text-2xl
                        font-bold
                        text-red-600
                    ">
                        Video Not Found
                    </h1>

                    <p className="
                        text-gray-500
                        mt-3
                    ">
                        {
                            error ||
                            "The requested video could not be found."
                        }
                    </p>

                    <button
                        onClick={() =>
                            navigate(-1)
                        }
                        className="
                            mt-6
                            bg-indigo-600
                            text-white
                            px-6
                            py-3
                            rounded-xl
                            font-semibold
                        "
                    >
                        Go Back
                    </button>

                </div>

            </div>
        );
    }


    // =====================================================
    // VIDEO URL
    // =====================================================

    const getVideoUrl = (
        url
    ) => {

        if (!url) {
            return "";
        }


        try {

            const parsedUrl =
                new URL(url);


            // YouTube embed

            if (
                parsedUrl.hostname.includes(
                    "youtube.com"
                ) &&
                parsedUrl.pathname.startsWith(
                    "/embed/"
                )
            ) {
                return url;
            }


            // YouTube watch

            if (
                parsedUrl.hostname.includes(
                    "youtube.com"
                ) &&
                parsedUrl.pathname ===
                "/watch"
            ) {

                const youtubeId =
                    parsedUrl.searchParams.get(
                        "v"
                    );

                if (youtubeId) {

                    return `https://www.youtube.com/embed/${youtubeId}`;

                }
            }


            // youtu.be

            if (
                parsedUrl.hostname ===
                "youtu.be"
            ) {

                const youtubeId =
                    parsedUrl.pathname.substring(
                        1
                    );

                if (youtubeId) {

                    return `https://www.youtube.com/embed/${youtubeId}`;

                }
            }


            return url;

        } catch (error) {

            console.error(
                "Invalid video URL:",
                url
            );

            return url;
        }
    };


    const videoUrl =
        getVideoUrl(
            video.videoLink
        );


    const isYouTube =
        videoUrl.includes(
            "youtube.com/embed/"
        );


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="
            min-h-screen
            bg-gray-100
            p-5
            md:p-10
            mt-10
        ">

            <div className="
                max-w-6xl
                mx-auto
                bg-white
                rounded-3xl
                shadow
                p-5
                md:p-8
            ">


                {/* BACK */}

                <button
                    onClick={() =>
                        navigate(-1)
                    }
                    className="
                        flex
                        items-center
                        gap-2
                        text-gray-600
                        hover:text-indigo-600
                        mb-6
                        font-semibold
                    "
                >

                    <FaArrowLeft />

                    Back

                </button>


                {/* TITLE */}

                <span className="
                    inline-block
                    bg-indigo-100
                    text-indigo-700
                    px-3
                    py-1
                    rounded-full
                    text-sm
                    font-semibold
                ">
                    {
                        contentType ||
                        "Learning Video"
                    }
                </span>


                <h1 className="
                    text-3xl
                    md:text-4xl
                    font-bold
                    mt-4
                    text-gray-900
                ">
                    {
                        video.name ||
                        video.topicName ||
                        "Course Video"
                    }
                </h1>


                {/* VIDEO */}

                <div className="
                    mt-8
                    aspect-video
                    rounded-2xl
                    overflow-hidden
                    bg-black
                ">

                    {hasAccess ? (

                        videoUrl ? (

                            isYouTube ? (

                                <iframe
                                    title={
                                        video.name ||
                                        video.topicName ||
                                        "Course Video"
                                    }
                                    className="
                                        w-full
                                        h-full
                                    "
                                    src={
                                        videoUrl
                                    }
                                    allow="
                                        accelerometer;
                                        autoplay;
                                        clipboard-write;
                                        encrypted-media;
                                        gyroscope;
                                        picture-in-picture;
                                        web-share
                                    "
                                    allowFullScreen
                                />

                            ) : (

                                <video
                                    className="
                                        w-full
                                        h-full
                                        object-contain
                                        bg-black
                                    "
                                    controls
                                    playsInline
                                    preload="metadata"
                                >

                                    <source
                                        src={
                                            videoUrl
                                        }
                                        type="video/mp4"
                                    />

                                    Your browser does not support video playback.

                                </video>

                            )

                        ) : (

                            <div className="
                                h-full
                                flex
                                items-center
                                justify-center
                                text-white
                            ">
                                Video URL is missing.
                            </div>

                        )

                    ) : (

                        <div className="
                            h-full
                            flex
                            flex-col
                            items-center
                            justify-center
                            text-white
                            bg-gray-950
                            text-center
                            p-5
                        ">

                            <FaLock className="
                                text-5xl
                                mb-5
                                text-yellow-400
                            " />

                            <h2 className="
                                text-2xl
                                font-bold
                            ">
                                Premium Video
                            </h2>

                            <p className="
                                mt-2
                                text-gray-300
                            ">
                                Purchase this lesson
                                to watch it.
                            </p>

                        </div>

                    )}

                </div>


                {/* DESCRIPTION */}

                <div className="
                    mt-8
                    p-5
                    bg-gray-50
                    rounded-2xl
                ">

                    <h2 className="
                        text-xl
                        font-bold
                        flex
                        items-center
                        gap-2
                    ">

                        <FaPlayCircle />

                        Description

                    </h2>


                    <p className="
                        text-gray-600
                        mt-3
                        leading-relaxed
                    ">
                        {
                            video.description ||
                            "No description available."
                        }
                    </p>

                </div>


                {/* PREMIUM */}

                {video.isPaid &&
                    !hasAccess && (

                        <div className="
                            mt-8
                            bg-gradient-to-r
                            from-yellow-400
                            to-orange-500
                            text-white
                            rounded-2xl
                            p-6
                            flex
                            flex-col
                            md:flex-row
                            justify-between
                            items-center
                            gap-5
                        ">

                            <div>

                                <h2 className="
                                    text-2xl
                                    font-bold
                                    flex
                                    gap-3
                                    items-center
                                ">

                                    <FaLock />

                                    Premium Content

                                </h2>

                                <p className="
                                    mt-1
                                ">
                                    This lesson
                                    requires purchase.
                                </p>

                            </div>


                            <button
                                onClick={() =>
                                    navigate(
                                        `/buy-video/${encodeURIComponent(
                                            id
                                        )}`
                                    )
                                }
                                className="
                                    bg-white
                                    text-orange-600
                                    font-bold
                                    px-6
                                    py-3
                                    rounded-xl
                                "
                            >
                                Buy ₹
                                {
                                    video.price ||
                                    0
                                }
                            </button>

                        </div>
                    )}


                {/* ALREADY PURCHASED */}

                {video.isPaid &&
                    hasAccess && (

                        <div className="
                            mt-6
                            bg-green-50
                            border
                            border-green-200
                            text-green-700
                            rounded-xl
                            p-4
                            font-semibold
                        ">
                            ✓ You have access to
                            this premium lesson.
                        </div>

                    )}

            </div>

        </div>
    );
};


export default TopicVideo;