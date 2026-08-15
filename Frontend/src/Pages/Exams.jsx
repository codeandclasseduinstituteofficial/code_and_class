import React, { useEffect, useState } from "react";
import { FaCalendarAlt, FaChevronLeft, FaExternalLinkAlt } from "react-icons/fa";

const API_BASE = import.meta.env.VITE_API_URL || "https://code-and-class.onrender.com/api";

const toEmbedUrl = (url) => {
    if (!url) return url;
    if (url.includes("watch?v=")) return url.replace("watch?v=", "embed/");
    return url;
};

const Exams = () => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        fetch(`${API_BASE}/exams`)
            .then((res) => res.json())
            .then((data) => setExams(data.data || []))
            .catch(() => setExams([]))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-5 md:p-10 mt-10">
            <div className="max-w-5xl mx-auto">

                {!selected && (
                    <>
                        <h1 className="text-4xl font-bold text-center">Exams</h1>
                        <p className="text-center text-gray-500 mt-3">
                            Stay updated on exam dates, eligibility, and application deadlines.
                        </p>

                        {loading ? (
                            <p className="text-center text-gray-500 mt-10">Loading...</p>
                        ) : exams.length === 0 ? (
                            <p className="text-center text-gray-500 mt-10">No exam notices right now. Check back soon.</p>
                        ) : (
                            <div className="grid md:grid-cols-2 gap-6 mt-10">
                                {exams.map((exam) => (
                                    <button
                                        key={exam._id}
                                        onClick={() => setSelected(exam)}
                                        className="bg-white shadow rounded-2xl p-6 text-left hover:shadow-lg transition border"
                                    >
                                        {exam.imageUrl && (
                                            <img
                                                src={exam.imageUrl}
                                                alt={exam.title}
                                                className="w-full h-40 object-cover rounded-xl mb-4"
                                            />
                                        )}
                                        <h2 className="text-xl font-bold">{exam.title}</h2>
                                        {exam.examDate && (
                                            <p className="flex items-center gap-2 text-sm text-indigo-600 font-semibold mt-2">
                                                <FaCalendarAlt /> {new Date(exam.examDate).toLocaleDateString()}
                                            </p>
                                        )}
                                        <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                                            {exam.description}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {selected && (
                    <div>
                        <button
                            onClick={() => setSelected(null)}
                            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6"
                        >
                            <FaChevronLeft /> All exams
                        </button>

                        <div className="bg-white rounded-3xl shadow p-6 md:p-8">
                            {selected.imageUrl && (
                                <img
                                    src={selected.imageUrl}
                                    alt={selected.title}
                                    className="w-full max-h-80 object-cover rounded-2xl mb-6"
                                />
                            )}

                            <h1 className="text-3xl font-bold">{selected.title}</h1>

                            <div className="flex flex-wrap gap-4 mt-4">
                                {selected.examDate && (
                                    <span className="text-sm bg-indigo-50 text-indigo-700 font-semibold px-3 py-1.5 rounded-full">
                                        Exam Date: {new Date(selected.examDate).toLocaleDateString()}
                                    </span>
                                )}
                                {selected.applyLastDate && (
                                    <span className="text-sm bg-amber-50 text-amber-700 font-semibold px-3 py-1.5 rounded-full">
                                        Apply by: {new Date(selected.applyLastDate).toLocaleDateString()}
                                    </span>
                                )}
                            </div>

                            <p className="text-gray-600 mt-6 leading-relaxed whitespace-pre-line">
                                {selected.description}
                            </p>

                            {selected.videoUrl && (
                                <div className="mt-8 aspect-video rounded-2xl overflow-hidden bg-black">
                                    <iframe
                                        title="Exam info video"
                                        className="w-full h-full"
                                        src={toEmbedUrl(selected.videoUrl)}
                                        allowFullScreen
                                    />
                                </div>
                            )}

                            {selected.applyLink && (
                                <a
                                    href={selected.applyLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl"
                                >
                                    Apply Now <FaExternalLinkAlt className="text-sm" />
                                </a>
                            )}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Exams;
