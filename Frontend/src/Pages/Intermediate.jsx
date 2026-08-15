import React, {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import {
    FaGraduationCap,
    FaCalculator,
    FaChevronRight,
    FaPlayCircle,
    FaLock,
} from "react-icons/fa";


const API_URL = (
    import.meta.env.VITE_API_URL ||
    "https://code-and-class.onrender.com/api"
).replace(/\/+$/, "");


const Intermediate = () => {

    const navigate = useNavigate();

    const [courses, setCourses] =
        useState([]);

    const [year, setYear] =
        useState(null);

    const [group, setGroup] =
        useState(null);

    const [subject, setSubject] =
        useState(null);

    const [chapter, setChapter] =
        useState(null);


    // =====================================================
    // LOAD DATA
    // =====================================================

    useEffect(() => {

        const loadCourses = async () => {

            try {

                const res =
                    await fetch(
                        `${API_URL}/intermediate`
                    );

                const data =
                    await res.json();

                if (!res.ok) {
                    throw new Error(
                        data.message ||
                        "Failed to load Intermediate"
                    );
                }

                setCourses(
                    data.data || []
                );

            } catch (error) {

                console.error(
                    "Intermediate loading error:",
                    error
                );

            }

        };


        loadCourses();

    }, []);


    // =====================================================
    // YEARS
    // =====================================================

    const years = [
        ...new Set(
            courses.map(
                (item) => item.year
            )
        ),
    ];


    // =====================================================
    // GROUPS
    // =====================================================

    const groups = [
        ...new Set(
            courses
                .filter(
                    (item) =>
                        item.year === year
                )
                .map(
                    (item) =>
                        item.group
                )
        ),
    ];


    // =====================================================
    // SUBJECTS
    // =====================================================

    const subjects =
        courses.filter(
            (item) =>
                item.year === year &&
                item.group === group
        );


    // =====================================================
    // OPEN TOPIC
    // =====================================================

    const openTopic = (topic) => {

        console.log(
            "Opening Intermediate topic:",
            topic
        );


        if (!topic.videoId) {

            console.error(
                "Topic has no videoId:",
                topic
            );

            alert(
                "This video does not have a video ID. Please update this topic."
            );

            return;
        }


        if (topic.isPaid) {

            navigate(`/buy-video/${encodeURIComponent(topic._id)}`);

        } else {

            navigate(
                `/topic-video/${encodeURIComponent(
                    topic.videoId
                )}`
            );

        }
    };


    return (

        <div className="
            min-h-screen
            bg-gray-100
            p-5
            md:p-10
            mt-10
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
                    Intermediate Learning Portal
                </h1>


                <p className="
                    text-center
                    text-gray-500
                    mt-3
                ">
                    Learn Intermediate First Year
                    and Second Year subjects.
                </p>


                {/* =================================================
                    YEAR
                ================================================= */}

                {!year && (

                    <div className="
                        grid
                        md:grid-cols-2
                        gap-8
                        mt-12
                    ">

                        {years.map(
                            (item) => (

                                <button
                                    key={item}
                                    onClick={() =>
                                        setYear(item)
                                    }
                                    className="
                                        bg-gradient-to-r
                                        from-indigo-500
                                        to-purple-600
                                        text-white
                                        p-10
                                        rounded-3xl
                                        shadow-xl
                                        hover:scale-105
                                        transition
                                    "
                                >

                                    <FaGraduationCap
                                        className="
                                            text-5xl
                                            mx-auto
                                            mb-5
                                        "
                                    />

                                    <h2 className="
                                        text-2xl
                                        font-bold
                                    ">
                                        {item}
                                    </h2>

                                </button>

                            )
                        )}

                    </div>

                )}


                {/* =================================================
                    GROUP
                ================================================= */}

                {year && !group && (

                    <div className="
                        grid
                        sm:grid-cols-2
                        lg:grid-cols-4
                        gap-6
                        mt-10
                    ">

                        {groups.map(
                            (item) => (

                                <button
                                    key={item}
                                    onClick={() =>
                                        setGroup(item)
                                    }
                                    className="
                                        bg-white
                                        shadow-lg
                                        rounded-2xl
                                        p-8
                                        hover:bg-indigo-50
                                    "
                                >

                                    <h2 className="
                                        text-3xl
                                        font-bold
                                    ">
                                        {item}
                                    </h2>

                                </button>

                            )
                        )}

                    </div>

                )}


                {/* =================================================
                    SUBJECT
                ================================================= */}

                {group && !subject && (

                    <div className="
                        grid
                        md:grid-cols-3
                        gap-6
                        mt-10
                    ">

                        {subjects.map(
                            (item) => (

                                <button
                                    key={
                                        item._id
                                    }
                                    onClick={() =>
                                        setSubject(
                                            item
                                        )
                                    }
                                    className="
                                        bg-gradient-to-r
                                        from-blue-500
                                        to-cyan-500
                                        text-white
                                        rounded-3xl
                                        p-8
                                        shadow-lg
                                        hover:scale-105
                                        transition
                                    "
                                >

                                    <FaCalculator
                                        className="
                                            text-4xl
                                            mb-5
                                        "
                                    />

                                    <h2 className="
                                        text-xl
                                        font-bold
                                    ">
                                        {
                                            item.subject
                                        }
                                    </h2>

                                </button>

                            )
                        )}

                    </div>

                )}


                {/* =================================================
                    CHAPTERS
                ================================================= */}

                {subject && !chapter && (

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
                                    subject.subject
                                }
                            </h2>

                            <button
                                onClick={() =>
                                    setSubject(null)
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
                            space-y-4
                            mt-8
                        ">

                            {(
                                subject.chapters ||
                                []
                            ).map(
                                (item) => (

                                    <button
                                        key={
                                            item._id
                                        }
                                        onClick={() =>
                                            setChapter(
                                                item
                                            )
                                        }
                                        className="
                                            w-full
                                            flex
                                            justify-between
                                            items-center
                                            border
                                            rounded-xl
                                            p-5
                                            hover:bg-gray-100
                                        "
                                    >

                                        <div>

                                            <h3 className="
                                                font-bold
                                            ">
                                                {
                                                    item.chapterName
                                                }
                                            </h3>

                                        </div>

                                        <FaChevronRight />

                                    </button>

                                )
                            )}

                        </div>

                    </div>

                )}


                {/* =================================================
                    TOPICS
                ================================================= */}

                {chapter && (

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

                            <div>

                                <h2 className="
                                    text-3xl
                                    font-bold
                                ">
                                    {
                                        chapter.chapterName
                                    }
                                </h2>

                                <p className="
                                    text-gray-500
                                    mt-2
                                ">
                                    Select a lecture
                                    to continue
                                </p>

                            </div>

                            <button
                                onClick={() =>
                                    setChapter(null)
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
                            mt-8
                        ">

                            {(
                                chapter.topics ||
                                []
                            ).map(
                                (topic) => (

                                    <button
                                        key={
                                            topic._id
                                        }
                                        onClick={() =>
                                            openTopic(
                                                topic
                                            )
                                        }
                                        className="
                                            border
                                            rounded-xl
                                            p-5
                                            text-left
                                            cursor-pointer
                                            hover:bg-blue-50
                                            transition
                                        "
                                    >

                                        <div className="
                                            flex
                                            justify-between
                                            items-start
                                        ">

                                            <div>

                                                <h3 className="
                                                    font-bold
                                                    text-lg
                                                ">
                                                    {
                                                        topic.topicName
                                                    }
                                                </h3>

                                                <p className="
                                                    text-sm
                                                    text-gray-500
                                                    mt-2
                                                ">
                                                    {
                                                        topic.isPaid
                                                            ? `Premium Video ₹${topic.price}`
                                                            : "Free Video"
                                                    }
                                                </p>

                                            </div>


                                            {topic.isPaid ? (

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


                                        {topic.isPaid && (

                                            <div className="
                                                mt-4
                                                inline-block
                                                bg-yellow-100
                                                text-yellow-700
                                                px-4
                                                py-2
                                                rounded-lg
                                                font-semibold
                                            ">
                                                Buy ₹
                                                {
                                                    topic.price
                                                }
                                            </div>

                                        )}

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

export default Intermediate;