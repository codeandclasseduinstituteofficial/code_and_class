import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthProvider";
import EditProblemModal from "./EditProblemModal";

import {
    FaBook,
    FaTrash,
    FaEdit,
    FaVideo,
    FaPlus,
    FaTimes
} from "react-icons/fa";
import toast from "react-hot-toast";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const emptySubjectForm = { subject: "", subjectIcon: "" };
const emptyChapterForm = { chapterNumber: "", chapterName: "" };
const emptyProblemForm = { name: "", videoLink: "", description: "", isPaid: false, price: "" };

const ManageClassTen = () => {

    const { accessToken } = useContext(AuthContext);
    const authHeaders = { Authorization: `Bearer ${accessToken}` };

    const [editProblem, setEditProblem] = useState(null);

    const [subjects, setSubjects] = useState([]);

    const [loading, setLoading] = useState(true);

    const [selectedSubjectId, setSelectedSubjectId] = useState(null);

    const selectedSubject = subjects.find((s) => s._id === selectedSubjectId) || null;

    const [showAddSubject, setShowAddSubject] = useState(false);
    const [subjectForm, setSubjectForm] = useState(emptySubjectForm);
    const [savingSubject, setSavingSubject] = useState(false);

    const [addingChapterFor, setAddingChapterFor] = useState(null); // subject id
    const [chapterForm, setChapterForm] = useState(emptyChapterForm);
    const [savingChapter, setSavingChapter] = useState(false);

    const [addingProblemFor, setAddingProblemFor] = useState(null); // { subjectId, chapterId }
    const [problemForm, setProblemForm] = useState(emptyProblemForm);
    const [savingProblem, setSavingProblem] = useState(false);


    const fetchSubjects = async () => {

        try {

            const response = await fetch(
                `${API_BASE}/classTenth`,
                {
                    headers: authHeaders
                }
            );

            const data = await response.json();

            setSubjects(data.data || []);

        }

        catch (error) {

            console.log(error);

        }

        finally {

            setLoading(false);

        }


    };




    useEffect(() => {

        fetchSubjects();

    }, []);


    const deleteSubject = async (subjectId) => {
        const confirmDelete = window.confirm("Delete this subject?");

        if (!confirmDelete) return;

        try {
            const response = await fetch(
                `${API_BASE}/classTenth/${subjectId}`,
                {
                    method: "DELETE",
                    headers: authHeaders,
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to delete subject");
            }

            toast.success("Subject deleted successfully");

            if (selectedSubjectId === subjectId) setSelectedSubjectId(null);

            fetchSubjects();
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Delete failed");
        }
    };

    const deleteProblem = async (chapterId, problemId) => {
        const confirmDelete = window.confirm("Delete this problem?");

        if (!confirmDelete) return;

        try {
            const response = await fetch(
                `${API_BASE}/classTenth/problem/${chapterId}/${problemId}`,
                {
                    method: "DELETE",
                    headers: authHeaders,
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Delete failed");
            }

            toast.success("Problem deleted successfully");

            fetchSubjects();

        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };


    const handleAddSubject = async (e) => {
        e.preventDefault();

        if (!subjectForm.subject.trim()) {
            toast.error("Subject name is required.");
            return;
        }

        setSavingSubject(true);
        try {
            const res = await fetch(`${API_BASE}/classTenth/add`, {
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
            fetchSubjects();
        } catch (error) {
            toast.error("Something went wrong.");
        } finally {
            setSavingSubject(false);
        }
    };


    const handleAddChapter = async (e) => {
        e.preventDefault();

        if (!chapterForm.chapterNumber.trim() || !chapterForm.chapterName.trim()) {
            toast.error("Chapter number and name are required.");
            return;
        }

        setSavingChapter(true);
        try {
            const res = await fetch(`${API_BASE}/classTenth/${addingChapterFor}/chapter`, {
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
            fetchSubjects();
        } catch (error) {
            toast.error("Something went wrong.");
        } finally {
            setSavingChapter(false);
        }
    };


    const handleAddProblem = async (e) => {
        e.preventDefault();

        if (!problemForm.name.trim() || !problemForm.videoLink.trim() || !problemForm.description.trim()) {
            toast.error("Name, video link and description are required.");
            return;
        }

        setSavingProblem(true);
        try {
            const { subjectId, chapterId } = addingProblemFor;
            const res = await fetch(
                `${API_BASE}/classTenth/${subjectId}/chapter/${chapterId}/problem`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json", ...authHeaders },
                    body: JSON.stringify(problemForm),
                }
            );
            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "Could not add problem.");
                return;
            }

            toast.success("Problem added.");
            setAddingProblemFor(null);
            setProblemForm(emptyProblemForm);
            fetchSubjects();
        } catch (error) {
            toast.error("Something went wrong.");
        } finally {
            setSavingProblem(false);
        }
    };


    if (loading)
        return (

            <div className="text-center py-20 text-xl">
                Loading...
            </div>

        );



    return (


        <div className="min-h-screen bg-gray-100 p-5 md:p-10 mt-10">


            <div className="max-w-7xl mx-auto">

                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-800">
                            Manage Class 10
                        </h1>

                        <p className="text-gray-500 mt-2">
                            Edit and manage your uploaded lectures.
                        </p>
                    </div>

                    <button
                        onClick={() => setShowAddSubject(true)}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg"
                    >
                        <FaPlus /> Add Subject
                    </button>
                </div>


                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">

                    {

                        subjects.map((subject) => (


                            <div

                                key={subject._id}

                                className="bg-white rounded-3xl shadow p-6 hover:shadow-xl transition"

                            >


                                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">

                                    <FaBook className="text-blue-600 text-2xl" />

                                </div>


                                <h2 className="text-xl font-bold mt-5">
                                    {subject.subject}
                                </h2>

                                <p className="text-gray-500 mt-2">
                                    {subject.chapters.length} Chapters
                                </p>


                                <div className="flex gap-3 mt-5">

                                    <button
                                        onClick={() => setSelectedSubjectId(subject._id)}
                                        className="flex-1 bg-blue-600 text-white py-2 rounded-xl"
                                    >
                                        Manage
                                    </button>

                                    <button
                                        onClick={() => setAddingChapterFor(subject._id)}
                                        className="bg-green-100 text-green-700 px-3 rounded-xl"
                                        title="Add Chapter"
                                    >
                                        <FaPlus />
                                    </button>

                                    <button
                                        onClick={() => deleteSubject(subject._id)}
                                        className="bg-red-100 text-red-600 px-4 rounded-xl"
                                    >
                                        <FaTrash />
                                    </button>

                                </div>

                            </div>


                        ))

                    }

                </div>


                {

                    selectedSubject &&

                    <div className="mt-12 bg-white rounded-3xl p-6 shadow">

                        <h2 className="text-3xl font-bold">
                            {selectedSubject.subject}
                        </h2>

                        <div className="space-y-5 mt-8">

                            {

                                (!selectedSubject.chapters || selectedSubject.chapters.length === 0) &&
                                <p className="text-gray-400">
                                    No chapters yet. Use the "+" button on the subject card to add one.
                                </p>

                            }

                            {

                                selectedSubject.chapters.map(
                                    (chapter) => (


                                        <div

                                            key={chapter._id}

                                            className="border rounded-2xl p-5"

                                        >

                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <h3 className="font-bold text-xl">
                                                        {chapter.chapterNumber}
                                                    </h3>

                                                    <p className="text-gray-500">
                                                        {chapter.chapterName}
                                                    </p>
                                                </div>

                                                <button
                                                    onClick={() => setAddingProblemFor({ subjectId: selectedSubject._id, chapterId: chapter._id })}
                                                    className="flex items-center gap-1 text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg font-semibold"
                                                >
                                                    <FaPlus /> Problem
                                                </button>
                                            </div>


                                            <div className="mt-5 space-y-3">

                                                {
                                                    chapter.problems.length === 0 &&
                                                    <p className="text-sm text-gray-400">
                                                        No problems yet.
                                                    </p>
                                                }

                                                {

                                                    chapter.problems.map(
                                                        (problem) => (


                                                            <div

                                                                key={problem._id}

                                                                className="bg-gray-50 rounded-xl p-4 flex justify-between items-center"

                                                            >


                                                                <div>

                                                                    <h4 className="font-semibold">
                                                                        {problem.name}
                                                                    </h4>

                                                                    <div className="flex items-center gap-2 text-blue-600 text-sm mt-2">
                                                                        <FaVideo />
                                                                        {
                                                                            problem.isPaid
                                                                                ? `Paid ₹${problem.price}`
                                                                                : "Free"
                                                                        }
                                                                    </div>

                                                                </div>


                                                                <div className="flex gap-2">

                                                                    <button

                                                                        onClick={() =>
                                                                            setEditProblem({
                                                                                ...problem,
                                                                                chapterId: chapter._id
                                                                            })
                                                                        }

                                                                        className="p-3 bg-yellow-100 rounded-xl"

                                                                    >

                                                                        <FaEdit />

                                                                    </button>

                                                                    <button
                                                                        onClick={() => deleteProblem(chapter._id, problem._id)}
                                                                        className="bg-red-100 text-red-600 px-4 rounded-xl"
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

                    </div>

                }


            </div>

            {

                editProblem &&

                <EditProblemModal

                    problem={editProblem}

                    onClose={() => setEditProblem(null)}

                    onSave={async (data) => {

                        try {

                            const response = await fetch(
                                `${API_BASE}/classTenth/problem/${editProblem.chapterId}/${editProblem._id}`,
                                {
                                    method: "PUT",
                                    headers: {
                                        "Content-Type": "application/json",
                                        ...authHeaders
                                    },
                                    body: JSON.stringify(data)
                                }
                            );

                            const result = await response.json();

                            if (!response.ok) {
                                throw new Error(result.message || "Failed to update problem");
                            }

                            toast.success("Problem updated successfully");

                            setEditProblem(null);

                            fetchSubjects();

                        } catch (error) {

                            console.error(error);

                            toast.error(error.message || "Failed to update problem");

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

                            <div>
                                <label className="block text-sm font-semibold mb-1">Subject Name</label>
                                <input
                                    type="text"
                                    value={subjectForm.subject}
                                    onChange={(e) => setSubjectForm({ ...subjectForm, subject: e.target.value })}
                                    className="w-full border rounded-lg px-3 py-2"
                                    placeholder="Mathematics"
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
                                    placeholder="Real Numbers"
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


            {/* ADD PROBLEM MODAL */}
            {
                addingProblemFor &&

                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 md:p-8 relative">

                        <button onClick={() => setAddingProblemFor(null)} className="absolute top-5 right-5 text-gray-400 hover:text-gray-700">
                            <FaTimes size={20} />
                        </button>

                        <h2 className="text-2xl font-bold">Add Problem</h2>

                        <form onSubmit={handleAddProblem} className="mt-6 space-y-4">

                            <div>
                                <label className="block text-sm font-semibold mb-1">Problem Name</label>
                                <input
                                    type="text"
                                    value={problemForm.name}
                                    onChange={(e) => setProblemForm({ ...problemForm, name: e.target.value })}
                                    className="w-full border rounded-lg px-3 py-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-1">Video Link (YouTube)</label>
                                <input
                                    type="text"
                                    value={problemForm.videoLink}
                                    onChange={(e) => setProblemForm({ ...problemForm, videoLink: e.target.value })}
                                    className="w-full border rounded-lg px-3 py-2"
                                    placeholder="https://youtube.com/watch?v=..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-1">Description</label>
                                <textarea
                                    value={problemForm.description}
                                    onChange={(e) => setProblemForm({ ...problemForm, description: e.target.value })}
                                    className="w-full border rounded-lg px-3 py-2 min-h-[100px]"
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={problemForm.isPaid}
                                    onChange={(e) => setProblemForm({ ...problemForm, isPaid: e.target.checked })}
                                />
                                <label className="text-sm font-semibold">Paid Problem</label>
                            </div>

                            {
                                problemForm.isPaid &&
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Price (₹)</label>
                                    <input
                                        type="number"
                                        value={problemForm.price}
                                        onChange={(e) => setProblemForm({ ...problemForm, price: e.target.value })}
                                        className="w-full border rounded-lg px-3 py-2"
                                    />
                                </div>
                            }

                            <button
                                type="submit"
                                disabled={savingProblem}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white font-bold py-3 rounded-xl"
                            >
                                {savingProblem ? "Saving..." : "Add Problem"}
                            </button>

                        </form>

                    </div>
                </div>
            }


        </div>


    );

};


export default ManageClassTen;
