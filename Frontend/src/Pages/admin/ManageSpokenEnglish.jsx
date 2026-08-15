import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthProvider";
import {
    FaHeadphones,
    FaBookOpen,
    FaPenFancy,
    FaMicrophone,
    FaPlus,
    FaEdit,
    FaTrash,
    FaTimes,
} from "react-icons/fa";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const SKILLS = [
    { key: "Listening", icon: FaHeadphones },
    { key: "Reading", icon: FaBookOpen },
    { key: "Writing", icon: FaPenFancy },
    { key: "Speaking", icon: FaMicrophone },
];

const emptyForm = {
    levelName: "",
    title: "",
    description: "",
    audioUrl: "",
    videoUrl: "",
    imageUrl: "",
    writingPrompt: "",
    order: 0,
};

const ManageSpokenEnglish = () => {
    const { accessToken } = useContext(AuthContext);

    const [skill, setSkill] = useState("Listening");
    const [levels, setLevels] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const fetchLevels = () => {
        setLoading(true);
        fetch(`${API_BASE}/spoken-english/skill/${skill}`)
            .then((res) => res.json())
            .then((data) => setLevels(data.data || []))
            .catch(() => setLevels([]))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchLevels();
        setShowForm(false);
        setEditingId(null);
        setForm(emptyForm);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [skill]);

    const openAddForm = () => {
        setForm(emptyForm);
        setEditingId(null);
        setShowForm(true);
        setError("");
    };

    const openEditForm = (level) => {
        setForm({
            levelName: level.levelName || "",
            title: level.title || "",
            description: level.description || "",
            audioUrl: level.audioUrl || "",
            videoUrl: level.videoUrl || "",
            imageUrl: level.imageUrl || "",
            writingPrompt: level.writingPrompt || "",
            order: level.order || 0,
        });
        setEditingId(level._id);
        setShowForm(true);
        setError("");
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setError("");

        if (!form.levelName.trim() || !form.title.trim()) {
            setError("Level name and title are required.");
            return;
        }

        setSaving(true);
        try {
            const url = editingId
                ? `${API_BASE}/spoken-english/${editingId}`
                : `${API_BASE}/spoken-english`;

            const res = await fetch(url, {
                method: editingId ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ ...form, skill }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Something went wrong.");
                setSaving(false);
                return;
            }

            setShowForm(false);
            setEditingId(null);
            setForm(emptyForm);
            fetchLevels();
        } catch (err) {
            setError("Something went wrong saving this level.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this level? This cannot be undone.")) return;

        try {
            await fetch(`${API_BASE}/spoken-english/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            fetchLevels();
        } catch (err) {
            console.log("Delete failed:", err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-5 md:p-10 mt-10">
            <div className="max-w-6xl mx-auto">

                <h1 className="text-3xl font-bold">Manage Spoken English</h1>
                <p className="text-gray-500 mt-2">
                    Choose a skill, then add or edit the levels students see.
                </p>

                {/* SKILL TABS */}
                <div className="flex flex-wrap gap-3 mt-6">
                    {SKILLS.map((s) => {
                        const Icon = s.icon;
                        const active = skill === s.key;
                        return (
                            <button
                                key={s.key}
                                onClick={() => setSkill(s.key)}
                                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition ${
                                    active
                                        ? "bg-indigo-600 text-white shadow"
                                        : "bg-white text-gray-600 hover:bg-indigo-50"
                                }`}
                            >
                                <Icon /> {s.key}
                            </button>
                        );
                    })}
                </div>

                <div className="flex items-center justify-between mt-8">
                    <h2 className="text-2xl font-bold">{skill} Levels</h2>

                    <button
                        onClick={openAddForm}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg"
                    >
                        <FaPlus /> Add Level
                    </button>
                </div>

                {/* LEVEL LIST */}
                {loading ? (
                    <p className="text-gray-500 mt-6">Loading...</p>
                ) : levels.length === 0 ? (
                    <p className="text-gray-500 mt-6">
                        No {skill} levels yet. Click "Add Level" to create one.
                    </p>
                ) : (
                    <div className="grid md:grid-cols-2 gap-4 mt-6">
                        {levels.map((lvl) => (
                            <div
                                key={lvl._id}
                                className="bg-white rounded-2xl shadow p-5 flex justify-between items-start"
                            >
                                <div>
                                    <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded-full">
                                        {lvl.levelName}
                                    </span>
                                    <h3 className="font-bold mt-2">{lvl.title}</h3>
                                    {lvl.description && (
                                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                            {lvl.description}
                                        </p>
                                    )}
                                </div>

                                <div className="flex gap-2 shrink-0 ml-3">
                                    <button
                                        onClick={() => openEditForm(lvl)}
                                        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(lvl._id)}
                                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ADD / EDIT MODAL */}
                {showForm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 relative">

                            <button
                                onClick={() => setShowForm(false)}
                                className="absolute top-5 right-5 text-gray-400 hover:text-gray-700"
                            >
                                <FaTimes size={20} />
                            </button>

                            <h2 className="text-2xl font-bold">
                                {editingId ? "Edit" : "Add"} {skill} Level
                            </h2>

                            <form onSubmit={handleSave} className="mt-6 space-y-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold mb-1">
                                            Level Name (e.g. A1, A2, B1)
                                        </label>
                                        <input
                                            type="text"
                                            value={form.levelName}
                                            onChange={(e) => setForm({ ...form, levelName: e.target.value })}
                                            className="w-full border rounded-lg px-3 py-2"
                                            placeholder="A1"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold mb-1">
                                            Display Order
                                        </label>
                                        <input
                                            type="number"
                                            value={form.order}
                                            onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                                            className="w-full border rounded-lg px-3 py-2"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-1">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        value={form.title}
                                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                                        className="w-full border rounded-lg px-3 py-2"
                                        placeholder="A1 - Everyday Basics"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-1">
                                        Description / Lesson Content
                                    </label>
                                    <textarea
                                        value={form.description}
                                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                                        className="w-full border rounded-lg px-3 py-2 min-h-[120px]"
                                        placeholder="Write the information students will read for this level..."
                                    />
                                </div>

                                {skill === "Listening" && (
                                    <div>
                                        <label className="block text-sm font-semibold mb-1">
                                            Audio Link (YouTube or direct audio URL)
                                        </label>
                                        <input
                                            type="text"
                                            value={form.audioUrl}
                                            onChange={(e) => setForm({ ...form, audioUrl: e.target.value })}
                                            className="w-full border rounded-lg px-3 py-2"
                                            placeholder="https://youtube.com/watch?v=..."
                                        />
                                    </div>
                                )}

                                {skill === "Reading" && (
                                    <div>
                                        <label className="block text-sm font-semibold mb-1">
                                            Image Link (Google Drive share link)
                                        </label>
                                        <input
                                            type="text"
                                            value={form.imageUrl}
                                            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                                            className="w-full border rounded-lg px-3 py-2"
                                            placeholder="https://drive.google.com/..."
                                        />
                                    </div>
                                )}

                                {skill === "Writing" && (
                                    <div>
                                        <label className="block text-sm font-semibold mb-1">
                                            Writing Task / Prompt
                                        </label>
                                        <textarea
                                            value={form.writingPrompt}
                                            onChange={(e) => setForm({ ...form, writingPrompt: e.target.value })}
                                            className="w-full border rounded-lg px-3 py-2 min-h-[100px]"
                                            placeholder="Write a short paragraph about..."
                                        />
                                    </div>
                                )}

                                {skill === "Speaking" && (
                                    <div>
                                        <label className="block text-sm font-semibold mb-1">
                                            Practice Video Link (YouTube)
                                        </label>
                                        <input
                                            type="text"
                                            value={form.videoUrl}
                                            onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                                            className="w-full border rounded-lg px-3 py-2"
                                            placeholder="https://youtube.com/watch?v=..."
                                        />
                                    </div>
                                )}

                                {skill !== "Speaking" && (
                                    <div>
                                        <label className="block text-sm font-semibold mb-1">
                                            Supporting Video Link (optional, YouTube)
                                        </label>
                                        <input
                                            type="text"
                                            value={form.videoUrl}
                                            onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                                            className="w-full border rounded-lg px-3 py-2"
                                            placeholder="https://youtube.com/watch?v=..."
                                        />
                                    </div>
                                )}

                                {error && (
                                    <p className="text-sm text-red-500">{error}</p>
                                )}

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white font-bold py-3 rounded-xl"
                                >
                                    {saving ? "Saving..." : editingId ? "Save Changes" : "Add Level"}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ManageSpokenEnglish;
