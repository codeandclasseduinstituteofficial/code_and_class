import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthProvider";
import toast from "react-hot-toast";
import { FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const emptyForm = {
    title: "",
    description: "",
    examDate: "",
    applyLastDate: "",
    imageUrl: "",
    videoUrl: "",
    applyLink: "",
};

const AdminExams = () => {
    const { accessToken } = useContext(AuthContext);
    const authHeaders = { Authorization: `Bearer ${accessToken}` };

    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);

    const fetchExams = () => {
        setLoading(true);
        fetch(`${API_BASE}/exams`)
            .then((res) => res.json())
            .then((data) => setExams(data.data || []))
            .catch(() => setExams([]))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchExams();
    }, []);

    const openAdd = () => {
        setForm(emptyForm);
        setEditingId(null);
        setShowForm(true);
    };

    const openEdit = (exam) => {
        setForm({
            title: exam.title || "",
            description: exam.description || "",
            examDate: exam.examDate ? exam.examDate.slice(0, 10) : "",
            applyLastDate: exam.applyLastDate ? exam.applyLastDate.slice(0, 10) : "",
            imageUrl: exam.imageUrl || "",
            videoUrl: exam.videoUrl || "",
            applyLink: exam.applyLink || "",
        });
        setEditingId(exam._id);
        setShowForm(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();

        if (!form.title.trim() || !form.description.trim()) {
            toast.error("Title and description are required.");
            return;
        }

        setSaving(true);
        try {
            const url = editingId ? `${API_BASE}/exams/${editingId}` : `${API_BASE}/exams`;
            const res = await fetch(url, {
                method: editingId ? "PUT" : "POST",
                headers: { "Content-Type": "application/json", ...authHeaders },
                body: JSON.stringify(form),
            });
            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "Something went wrong.");
                return;
            }

            toast.success(editingId ? "Exam updated." : "Exam posted.");
            setShowForm(false);
            fetchExams();
        } catch (err) {
            toast.error("Something went wrong.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this exam notice?")) return;
        try {
            await fetch(`${API_BASE}/exams/${id}`, { method: "DELETE", headers: authHeaders });
            fetchExams();
        } catch (err) {
            console.log("Delete failed:", err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-5 md:p-10 mt-10">
            <div className="max-w-5xl mx-auto">

                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                        <h1 className="text-3xl font-bold">Manage Exams</h1>
                        <p className="text-gray-500 mt-1">Post, edit, or remove exam notices.</p>
                    </div>
                    <button
                        onClick={openAdd}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg"
                    >
                        <FaPlus /> Post Exam
                    </button>
                </div>

                {loading ? (
                    <p className="text-gray-500 mt-8">Loading...</p>
                ) : exams.length === 0 ? (
                    <p className="text-gray-500 mt-8">No exam notices yet.</p>
                ) : (
                    <div className="grid md:grid-cols-2 gap-4 mt-8">
                        {exams.map((exam) => (
                            <div key={exam._id} className="bg-white rounded-2xl shadow p-5">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-lg">{exam.title}</h3>
                                        {exam.examDate && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                Exam: {new Date(exam.examDate).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex gap-2 shrink-0">
                                        <button onClick={() => openEdit(exam)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                                            <FaEdit />
                                        </button>
                                        <button onClick={() => handleDelete(exam._id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100">
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 mt-3 line-clamp-3 whitespace-pre-line">
                                    {exam.description}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {showForm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 relative">
                            <button onClick={() => setShowForm(false)} className="absolute top-5 right-5 text-gray-400 hover:text-gray-700">
                                <FaTimes size={20} />
                            </button>

                            <h2 className="text-2xl font-bold">{editingId ? "Edit" : "Post"} Exam</h2>

                            <form onSubmit={handleSave} className="mt-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Title</label>
                                    <input
                                        type="text"
                                        value={form.title}
                                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                                        className="w-full border rounded-lg px-3 py-2"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-1">Description / Details</label>
                                    <textarea
                                        value={form.description}
                                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                                        className="w-full border rounded-lg px-3 py-2 min-h-[140px]"
                                        placeholder="Eligibility, syllabus, pattern, important instructions..."
                                    />
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold mb-1">Exam Date</label>
                                        <input
                                            type="date"
                                            value={form.examDate}
                                            onChange={(e) => setForm({ ...form, examDate: e.target.value })}
                                            className="w-full border rounded-lg px-3 py-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-1">Apply Last Date</label>
                                        <input
                                            type="date"
                                            value={form.applyLastDate}
                                            onChange={(e) => setForm({ ...form, applyLastDate: e.target.value })}
                                            className="w-full border rounded-lg px-3 py-2"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-1">Image Link (Google Drive)</label>
                                    <input
                                        type="text"
                                        value={form.imageUrl}
                                        onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                                        className="w-full border rounded-lg px-3 py-2"
                                        placeholder="https://drive.google.com/..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-1">Video Link (YouTube, optional)</label>
                                    <input
                                        type="text"
                                        value={form.videoUrl}
                                        onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                                        className="w-full border rounded-lg px-3 py-2"
                                        placeholder="https://youtube.com/watch?v=..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-1">Apply Link (optional)</label>
                                    <input
                                        type="text"
                                        value={form.applyLink}
                                        onChange={(e) => setForm({ ...form, applyLink: e.target.value })}
                                        className="w-full border rounded-lg px-3 py-2"
                                        placeholder="https://..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white font-bold py-3 rounded-xl"
                                >
                                    {saving ? "Saving..." : editingId ? "Save Changes" : "Post Exam"}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default AdminExams;
