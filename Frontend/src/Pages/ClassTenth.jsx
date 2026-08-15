import React, {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import {
    FaCalculator,
    FaFlask,
    FaBookOpen,
    FaChevronDown,
    FaLock,
    FaPlayCircle,
} from "react-icons/fa";


const API_URL = (
    import.meta.env.VITE_API_URL ||
    "https://code-and-class.onrender.com/api"
).replace(/\/+$/, "");


const ClassTenth = () => {

    const navigate = useNavigate();

    const [subjects, setSubjects] =
        useState([]);

    const [
        selectedSubject,
        setSelectedSubject,
    ] = useState(null);

    const [
        selectedChapter,
        setSelectedChapter,
    ] = useState(null);

    const [loading, setLoading] =
        useState(true);


    // =====================================================
    // LOAD CLASS 10
    // =====================================================

    useEffect(() => {

        const loadSubjects = async () => {

            try {

                setLoading(true);

                const res = await fetch(
                    `${API_URL}/classTenth`
                );

                const data =
                    await res.json();

                if (!res.ok) {
                    throw new Error(
                        data.message ||
                        "Failed to load Class 10"
                    );
                }

                setSubjects(
                    data.data || []
                );

            } catch (error) {

                console.error(
                    "Class 10 loading error:",
                    error
                );

            } finally {

                setLoading(false);

            }
        };


        loadSubjects();

    }, []);


    // =====================================================
    // OPEN VIDEO
    // =====================================================

    const openProblem = (
        problem
    ) => {

        console.log(
            "Opening problem:",
            problem
        );


        if (!problem.videoId) {

            console.error(
                "Problem has no videoId:",
                problem
            );

            alert(
                "This video does not have a video ID. Please update this lecture."
            );

            return;
        }


        if (problem.isPaid) {

            navigate(`/buy-video/${encodeURIComponent(problem._id)}`);

        } else {

            navigate(
                `/topic-video/${encodeURIComponent(
                    problem.videoId
                )}`
            );

        }
    };


    const icons = [
        <FaCalculator />,
        <FaFlask />,
        <FaBookOpen />,
    ];


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
            ">

                <p className="text-xl">
                    Loading Class 10...
                </p>

            </div>
        );
    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="
            min-h-screen
            bg-gray-100
            p-5
            mt-12
        ">

            <div className="
                max-w-7xl
                mx-auto
            ">

                <h1 className="
                    text-4xl
                    font-bold
                    text-center
                ">
                    Class 10 Learning Portal
                </h1>


                {/* SUBJECTS */}

                {!selectedSubject && (

                    <div className="
                        grid
                        sm:grid-cols-2
                        lg:grid-cols-4
                        gap-6
                        mt-10
                    ">

                        {subjects.map(
                            (subject, index) => (

                                <button
                                    key={
                                        subject._id
                                    }
                                    onClick={() => {

                                        setSelectedSubject(
                                            subject
                                        );

                                        setSelectedChapter(
                                            null
                                        );

                                    }}
                                    className="
                                        bg-gradient-to-r
                                        from-blue-500
                                        to-cyan-500
                                        text-white
                                        p-8
                                        rounded-3xl
                                        shadow-lg
                                        hover:scale-105
                                        transition
                                    "
                                >

                                    <div className="
                                        text-4xl
                                    ">
                                        {
                                            icons[
                                            index %
                                            icons.length
                                            ]
                                        }
                                    </div>

                                    <h2 className="
                                        text-xl
                                        font-bold
                                        mt-4
                                    ">
                                        {
                                            subject.subject
                                        }
                                    </h2>

                                </button>

                            )
                        )}

                    </div>

                )}


                {/* CHAPTERS */}

                {selectedSubject && (
                    <div className="
                        bg-white
                        rounded-3xl
                        shadow
                        p-6
                        mt-10
                    ">

                        <div className="
                            flex
                            justify-between
                            items-center
                        ">

                            <h2 className="
                                text-3xl
                                font-bold
                            ">
                                {
                                    selectedSubject.subject
                                }
                            </h2>

                            <button
                                onClick={() => {

                                    setSelectedSubject(
                                        null
                                    );

                                    setSelectedChapter(
                                        null
                                    );

                                }}
                                className="
                                    text-blue-600
                                    font-semibold
                                "
                            >
                                Back
                            </button>

                        </div>


                        {(
                            selectedSubject.chapters ||
                            []
                        ).map(
                            (chapter, ind) => (

                                <div
                                    key={
                                        ind
                                    }
                                    className="
                                        border
                                        rounded-xl
                                        mt-5
                                        overflow-hidden
                                    "
                                >
                                    <button
                                        onClick={() =>
                                            setSelectedChapter(
                                                chapter
                                            )
                                        }
                                        className="
                                            w-full
                                            flex
                                            justify-between
                                            items-center
                                            p-5
                                            hover:bg-gray-50
                                        "
                                    >

                                        <div className="
                                            text-left
                                        ">

                                            <h3 className="
                                                font-bold
                                            ">
                                                Chapter{" "}
                                                {
                                                    chapter.chapterNumber
                                                }
                                            </h3>

                                            <p className="
                                                text-gray-600
                                            ">
                                                {
                                                    chapter.chapterName
                                                }
                                            </p>

                                        </div>

                                        <FaChevronDown />

                                    </button>

                                </div>

                            )
                        )}

                    </div>
                )}


                {/* LECTURES */}

                {selectedChapter && (

                    <div className="
                        bg-white
                        rounded-3xl
                        p-6
                        shadow
                        mt-8
                    ">

                        <div className="
                            flex
                            justify-between
                            items-center
                        ">

                            <div>

                                <h2 className="
                                    text-2xl
                                    font-bold
                                ">
                                    {
                                        selectedChapter.chapterName
                                    }
                                </h2>

                                <p className="
                                    text-gray-500
                                    mt-1
                                ">
                                    Select a lecture
                                    to continue
                                </p>

                            </div>

                            <button
                                onClick={() =>
                                    setSelectedChapter(
                                        null
                                    )
                                }
                                className="
                                    text-blue-600
                                    font-semibold
                                "
                            >
                                Back
                            </button>

                        </div>


                        <div className="
                            grid
                            md:grid-cols-2
                            gap-5
                            mt-6
                        ">

                            {(
                                selectedChapter.problems ||
                                []
                            ).map(
                                (problem, ind) => (

                                    <button
                                        key={
                                            ind
                                        }
                                        onClick={() =>
                                            openProblem(
                                                problem
                                            )
                                        }
                                        className="
                                            border
                                            rounded-xl
                                            p-5
                                            text-left
                                            hover:bg-blue-50
                                            transition
                                        "
                                    >
                                        <div className="
                                            flex
                                            justify-between
                                            items-start
                                            gap-4
                                        ">

                                            <div>

                                                <h3 className="
                                                    font-bold
                                                    text-lg
                                                ">
                                                    {
                                                        problem.name
                                                    }
                                                </h3>

                                                <p className="
                                                    text-gray-500
                                                    mt-2
                                                ">
                                                    {
                                                        problem.description
                                                    }
                                                </p>

                                            </div>


                                            {problem.isPaid ? (

                                                <FaLock className="
                                                    text-yellow-500
                                                    text-xl
                                                " />

                                            ) : (

                                                <FaPlayCircle className="
                                                    text-green-500
                                                    text-xl
                                                " />

                                            )}

                                        </div>


                                        <div className="
                                            mt-4
                                        ">

                                            {problem.isPaid ? (

                                                <span className="
                                                    inline-block
                                                    bg-yellow-100
                                                    text-yellow-700
                                                    px-3
                                                    py-1
                                                    rounded-lg
                                                    text-sm
                                                    font-semibold
                                                ">
                                                    Premium · ₹
                                                    {
                                                        problem.price
                                                    }
                                                </span>

                                            ) : (

                                                <span className="
                                                    inline-block
                                                    bg-green-100
                                                    text-green-700
                                                    px-3
                                                    py-1
                                                    rounded-lg
                                                    text-sm
                                                    font-semibold
                                                ">
                                                    Free Lecture
                                                </span>

                                            )}

                                        </div>

                                    </button>

                                )
                            )}

                        </div>

                    </div>

                )}

            </div>

        </div>

    );
};

export default ClassTenth;