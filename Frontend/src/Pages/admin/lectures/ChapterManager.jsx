import React, { useState } from "react";
import {
    FaPlus,
    FaTrash,
    FaEdit,
    FaChevronDown,
    FaChevronUp,
    FaBook
} from "react-icons/fa";

const ChapterManager = ({ lectureData, setLectureData }) => {

    const [problemName, setProblemName] = useState("");
    const [videoLink, setVideoLink] = useState("");
    const [description, setDescription] = useState("");
    const [isPaid, setIsPaid] = useState(false);
    const [price, setPrice] = useState("");

    const [editingProblem, setEditingProblem] = useState({
        chapterIndex: null,
        problemIndex: null
    });

    const [chapterNumber, setchapterNumber] = useState("");
    const [chapterName, setChapterName] = useState("");

    const [editingIndex, setEditingIndex] = useState(null);

    const [expandedIndex, setExpandedIndex] = useState(null);

    const addProblem = (chapterIndex) => {

        if (!problemName || !videoLink || !description) {
            toast.error("Please fill all fields.");
            return;
        }

        if (isPaid && (!price || Number(price) <= 0)) {
            toast.error("Please enter a valid price.");
            return;
        }

        const updated = [...lectureData.chapters];

        updated[chapterIndex].problems.push({

            name: problemName,

            videoLink,

            description,

            isPaid,

            price: isPaid ? Number(price) : 0

        });

        setLectureData({

            ...lectureData,

            chapters: updated

        });

        clearProblemForm();

    };

    const updateProblem = () => {

        const updated = [...lectureData.chapters];

        updated[editingProblem.chapterIndex].problems[
            editingProblem.problemIndex
        ] = {

            name: problemName,

            videoLink,

            description,

            isPaid,

            price: isPaid ? Number(price) : 0

        };

        setLectureData({

            ...lectureData,

            chapters: updated

        });

        clearProblemForm();

    };

    const deleteProblem = (chapterIndex, problemIndex) => {

        const updated = [...lectureData.chapters];

        updated[chapterIndex].problems.splice(problemIndex, 1);

        setLectureData({

            ...lectureData,

            chapters: updated

        });

    };

    const editProblem = (chapterIndex, problemIndex) => {

        const problem =
            lectureData.chapters[chapterIndex].problems[problemIndex];

        setProblemName(problem.name);

        setVideoLink(problem.videoLink);

        setDescription(problem.description);

        setIsPaid(problem.isPaid);

        setPrice(problem.price);

        setEditingProblem({

            chapterIndex,

            problemIndex

        });

    };

    const clearProblemForm = () => {

        setProblemName("");

        setVideoLink("");

        setDescription("");

        setIsPaid(false);

        setPrice("");

        setEditingProblem({

            chapterIndex: null,

            problemIndex: null

        });

    };

    const addChapter = () => {

        if (!chapterNumber || !chapterName) {

            toast.error("Please enter chapter details.");

            return;

        }

        const newChapter = {

            chapterNumber,

            chapterName,

            problems: []

        };

        setLectureData({

            ...lectureData,

            chapters: [...lectureData.chapters, newChapter]

        });

        setchapterNumber("");
        setChapterName("");

    };

    const deleteChapter = (index) => {

        const updated = lectureData.chapters.filter(
            (_, i) => i !== index
        );

        setLectureData({

            ...lectureData,

            chapters: updated

        });

    };

    const editChapter = (index) => {

        setEditingIndex(index);

        setchapterNumber(
            lectureData.chapters[index].chapterNumber
        );

        setChapterName(
            lectureData.chapters[index].chapterName
        );

    };

    const updateChapter = () => {

        const updated = [...lectureData.chapters];

        updated[editingIndex] = {

            ...updated[editingIndex],

            chapterNumber,

            chapterName

        };

        setLectureData({

            ...lectureData,

            chapters: updated

        });

        setEditingIndex(null);

        setchapterNumber("");

        setChapterName("");

    };

    return (

        <div>

            <h2 className="text-3xl font-bold">

                Chapter Manager

            </h2>

            <p className="text-slate-500 mt-2">

                Create chapters for this subject.

            </p>

            {/* Add Chapter */}

            <div className="bg-slate-50 rounded-2xl p-6 mt-8 border">

                <div className="grid md:grid-cols-2 gap-5">

                    <div>

                        <label className="font-semibold">

                            Chapter Number

                        </label>

                        <input

                            value={chapterNumber}

                            onChange={(e) => setchapterNumber(e.target.value)}

                            placeholder="Chapter 1"

                            className="w-full mt-2 p-3 border rounded-xl"

                        />

                    </div>

                    <div>

                        <label className="font-semibold">

                            Chapter Name

                        </label>

                        <input

                            value={chapterName}

                            onChange={(e) => setChapterName(e.target.value)}

                            placeholder="Real Numbers"

                            className="w-full mt-2 p-3 border rounded-xl"

                        />

                    </div>

                </div>

                <button

                    onClick={editingIndex === null ? addChapter : updateChapter}

                    className="mt-6 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"

                >

                    <FaPlus />

                    {

                        editingIndex === null

                            ?

                            "Add Chapter"

                            :

                            "Update Chapter"

                    }

                </button>

            </div>

            {/* Chapter List */}

            <div className="mt-10 space-y-5">

                {

                    lectureData.chapters.map((chapter, index) => (

                        <div

                            key={index}

                            className="bg-white rounded-2xl shadow border overflow-hidden"

                        >

                            <div

                                className="flex justify-between items-center p-6"

                            >

                                <div className="flex items-center gap-4">

                                    <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">

                                        <FaBook className="text-blue-600" />

                                    </div>

                                    <div>

                                        <h3 className="text-xl font-bold">

                                            {chapter.chapterNumber}

                                        </h3>

                                        <p className="text-slate-500">

                                            {chapter.chapterName}

                                        </p>

                                    </div>

                                </div>

                                <div className="flex items-center gap-3">

                                    <button

                                        onClick={() => editChapter(index)}

                                        className="p-3 rounded-xl bg-yellow-100 hover:bg-yellow-200"

                                    >

                                        <FaEdit />

                                    </button>

                                    <button

                                        onClick={() => deleteChapter(index)}

                                        className="p-3 rounded-xl bg-red-100 hover:bg-red-200"

                                    >

                                        <FaTrash />

                                    </button>

                                    <button

                                        onClick={() => {

                                            if (expandedIndex === index) {

                                                setExpandedIndex(null);

                                            }

                                            else {

                                                setExpandedIndex(index);

                                            }

                                        }}

                                        className="p-3 rounded-xl bg-slate-100"

                                    >

                                        {

                                            expandedIndex === index

                                                ?

                                                <FaChevronUp />

                                                :

                                                <FaChevronDown />

                                        }

                                    </button>

                                </div>

                            </div>

                            {

                                expandedIndex === index

                                &&

                                <div className="space-y-6">

                                    <div className="grid md:grid-cols-2 gap-4">

                                        <input
                                            value={problemName}
                                            onChange={(e) => setProblemName(e.target.value)}
                                            placeholder="Problem Name"
                                            className="border rounded-xl p-3"
                                        />

                                        <input
                                            value={videoLink}
                                            onChange={(e) => setVideoLink(e.target.value)}
                                            placeholder="YouTube Link"
                                            className="border rounded-xl p-3"
                                        />

                                    </div>

                                    <textarea

                                        value={description}

                                        onChange={(e) => setDescription(e.target.value)}

                                        rows={4}

                                        placeholder="Description"

                                        className="w-full border rounded-xl p-3"

                                    />

                                    <div className="flex items-center gap-3">

                                        <input

                                            type="checkbox"

                                            checked={isPaid}

                                            onChange={(e) => setIsPaid(e.target.checked)}

                                        />

                                        Paid Content

                                    </div>

                                    {

                                        isPaid &&

                                        <input

                                            value={price}

                                            onChange={(e) => setPrice(e.target.value)}

                                            placeholder="Price"

                                            type="number"

                                            className="border rounded-xl p-3"

                                        />

                                    }

                                    <button

                                        onClick={() =>

                                            editingProblem.problemIndex === null

                                                ?

                                                addProblem(index)

                                                :

                                                updateProblem()

                                        }

                                        className="bg-blue-600 text-white px-6 py-3 rounded-xl"

                                    >

                                        {

                                            editingProblem.problemIndex === null

                                                ?

                                                "Add Problem"

                                                :

                                                "Update Problem"

                                        }

                                    </button>

                                </div>

                            }

                        </div>

                    ))

                }

            </div>

            <div className="mt-8 space-y-6">

                {
                    lectureData.chapters.map((chapter, chapterIndex) => (

                        <div key={chapterIndex}>

                            {
                                chapter.problems.map((problem, pIndex) => (

                                    <div
                                        key={pIndex}
                                        className="bg-white rounded-xl border p-5"
                                    >

                                        <div className="flex justify-between">

                                            <div>

                                                <h4 className="font-bold">
                                                    {problem.name}
                                                </h4>

                                                <p className="text-sm text-slate-500 mt-1">
                                                    {problem.description}
                                                </p>

                                                <a
                                                    href={problem.videoLink}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-blue-600 text-sm"
                                                >
                                                    View Video
                                                </a>

                                                <div className="mt-2">

                                                    {
                                                        problem.isPaid ?

                                                            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs">
                                                                ₹ {problem.price}
                                                            </span>

                                                            :

                                                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                                                                Free
                                                            </span>
                                                    }

                                                </div>

                                            </div>

                                            <div className="flex gap-3">

                                                <button
                                                    onClick={() => editProblem(chapterIndex, pIndex)}
                                                    className="bg-yellow-100 p-3 rounded-xl"
                                                >
                                                    ✏
                                                </button>

                                                <button
                                                    onClick={() => deleteProblem(chapterIndex, pIndex)}
                                                    className="bg-red-100 p-3 rounded-xl"
                                                >
                                                    🗑
                                                </button>

                                            </div>

                                        </div>

                                    </div>

                                ))
                            }

                        </div>

                    ))
                }

            </div>

        </div>

    );

};

export default ChapterManager;