import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthProvider';
import { toast } from 'react-toastify';

const AddLectures = () => {
    const { accessToken } = useContext(AuthContext);

    const [selectedClass, setSelectedClass] = useState('Class-10');
    const [unitTitle, setUnitTitle] = useState('');
    const [showChapterInput, setShowChapterInput] = useState(false);
    const [chapters, setChapters] = useState([]);
    const [chapterTitle, setChapterTitle] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [isPaidChapter, setIsPaidChapter] = useState(false);
    const [chapterPrice, setChapterPrice] = useState('');

    const handleAddChapter = () => {
        if (!chapterTitle || !videoUrl) return;
        if (isPaidChapter && (!chapterPrice || Number(chapterPrice) <= 0)) {
            toast.error('Please set a valid price for a paid chapter.');
            return;
        }
        setChapters([
            ...chapters,
            {
                title: chapterTitle,
                videoUrl,
                isPaid: isPaidChapter,
                price: isPaidChapter ? Number(chapterPrice) : 0,
            },
        ]);
        setChapterTitle('');
        setVideoUrl('');
        setIsPaidChapter(false);
        setChapterPrice('');
    };

    const handleSubmitUnit = async () => {
        const unitData = {
            classLevel: selectedClass,
            unitTitle,
            chapters,
        };

        try {
            const { data } = await api.post('/lectures', unitData);

            toast.success('Lecture unit successfully saved!');

            // Reset state
            setSelectedClass('Class-10');
            setUnitTitle('');
            setChapters([]);
            setShowChapterInput(false);

        } catch (err) {
            console.error('Error adding lecture:', err);

            toast.error(
                `Error: ${err.response?.data?.message ||
                err.message ||
                'Failed to add lecture'
                }`
            );
        }

    };

    return (
        <div className="min-h-screen bg-white text-slate-800 px-4 md:px-10 lg:px-20 py-12 relative top-16">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 text-brand-600">
                Add Lectures to Class
            </h1>

            <div className="bg-white p-6 rounded-xl border border-slate-200 max-w-3xl mx-auto shadow-lg space-y-6">
                {/* Class Selector */}
                <div>
                    <label className="block text-sm font-semibold text-brand-600 mb-2">Select Class</label>
                    <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="w-full bg-white border border-slate-300 text-slate-800 rounded-md p-2 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
                    >
                        <option>Class-10</option>
                        <option>Intermediate</option>
                    </select>
                </div>

                {/* Unit Title */}
                <div>
                    <label className="block text-sm font-semibold text-brand-600 mb-2">Unit Title</label>
                    <input
                        type="text"
                        value={unitTitle}
                        onChange={(e) => setUnitTitle(e.target.value)}
                        placeholder="e.g., Unit 1: Introduction to React"
                        className="w-full px-4 py-2 rounded-md bg-white border border-slate-300 text-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
                    />
                </div>

                {/* Button to Add Chapters */}
                <div className="text-center">
                    <button
                        onClick={() => setShowChapterInput(true)}
                        className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-2 rounded-md transition-all"
                    >
                        Add Chapters
                    </button>
                </div>

                {/* Chapter Modal Section */}
                {showChapterInput && (
                    <div className="bg-slate-100 p-4 mt-6 rounded-lg border border-slate-200 space-y-4">
                        <h2 className="text-lg font-bold text-brand-600">Add Chapter</h2>
                        <div>
                            <label className="block text-sm text-brand-600 mb-1">Chapter Title</label>
                            <input
                                type="text"
                                value={chapterTitle}
                                onChange={(e) => setChapterTitle(e.target.value)}
                                placeholder="e.g., useState Hook"
                                className="w-full px-4 py-2 rounded-md bg-white border border-slate-300 text-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-brand-600 mb-1">YouTube Video URL</label>
                            <input
                                type="text"
                                value={videoUrl}
                                onChange={(e) => setVideoUrl(e.target.value)}
                                placeholder="https://www.youtube.com/embed/xyz"
                                className="w-full px-4 py-2 rounded-md bg-white border border-slate-300 text-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="isPaidChapter"
                                checked={isPaidChapter}
                                onChange={(e) => setIsPaidChapter(e.target.checked)}
                                className="accent-brand-600 w-4 h-4"
                            />
                            <label htmlFor="isPaidChapter" className="text-sm font-semibold text-slate-700">
                                This is a paid chapter
                            </label>
                        </div>

                        {isPaidChapter && (
                            <div>
                                <label className="block text-sm text-brand-600 mb-1">Price (₹)</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={chapterPrice}
                                    onChange={(e) => setChapterPrice(e.target.value)}
                                    placeholder="e.g., 199"
                                    className="w-full px-4 py-2 rounded-md bg-white border border-slate-300 text-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
                                />
                            </div>
                        )}

                        <button
                            onClick={handleAddChapter}
                            className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-4 py-2 rounded-md"
                        >
                            Add Chapter
                        </button>

                        {/* Display Added Chapters */}
                        {chapters.length > 0 && (
                            <div className="mt-4">
                                <h3 className="text-brand-600 font-semibold mb-2">Chapters:</h3>
                                <ul className="list-disc list-inside text-slate-600 space-y-1">
                                    {chapters.map((chap, idx) => (
                                        <li key={idx}>
                                            {chap.title}{' '}
                                            {chap.isPaid ? (
                                                <span className="text-xs font-semibold text-amber-600">(Paid — ₹{chap.price})</span>
                                            ) : (
                                                <span className="text-xs font-semibold text-green-600">(Free)</span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                {/* Submit Unit */}
                {chapters.length > 0 && unitTitle && (
                    <div className="text-center pt-6">
                        <button
                            onClick={handleSubmitUnit}
                            className="bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white font-bold px-8 py-2 rounded-md transition-all"
                        >
                            Submit Unit
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddLectures;
