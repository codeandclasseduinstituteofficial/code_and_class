import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthProvider";
import toast from "react-hot-toast";
import { FaVideo, FaTrash, FaUsers } from "react-icons/fa";

const API_BASE = import.meta.env.VITE_API_URL || "https://code-and-class.onrender.com/api";

const AdminMeetingLinks = () => {
    const { accessToken } = useContext(AuthContext);
    const authHeaders = { Authorization: `Bearer ${accessToken}` };

    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [onlineStudents, setOnlineStudents] = useState([]);
    const [selectedRecipients, setSelectedRecipients] = useState([]);
    const [studentsLoading, setStudentsLoading] = useState(false);

    const [meetings, setMeetings] = useState([]);
    const [meetingsLoading, setMeetingsLoading] = useState(true);

    const [form, setForm] = useState({ title: "", link: "", scheduledAt: "" });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetch(`${API_BASE}/courses`)
            .then((res) => res.json())
            .then((data) => setCourses(Array.isArray(data) ? data : data.data || []))
            .catch(() => setCourses([]));

        fetchMeetings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchMeetings = () => {
        setMeetingsLoading(true);
        fetch(`${API_BASE}/meeting-links`, { headers: authHeaders })
            .then((res) => res.json())
            .then((data) => setMeetings(data.data || []))
            .catch(() => setMeetings([]))
            .finally(() => setMeetingsLoading(false));
    };

    useEffect(() => {
        if (!selectedCourse) {
            setOnlineStudents([]);
            setSelectedRecipients([]);
            return;
        }

        setStudentsLoading(true);
        fetch(`${API_BASE}/meeting-links/online-students/${selectedCourse}`, {
            headers: authHeaders,
        })
            .then((res) => res.json())
            .then((data) => {
                const students = data.data || [];
                setOnlineStudents(students);
                setSelectedRecipients(students.map((s) => s._id)); // default: all selected
            })
            .catch(() => setOnlineStudents([]))
            .finally(() => setStudentsLoading(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCourse]);

    const toggleRecipient = (id) => {
        setSelectedRecipients((prev) =>
            prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
        );
    };

    const handleSend = async (e) => {
        e.preventDefault();

        if (!selectedCourse || !form.title || !form.link || !form.scheduledAt) {
            toast.error("Fill in the course, title, link and date/time.");
            return;
        }
        if (selectedRecipients.length === 0) {
            toast.error("Select at least one student to send this link to.");
            return;
        }

        setSaving(true);
        try {
            const res = await fetch(`${API_BASE}/meeting-links`, {
                method: "POST",
                headers: { "Content-Type": "application/json", ...authHeaders },
                body: JSON.stringify({
                    course: selectedCourse,
                    title: form.title,
                    link: form.link,
                    scheduledAt: form.scheduledAt,
                    recipients: selectedRecipients,
                }),
            });
            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "Could not send the meeting link.");
                return;
            }

            toast.success(`Sent to ${selectedRecipients.length} student(s).`);
            setForm({ title: "", link: "", scheduledAt: "" });
            fetchMeetings();
        } catch (err) {
            toast.error("Something went wrong.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this meeting link?")) return;
        try {
            await fetch(`${API_BASE}/meeting-links/${id}`, {
                method: "DELETE",
                headers: authHeaders,
            });
            fetchMeetings();
        } catch (err) {
            console.log("Delete failed:", err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-5 md:p-10 mt-10">
            <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">

                {/* SEND A NEW LINK */}
                <div className="bg-white rounded-2xl shadow p-6">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <FaVideo className="text-indigo-600" /> Send Meeting Link
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Only students who bought a course in <b>online</b> mode will show up here.
                    </p>

                    <form onSubmit={handleSend} className="mt-6 space-y-4">
                        <div>
                            <label className="block text-sm font-semibold mb-1">Course</label>
                            <select
                                value={selectedCourse}
                                onChange={(e) => setSelectedCourse(e.target.value)}
                                className="w-full border rounded-lg px-3 py-2"
                            >
                                <option value="">Select a course</option>
                                {courses.map((c) => (
                                    <option key={c._id} value={c._id}>{c.title}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-1">Class Title</label>
                            <input
                                type="text"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                className="w-full border rounded-lg px-3 py-2"
                                placeholder="Live Doubt Session - Week 3"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-1">Meeting Link</label>
                            <input
                                type="text"
                                value={form.link}
                                onChange={(e) => setForm({ ...form, link: e.target.value })}
                                className="w-full border rounded-lg px-3 py-2"
                                placeholder="https://meet.google.com/xxx-xxxx-xxx"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-1">Date & Time</label>
                            <input
                                type="datetime-local"
                                value={form.scheduledAt}
                                onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
                                className="w-full border rounded-lg px-3 py-2"
                            />
                        </div>

                        {selectedCourse && (
                            <div>
                                <label className="text-sm font-semibold mb-2 flex items-center gap-2">
                                    <FaUsers /> Send to
                                </label>

                                {studentsLoading ? (
                                    <p className="text-sm text-gray-500">Loading students...</p>
                                ) : onlineStudents.length === 0 ? (
                                    <p className="text-sm text-gray-500">
                                        No online-mode students enrolled in this course yet.
                                    </p>
                                ) : (
                                    <div className="border rounded-lg max-h-48 overflow-y-auto divide-y">
                                        {onlineStudents.map((s) => (
                                            <label
                                                key={s._id}
                                                className="flex items-center gap-3 px-3 py-2 text-sm cursor-pointer hover:bg-gray-50"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedRecipients.includes(s._id)}
                                                    onChange={() => toggleRecipient(s._id)}
                                                />
                                                <span>{s.name} <span className="text-gray-400">({s.email})</span></span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white font-bold py-3 rounded-xl"
                        >
                            {saving ? "Sending..." : "Send Meeting Link"}
                        </button>
                    </form>
                </div>

                {/* SENT LINKS */}
                <div className="bg-white rounded-2xl shadow p-6">
                    <h2 className="text-2xl font-bold">Sent Links</h2>

                    {meetingsLoading ? (
                        <p className="text-gray-500 mt-4">Loading...</p>
                    ) : meetings.length === 0 ? (
                        <p className="text-gray-500 mt-4">No meeting links sent yet.</p>
                    ) : (
                        <div className="mt-4 space-y-3 max-h-[600px] overflow-y-auto">
                            {meetings.map((m) => (
                                <div key={m._id} className="border rounded-xl p-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-bold">{m.title}</p>
                                            <p className="text-xs text-gray-500">{m.course?.title}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {new Date(m.scheduledAt).toLocaleString()}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                Sent to {m.recipients?.length || 0} student(s)
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(m._id)}
                                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default AdminMeetingLinks;
