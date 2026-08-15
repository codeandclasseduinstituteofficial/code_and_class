import React, { useState } from 'react';
import { toast } from 'react-toastify';

const AddSpokenEnglishLecture = () => {
  const [selectedLevel, setSelectedLevel] = useState('Beginner');
  const [unitTitle, setUnitTitle] = useState('');
  const [showChapterInput, setShowChapterInput] = useState(false);
  const [chapters, setChapters] = useState([]);
  const [chapterTitle, setChapterTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  const handleAddChapter = () => {
    if (!chapterTitle || !videoUrl) return;
    setChapters([...chapters, { title: chapterTitle, videoUrl }]);
    setChapterTitle('');
    setVideoUrl('');
  };

  const handleSubmitUnit = async () => {
    const unitData = {
      level: selectedLevel,
      unitTitle,
      chapters,
    };

    try {
      const { data } = await api.post('/spoken-lectures', unitData);

      toast.success('Spoken English Unit successfully saved!');

      // Reset form
      setSelectedLevel('Beginner');
      setUnitTitle('');
      setChapters([]);
      setShowChapterInput(false);

    } catch (err) {
      console.error('Error saving spoken lecture:', err);

      toast.error(
        `Error: ${err.response?.data?.message ||
        err.message ||
        'Failed to add spoken lecture unit'
        } `
      );
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 px-4 md:px-10 lg:px-20 py-12 relative top-16">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 text-brand-600">
        Add Spoken English Lectures
      </h1>

      <div className="bg-white p-6 rounded-xl border border-slate-200 max-w-3xl mx-auto shadow-lg space-y-6">
        {/* Level Selector */}
        <div>
          <label className="block text-sm font-semibold text-brand-600 mb-2">Select Level</label>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="w-full bg-white border border-slate-300 text-slate-800 rounded-md p-2 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>

        {/* Unit Title */}
        <div>
          <label className="block text-sm font-semibold text-brand-600 mb-2">Unit Title</label>
          <input
            type="text"
            value={unitTitle}
            onChange={(e) => setUnitTitle(e.target.value)}
            placeholder="e.g., Unit 1: Daily Conversations"
            className="w-full px-4 py-2 rounded-md bg-white border border-slate-300 text-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
          />
        </div>

        {/* Add Chapters Button */}
        <div className="text-center">
          <button
            onClick={() => setShowChapterInput(true)}
            className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-2 rounded-md transition-all"
          >
            Add Chapters
          </button>
        </div>

        {/* Chapter Input Section */}
        {showChapterInput && (
          <div className="bg-slate-100 p-4 mt-6 rounded-lg border border-slate-200 space-y-4">
            <h2 className="text-lg font-bold text-brand-600">Add Chapter</h2>
            <div>
              <label className="block text-sm text-brand-600 mb-1">Chapter Title</label>
              <input
                type="text"
                value={chapterTitle}
                onChange={(e) => setChapterTitle(e.target.value)}
                placeholder="e.g., Basic Greetings"
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
                    <li key={idx}>{chap.title}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Submit Button */}
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

export default AddSpokenEnglishLecture;