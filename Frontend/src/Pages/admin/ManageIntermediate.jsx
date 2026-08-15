import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthProvider";
import EditTopicModal from "./EditTopicModal";
import toast from "react-hot-toast";

import {
    FaUniversity,
    FaTrash,
    FaEdit,
    FaChevronDown,
    FaChevronUp,
    FaPlus,
    FaTimes
} from "react-icons/fa";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const emptySubjectForm = {
    year: "First Year",
    group: "MPC",
    subject: "",
    subjectIcon: "",
};

const emptyChapterForm = {
    chapterNumber: "",
    chapterName: "",
};

const emptyTopicForm = {
    topicName: "",
    videoLink: "",
    description: "",
    isPaid: false,
    price: "",
};

const ManageIntermediate = () => {

    const { accessToken } = useContext(AuthContext);
    const authHeaders = { Authorization: `Bearer ${accessToken}` };

    const [editTopic, setEditTopic] = useState(null);

    const [courses, setCourses] = useState([]);

    const [loading, setLoading] = useState(true);

    const [selectedYear, setSelectedYear] = useState("");

    const [selectedGroup, setSelectedGroup] = useState("");

    const [expanded, setExpanded] = useState(null);

    const [showAddSubject, setShowAddSubject] = useState(false);
    const [subjectForm, setSubjectForm] = useState(emptySubjectForm);
    const [savingSubject, setSavingSubject] = useState(false);

    const [addingChapterFor, setAddingChapterFor] = useState(null); // subject id
    const [chapterForm, setChapterForm] = useState(emptyChapterForm);
    const [savingChapter, setSavingChapter] = useState(false);

    const [addingTopicFor, setAddingTopicFor] = useState(null); // { subjectId, chapterId }
    const [topicForm, setTopicForm] = useState(emptyTopicForm);
    const [savingTopic, setSavingTopic] = useState(false);


    const fetchCourses = async () => {

        try {

            const response = await fetch(
                `${API_BASE}/intermediate`,
                {
                    headers: authHeaders
                }
            );

            const data = await response.json();

            setCourses(data.data || []);

        }
        catch (error) {

            console.log(error);

        }
        finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchCourses();

    }, []);


    const deleteCourse = async (id) => {

        const confirmDelete = window.confirm("Delete this subject?");

        if (!confirmDelete)
            return;

        await fetch(
            `${API_BASE}/intermediate/${id}`,
            {
                method: "DELETE",
                headers: authHeaders
            }
        );

        toast.success("Subject deleted");

        fetchCourses();

    };


    const handleAddSubject = async (e) => {
        e.preventDefault();

        if (!subjectForm.subject.trim()) {
            toast.error("Subject name is required.");
            return;
        }

        setSavingSubject(true);
        try {
            const res = await fetch(`${API_BASE}/intermediate/add`, {
                method: "POST",
                headers: { "Content-Type": "application/json", ...authHeaders },
                body: JSON.stringify({ ...subjectForm, chapters: [] }),
            });
            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "Could not add subject.");
                return;
            }

            toast.success("Subject added.");
            setShowAddSubject(false);
            setSubjectForm(emptySubjectForm);
            fetchCourses();
        } catch (error) {
            toast.error("Something went wrong.");
        } finally {
            setSavingSubject(false);
        }
    };


    const handleAddChapter = async (e) => {
        e.preventDefault();

        if (!chapterForm.chapterName.trim()) {
            toast.error("Chapter name is required.");
            return;
        }

        setSavingChapter(true);
        try {
            const res = await fetch(`${API_BASE}/intermediate/${addingChapterFor}/chapter`, {
                method: "POST",
                headers: { "Content-Type": "application/json", ...authHeaders },
                body: JSON.stringify(chapterForm),
            });
            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "Could not add chapter.");
                return;
            }

            toast.success("Chapter added.");
            setAddingChapterFor(null);
            setChapterForm(emptyChapterForm);
            fetchCourses();
        } catch (error) {
            toast.error("Something went wrong.");
        } finally {
            setSavingChapter(false);
        }
    };


    const handleAddTopic = async (e) => {
        e.preventDefault();

        if (!topicForm.topicName.trim() || !topicForm.videoLink.trim() || !topicForm.description.trim()) {
            toast.error("Topic name, video link and description are required.");
            return;
        }

        setSavingTopic(true);
        try {
            const { subjectId, chapterId } = addingTopicFor;
            const res = await fetch(
                `${API_BASE}/intermediate/${subjectId}/chapter/${chapterId}/topic`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json", ...authHeaders },
                    body: JSON.stringify(topicForm),
                }
            );
            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "Could not add topic.");
                return;
            }

            toast.success("Topic added.");
            setAddingTopicFor(null);
            setTopicForm(emptyTopicForm);
            fetchCourses();
        } catch (error) {
            toast.error("Something went wrong.");
        } finally {
            setSavingTopic(false);
        }
    };


    const filteredCourses =
        courses.filter(item => {

            if (selectedYear &&
                item.year !== selectedYear)

                return false;

            if (selectedGroup &&
                item.group !== selectedGroup)

                return false;

            return true;

        });


    if (loading)

        return (

            <div className="text-center py-20 text-xl">
                Loading...
            </div>

        );


    return (

        <div className="min-h-screen bg-gray-100 p-5 md:p-10">


            <div className="max-w-7xl mx-auto">

                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                        <h1 className="text-4xl font-bold">
                            Manage Intermediate
                        </h1>

                        <p className="text-gray-500 mt-2">
                            Manage First Year and Second Year content.
                        </p>
                    </div>

                    <button
                        onClick={() => setShowAddSubject(true)}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg"
                    >
                        <FaPlus /> Add Subject
                    </button>
                </div>


                {/* FILTERS */}

                <div className="grid md:grid-cols-2 gap-5 mt-8">

                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="p-4 rounded-xl border"
                    >
                        <option value="">All Years</option>
                        <option>First Year</option>
                        <option>Second Year</option>
                    </select>


                    <select
                        value={selectedGroup}
                        onChange={(e) => setSelectedGroup(e.target.value)}
                        className="p-4 rounded-xl border"
                    >
                        <option value="">All Groups</option>
                        <option>MPC</option>
                        <option>BiPC</option>
                        <option>MEC</option>
                        <option>CEC</option>
                    </select>

                </div>


                <div className="grid lg:grid-cols-2 gap-6 mt-10">

                    {

                        filteredCourses.map(course => (

                            <div
                                key={course._id}
                                className="bg-white rounded-3xl shadow p-6"
                            >

                                <div className="flex items-center gap-4">

                                    <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center">
                                        <FaUniversity className="text-indigo-600 text-2xl" />
                                    </div>

                                    <div>
                                        <h2 className="font-bold text-xl">
                                            {course.subject}
                                        </h2>

                                        <p className="text-gray-500">
                                            {course.year} • {course.group}
                                        </p>
                                    </div>

                                </div>


                                <div className="flex gap-3 mt-6">

                                    <button
                                        onClick={() => setExpanded(
                                            expanded === course._id ? null : course._id
                                        )}
                                        className="flex-1 bg-indigo-600 text-white py-2 rounded-xl flex items-center justify-center gap-2"
                                    >
                                        Manage
                                        {
                                            expanded === course._id
                                                ? <FaChevronUp />
                                                : <FaChevronDown />
                                        }
                                    </button>

                                    <button
                                        onClick={() => setAddingChapterFor(course._id)}
                                        className="bg-green-100 text-green-700 px-4 rounded-xl flex items-center gap-2 text-sm font-semibold"
                                    >
                                        <FaPlus /> Chapter
                                    </button>

                                    <button
                                        onClick={() => deleteCourse(course._id)}
                                        className="bg-red-100 text-red-600 px-5 rounded-xl"
                                    >
                                        <FaTrash />
                                    </button>

                                </div>


                                {
                                    expanded === course._id &&

                                    <div className="mt-6 space-y-4">

                                        {
                                            (!course.chapters || course.chapters.length === 0) &&
                                            <p className="text-sm text-gray-400">
                                                No chapters yet. Click "Chapter" above to add one.
                                            </p>
                                        }

                                        {
                                            course.chapters.map((chapter) => (

                                                <div
                                                    key={chapter._id}
                                                    className="border rounded-xl p-4"
                                                >

                                                    <div className="flex justify-between items-center">
                                                        <h3 className="font-bold">
                                                            {chapter.chapterName}
                                                        </h3>

                                                        <button
                                                            onClick={() => setAddingTopicFor({ subjectId: course._id, chapterId: chapter._id })}
                                                            className="flex items-center gap-1 text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg font-semibold"
                                                        >
                                                            <FaPlus /> Topic
                                                        </button>
                                                    </div>

                                                    <div className="mt-3 space-y-2">

                                                        {
                                                            chapter.topics.length === 0 &&
                                                            <p className="text-xs text-gray-400">
                                                                No topics yet.
                                                            </p>
                                                        }

                                                        {
                                                            chapter.topics.map((topic) => (

                                                                <div
                                                                    key={topic._id}
                                                                    className="bg-gray-50 p-4 rounded-xl flex justify-between items-center"
                                                                >

                                                                    <div>
                                                                        <h3 className="font-semibold">
                                                                            {topic.topicName}
                                                                        </h3>

                                                                        <p className="text-sm text-gray-500">
                                                                            {
                                                                                topic.isPaid
                                                                                    ? `Paid ₹${topic.price}`
                                                                                    : "Free"
                                                                            }
                                                                        </p>
                                                                    </div>

                                                                    <div className="flex gap-2">

                                                                        <button
                                                                            onClick={() => setEditTopic({ ...topic, chapterId: chapter._id, subjectId: course._id })}
                                                                            className="bg-yellow-100 p-3 rounded-xl"
                                                                        >
                                                                            <FaEdit />
                                                                        </button>

                                                                        <button
                                                                            onClick={async () => {

                                                                                await fetch(
                                                                                    `${API_BASE}/intermediate/topic/${chapter._id}/${topic._id}`,
                                                                                    {
                                                                                        method: "DELETE",
                                                                                        headers: authHeaders
                                                                                    }
                                                                                );

                                                                                toast.success("Topic deleted");

                                                                                fetchCourses();

                                                                            }}
                                                                            className="bg-red-100 text-red-600 p-3 rounded-xl"
                                                                        >
                                                                            <FaTrash />
                                                                        </button>

                                                                    </div>

                                                                </div>

                                                            ))
                                                        }

                                                    </div>

                                                </div>

                                            ))
                                        }

                                    </div>

                                }

                            </div>

                        ))

                    }

                </div>

            </div>


            {/* EDIT TOPIC MODAL */}
            {
                editTopic &&

                <EditTopicModal

                    topic={editTopic}

                    onClose={() => setEditTopic(null)}

                    onSave={async (data) => {

                        try {
                            const res = await fetch(
                                `${API_BASE}/intermediate/topic/${editTopic.chapterId}/${editTopic._id}`,
                                {
                                    method: "PUT",
                                    headers: {
                                        "Content-Type": "application/json",
                                        ...authHeaders
                                    },
                                    body: JSON.stringify(data)
                                }
                            );

                            if (!res.ok) {
                                const result = await res.json();
                                toast.error(result.message || "Could not update topic.");
                                return;
                            }

                            toast.success("Topic updated");
                            setEditTopic(null);
                            fetchCourses();
                        } catch (error) {
                            toast.error("Something went wrong.");
                        }

                    }}

                />
            }


            {/* ADD SUBJECT MODAL */}
            {
                showAddSubject &&

                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg p-6 md:p-8 relative">

                        <button onClick={() => setShowAddSubject(false)} className="absolute top-5 right-5 text-gray-400 hover:text-gray-700">
                            <FaTimes size={20} />
                        </button>

                        <h2 className="text-2xl font-bold">Add Subject</h2>

                        <form onSubmit={handleAddSubject} className="mt-6 space-y-4">

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Year</label>
                                    <select
                                        value={subjectForm.year}
                                        onChange={(e) => setSubjectForm({ ...subjectForm, year: e.target.value })}
                                        className="w-full border rounded-lg px-3 py-2"
                                    >
                                        <option>First Year</option>
                                        <option>Second Year</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-1">Group</label>
                                    <select
                                        value={subjectForm.group}
                                        onChange={(e) => setSubjectForm({ ...subjectForm, group: e.target.value })}
                                        className="w-full border rounded-lg px-3 py-2"
                                    >
                                        <option>MPC</option>
                                        <option>BiPC</option>
                                        <option>MEC</option>
                                        <option>CEC</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-1">Subject Name</label>
                                <input
                                    type="text"
                                    value={subjectForm.subject}
                                    onChange={(e) => setSubjectForm({ ...subjectForm, subject: e.target.value })}
                                    className="w-full border rounded-lg px-3 py-2"
                                    placeholder="Mathematics 1A"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={savingSubject}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white font-bold py-3 rounded-xl"
                            >
                                {savingSubject ? "Saving..." : "Add Subject"}
                            </button>

                        </form>

                    </div>
                </div>
            }


            {/* ADD CHAPTER MODAL */}
            {
                addingChapterFor &&

                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg p-6 md:p-8 relative">

                        <button onClick={() => setAddingChapterFor(null)} className="absolute top-5 right-5 text-gray-400 hover:text-gray-700">
                            <FaTimes size={20} />
                        </button>

                        <h2 className="text-2xl font-bold">Add Chapter</h2>

                        <form onSubmit={handleAddChapter} className="mt-6 space-y-4">

                            <div>
                                <label className="block text-sm font-semibold mb-1">Chapter Number</label>
                                <input
                                    type="text"
                                    value={chapterForm.chapterNumber}
                                    onChange={(e) => setChapterForm({ ...chapterForm, chapterNumber: e.target.value })}
                                    className="w-full border rounded-lg px-3 py-2"
                                    placeholder="1"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-1">Chapter Name</label>
                                <input
                                    type="text"
                                    value={chapterForm.chapterName}
                                    onChange={(e) => setChapterForm({ ...chapterForm, chapterName: e.target.value })}
                                    className="w-full border rounded-lg px-3 py-2"
                                    placeholder="Functions"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={savingChapter}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white font-bold py-3 rounded-xl"
                            >
                                {savingChapter ? "Saving..." : "Add Chapter"}
                            </button>

                        </form>

                    </div>
                </div>
            }


            {/* ADD TOPIC MODAL */}
            {
                addingTopicFor &&

                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 md:p-8 relative">

                        <button onClick={() => setAddingTopicFor(null)} className="absolute top-5 right-5 text-gray-400 hover:text-gray-700">
                            <FaTimes size={20} />
                        </button>

                        <h2 className="text-2xl font-bold">Add Topic</h2>

                        <form onSubmit={handleAddTopic} className="mt-6 space-y-4">

                            <div>
                                <label className="block text-sm font-semibold mb-1">Topic Name</label>
                                <input
                                    type="text"
                                    value={topicForm.topicName}
                                    onChange={(e) => setTopicForm({ ...topicForm, topicName: e.target.value })}
                                    className="w-full border rounded-lg px-3 py-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-1">Video Link (YouTube)</label>
                                <input
                                    type="text"
                                    value={topicForm.videoLink}
                                    onChange={(e) => setTopicForm({ ...topicForm, videoLink: e.target.value })}
                                    className="w-full border rounded-lg px-3 py-2"
                                    placeholder="https://youtube.com/watch?v=..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-1">Description</label>
                                <textarea
                                    value={topicForm.description}
                                    onChange={(e) => setTopicForm({ ...topicForm, description: e.target.value })}
                                    className="w-full border rounded-lg px-3 py-2 min-h-[100px]"
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={topicForm.isPaid}
                                    onChange={(e) => setTopicForm({ ...topicForm, isPaid: e.target.checked })}
                                />
                                <label className="text-sm font-semibold">Paid Topic</label>
                            </div>

                            {
                                topicForm.isPaid &&
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Price (₹)</label>
                                    <input
                                        type="number"
                                        value={topicForm.price}
                                        onChange={(e) => setTopicForm({ ...topicForm, price: e.target.value })}
                                        className="w-full border rounded-lg px-3 py-2"
                                    />
                                </div>
                            }

                            <button
                                type="submit"
                                disabled={savingTopic}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white font-bold py-3 rounded-xl"
                            >
                                {savingTopic ? "Saving..." : "Add Topic"}
                            </button>

                        </form>

                    </div>
                </div>
            }


        </div>

    );


};


export default ManageIntermediate;
