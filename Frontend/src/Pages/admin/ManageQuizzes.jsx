import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthProvider';
import instance from '../../utils/axios';
import toast from 'react-hot-toast';
import { FaEdit, FaTrash, FaStar, FaLock, FaTimes } from 'react-icons/fa';

const emptyQuestion = () => ({
    questionText: '',
    options: ['', ''],
    correctOptionIndex: 0,
});

// Converts a full quiz document (as returned by GET /quizzes/:id/admin) into
// the shape the edit form works with (options as plain strings, not {text}).
const toFormState = (quiz) => ({
    title: quiz.title || '',
    description: quiz.description || '',
    courseId: quiz.course?._id || quiz.course || '',
    timeLimitMinutes: quiz.timeLimitMinutes ?? 10,
    isPublished: quiz.isPublished ?? true,
    isSpecial: quiz.isSpecial ?? false,
    isPaid: quiz.isPaid ?? false,
    price: quiz.price ?? '',
    questions: (quiz.questions || []).map((q) => ({
        questionText: q.questionText,
        options: q.options.map((o) => o.text),
        correctOptionIndex: q.correctOptionIndex,
    })),
});

const ManageQuizzes = () => {
    const { accessToken } = useContext(AuthContext);
    const authHeaders = { Authorization: `Bearer ${accessToken}` };

    const [quizzes, setQuizzes] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(null);
    const [saving, setSaving] = useState(false);

    const fetchQuizzes = async () => {
        try {
            const { data } = await instance.get('/quizzes/admin/all', { headers: authHeaders });
            setQuizzes(data);
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Failed to load quizzes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuizzes();
        instance
            .get('/courses')
            .then(({ data }) => setCourses(data))
            .catch(() => { });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const startEdit = async (quizId) => {
        try {
            const { data } = await instance.get(`/quizzes/${quizId}/admin`, { headers: authHeaders });
            setForm(toFormState(data));
            setEditingId(quizId);
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Could not load this quiz');
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setForm(null);
    };

    const handleDelete = async (quizId) => {
        if (!window.confirm('Delete this quiz? This also removes past attempts.')) return;
        try {
            await instance.delete(`/quizzes/${quizId}`, { headers: authHeaders });
            toast.success('Quiz deleted');
            if (editingId === quizId) cancelEdit();
            fetchQuizzes();
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Delete failed');
        }
    };

    const togglePublished = async (quiz) => {
        try {
            await instance.put(
                `/quizzes/${quiz._id}`,
                { isPublished: !quiz.isPublished },
                { headers: authHeaders }
            );
            toast.success(quiz.isPublished ? 'Quiz unpublished' : 'Quiz published');
            fetchQuizzes();
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Update failed');
        }
    };

    // ---------- edit form helpers ----------

    const updateForm = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

    const updateQuestion = (qIdx, field, value) => {
        setForm((prev) => {
            const questions = [...prev.questions];
            questions[qIdx] = { ...questions[qIdx], [field]: value };
            return { ...prev, questions };
        });
    };

    const updateOption = (qIdx, oIdx, value) => {
        setForm((prev) => {
            const questions = [...prev.questions];
            const options = [...questions[qIdx].options];
            options[oIdx] = value;
            questions[qIdx] = { ...questions[qIdx], options };
            return { ...prev, questions };
        });
    };

    const addOption = (qIdx) => {
        setForm((prev) => {
            const questions = [...prev.questions];
            if (questions[qIdx].options.length >= 6) return prev;
            questions[qIdx] = { ...questions[qIdx], options: [...questions[qIdx].options, ''] };
            return { ...prev, questions };
        });
    };

    const removeOption = (qIdx, oIdx) => {
        setForm((prev) => {
            const questions = [...prev.questions];
            if (questions[qIdx].options.length <= 2) return prev;
            const options = questions[qIdx].options.filter((_, i) => i !== oIdx);
            const correctOptionIndex = questions[qIdx].correctOptionIndex >= options.length ? 0 : questions[qIdx].correctOptionIndex;
            questions[qIdx] = { ...questions[qIdx], options, correctOptionIndex };
            return { ...prev, questions };
        });
    };

    const addQuestion = () => setForm((prev) => ({ ...prev, questions: [...prev.questions, emptyQuestion()] }));

    const removeQuestion = (qIdx) => {
        setForm((prev) => (prev.questions.length > 1 ? { ...prev, questions: prev.questions.filter((_, i) => i !== qIdx) } : prev));
    };

    const handleSave = async () => {
        if (!form.title.trim() || form.questions.length === 0) {
            toast.error('Please add a title and at least one question.');
            return;
        }
        for (const q of form.questions) {
            if (!q.questionText.trim() || q.options.some((o) => !o.trim())) {
                toast.error('Every question needs text and all its options filled in.');
                return;
            }
        }
        if (form.isPaid && (!form.price || Number(form.price) <= 0)) {
            toast.error('Set a valid amount for a paid quiz.');
            return;
        }

        setSaving(true);
        try {
            await instance.put(
                `/quizzes/${editingId}`,
                {
                    title: form.title,
                    description: form.description,
                    course: form.courseId || null,
                    timeLimitMinutes: Number(form.timeLimitMinutes),
                    isPublished: form.isPublished,
                    isSpecial: form.isSpecial,
                    isPaid: form.isPaid,
                    price: form.isPaid ? Number(form.price) : 0,
                    questions: form.questions.map((q) => ({
                        questionText: q.questionText,
                        options: q.options.map((text) => ({ text })),
                        correctOptionIndex: q.correctOptionIndex,
                    })),
                },
                { headers: authHeaders }
            );
            toast.success('Quiz updated');
            cancelEdit();
            fetchQuizzes();
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Failed to update quiz');
        } finally {
            setSaving(false);
        }
    };

    const inputClass =
        'w-full px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-800 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500';
    const labelClass = 'block text-sm font-semibold text-slate-700 mb-1.5';

    return (
        <div className="min-h-screen bg-slate-50 px-4 md:px-10 lg:px-20 py-12 relative top-16">
            <h1 className="text-3xl font-display font-bold text-center mb-8 text-slate-900">Manage Quizzes</h1>

            {loading ? (
                <p className="text-center text-slate-400">Loading quizzes…</p>
            ) : quizzes.length === 0 ? (
                <p className="text-center text-slate-400">No quizzes yet. Create one from "Create Quiz".</p>
            ) : (
                <div className="max-w-3xl mx-auto space-y-4">
                    {quizzes.map((quiz) => (
                        <div key={quiz._id} className="card-surface p-5">
                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="font-bold text-slate-900 truncate">{quiz.title}</h3>
                                        {quiz.isSpecial && (
                                            <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5 flex items-center gap-1">
                                                <FaStar className="text-[10px]" /> Special
                                            </span>
                                        )}
                                        {quiz.isPaid && (
                                            <span className="text-xs font-semibold text-brand-700 bg-brand-50 border border-brand-200 rounded-full px-2 py-0.5 flex items-center gap-1">
                                                <FaLock className="text-[10px]" /> ₹{quiz.price}
                                            </span>
                                        )}
                                        {!quiz.isPublished && (
                                            <span className="text-xs font-semibold text-slate-500 bg-slate-100 border border-slate-200 rounded-full px-2 py-0.5">
                                                Draft
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-500 mt-1">
                                        {quiz.questionCount} questions · {quiz.timeLimitMinutes} min
                                        {quiz.course?.title ? ` · Locked to ${quiz.course.title}` : ''}
                                    </p>
                                </div>

                                <div className="flex items-center gap-3 shrink-0">
                                    <button onClick={() => togglePublished(quiz)} className="text-xs font-semibold text-slate-500 hover:underline">
                                        {quiz.isPublished ? 'Unpublish' : 'Publish'}
                                    </button>
                                    <button onClick={() => startEdit(quiz._id)} className="text-brand-600 hover:text-brand-700" title="Edit">
                                        <FaEdit />
                                    </button>
                                    <button onClick={() => handleDelete(quiz._id)} className="text-red-500 hover:text-red-600" title="Delete">
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {editingId && form && (
                <div className="fixed inset-0 bg-black/40 flex items-start justify-center overflow-y-auto py-10 px-4 z-50">
                    <div className="card-surface p-6 max-w-3xl w-full space-y-6 relative">
                        <button onClick={cancelEdit} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                            <FaTimes />
                        </button>

                        <h2 className="text-xl font-display font-bold text-slate-900">Edit Quiz</h2>

                        <div>
                            <label className={labelClass}>Quiz Title</label>
                            <input className={inputClass} value={form.title} onChange={(e) => updateForm('title', e.target.value)} />
                        </div>

                        <div>
                            <label className={labelClass}>Description (optional)</label>
                            <textarea className={inputClass} rows="2" value={form.description} onChange={(e) => updateForm('description', e.target.value)} />
                        </div>

                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <label className={labelClass}>Lock to a Course (leave blank for a free/public quiz)</label>
                                <select className={inputClass} value={form.courseId} onChange={(e) => updateForm('courseId', e.target.value)}>
                                    <option value="">Free — open to everyone</option>
                                    {courses.map((c) => (
                                        <option key={c._id} value={c._id}>{c.title}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="w-40">
                                <label className={labelClass}>Time Limit (min)</label>
                                <input type="number" min="1" className={inputClass} value={form.timeLimitMinutes} onChange={(e) => updateForm('timeLimitMinutes', e.target.value)} />
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4">
                            <label className="flex-1 flex items-center gap-2 border border-slate-200 rounded-lg px-4 py-2.5 cursor-pointer">
                                <input type="checkbox" checked={form.isSpecial} onChange={(e) => updateForm('isSpecial', e.target.checked)} className="accent-brand-600" />
                                <span className="text-sm text-slate-700"><span className="font-semibold">Special quiz</span> — pinned first in the list</span>
                            </label>

                            <label className="flex-1 flex items-center gap-2 border border-slate-200 rounded-lg px-4 py-2.5 cursor-pointer">
                                <input type="checkbox" checked={form.isPaid} onChange={(e) => updateForm('isPaid', e.target.checked)} className="accent-brand-600" />
                                <span className="text-sm text-slate-700"><span className="font-semibold">Paid quiz</span> — pay before writing</span>
                            </label>

                            {form.isPaid && (
                                <div className="w-40">
                                    <label className={labelClass}>Amount (₹)</label>
                                    <input type="number" min="1" className={inputClass} value={form.price} onChange={(e) => updateForm('price', e.target.value)} />
                                </div>
                            )}
                        </div>

                        <div className="space-y-5">
                            {form.questions.map((q, qIdx) => (
                                <div key={qIdx} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-bold text-brand-600">Question {qIdx + 1}</span>
                                        {form.questions.length > 1 && (
                                            <button onClick={() => removeQuestion(qIdx)} className="text-xs text-red-500 hover:underline">Remove</button>
                                        )}
                                    </div>

                                    <input
                                        className={inputClass + ' mb-3'}
                                        placeholder="Question text"
                                        value={q.questionText}
                                        onChange={(e) => updateQuestion(qIdx, 'questionText', e.target.value)}
                                    />

                                    <div className="space-y-2">
                                        {q.options.map((opt, oIdx) => (
                                            <div key={oIdx} className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name={`edit-correct-${qIdx}`}
                                                    checked={q.correctOptionIndex === oIdx}
                                                    onChange={() => updateQuestion(qIdx, 'correctOptionIndex', oIdx)}
                                                    title="Mark as correct answer"
                                                    className="accent-brand-600"
                                                />
                                                <input
                                                    className={inputClass}
                                                    placeholder={`Option ${oIdx + 1}`}
                                                    value={opt}
                                                    onChange={(e) => updateOption(qIdx, oIdx, e.target.value)}
                                                />
                                                {q.options.length > 2 && (
                                                    <button onClick={() => removeOption(qIdx, oIdx)} className="text-slate-400 hover:text-red-500 text-sm px-2">✕</button>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <button onClick={() => addOption(qIdx)} className="text-xs text-brand-600 font-semibold mt-2 hover:underline">
                                        + Add Option
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button onClick={addQuestion} className="btn-outline w-full">+ Add Another Question</button>

                        <div className="flex items-center justify-center gap-3 pt-2">
                            <button onClick={cancelEdit} className="btn-outline px-8">Cancel</button>
                            <button onClick={handleSave} disabled={saving} className="btn-primary px-10 disabled:opacity-70">
                                {saving ? 'Saving…' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageQuizzes;
