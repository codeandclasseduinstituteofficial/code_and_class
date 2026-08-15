import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthProvider';
import { toast } from 'react-toastify';

const EditSpokenEnglish = () => {
  const { accessToken } = useContext(AuthContext);
  const [units, setUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);

  const API_BASE = `${import.meta.env.VITE_API_URL || "https://code-and-class.onrender.com/api"}/spoken-lectures`;

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const res = await fetch(API_BASE);
        const data = await res.json();
        setUnits(data);
      } catch (err) {
        console.error('Error fetching units:', err);
      }
    };
    fetchUnits();
  }, []);

  const handleEditClick = (unit) => {
    setSelectedUnit(unit);
  };

  const handleDeleteUnit = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this unit?');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) throw new Error('Delete failed');
      setUnits(units.filter((unit) => unit._id !== id));
      setSelectedUnit(null);
      toast.success('Unit deleted');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleChapterChange = (index, field, value) => {
    const updated = [...selectedUnit.chapters];
    updated[index][field] = value;
    setSelectedUnit({ ...selectedUnit, chapters: updated });
  };

  const handleAddChapter = () => {
    setSelectedUnit({
      ...selectedUnit,
      chapters: [...selectedUnit.chapters, { title: '', videoUrl: '' }],
    });
  };

  const handleDeleteChapter = (index) => {
    const confirmDelete = window.confirm('Delete this chapter?');
    if (!confirmDelete) return;
    const updated = selectedUnit.chapters.filter((_, i) => i !== index);
    setSelectedUnit({ ...selectedUnit, chapters: updated });
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch(`${API_BASE}/${selectedUnit._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify(selectedUnit),
      });

      if (!res.ok) throw new Error('Update failed');

      const updatedUnit = await res.json();
      setUnits(units.map((u) => (u._id === updatedUnit._id ? updatedUnit : u)));
      setSelectedUnit(null);
      toast.success('Unit updated successfully!');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 px-4 md:px-10 lg:px-20 py-12 relative top-16">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 text-brand-600">
        Manage Spoken English Units
      </h1>

      {!selectedUnit ? (
        <div className="space-y-4 max-w-4xl mx-auto">
          {units.map((unit) => (
            <div key={unit._id} className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col md:flex-row items-center justify-between">
              <h2 className="text-xl font-semibold text-brand-600">{unit.unitTitle} ({unit.level})</h2>
              <div className="mt-2 flex gap-4">
                <button
                  onClick={() => handleEditClick(unit)}
                  className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-4 py-2 rounded-md"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteUnit(unit._id)}
                  className="bg-red-600 hover:bg-red-500 text-white font-semibold px-4 py-2 rounded-md"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-xl border border-slate-200 max-w-4xl mx-auto shadow-lg space-y-6">
          <div>
            <label className="block text-sm font-semibold text-brand-600 mb-2">Select Level</label>
            <select
              value={selectedUnit.level}
              onChange={(e) => setSelectedUnit({ ...selectedUnit, level: e.target.value })}
              className="w-full px-4 py-2 rounded-md bg-white border border-slate-300 text-slate-800 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-600 mb-2">Unit Title</label>
            <input
              type="text"
              value={selectedUnit.unitTitle}
              onChange={(e) => setSelectedUnit({ ...selectedUnit, unitTitle: e.target.value })}
              placeholder="Unit Title"
              className="w-full px-4 py-2 rounded-md bg-white border border-slate-300 text-slate-800 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-600 mb-4">Chapters</label>
            {selectedUnit.chapters.map((chapter, index) => (
              <div
                key={index}
                className="mb-4 p-4 border border-slate-200 rounded-lg bg-slate-100 space-y-2"
              >
                <input
                  type="text"
                  value={chapter.title}
                  onChange={(e) => handleChapterChange(index, 'title', e.target.value)}
                  placeholder="Chapter Title"
                  className="w-full px-3 py-2 bg-white border border-slate-300 text-slate-800 rounded-md outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                />
                <input
                  type="text"
                  value={chapter.videoUrl}
                  onChange={(e) => handleChapterChange(index, 'videoUrl', e.target.value)}
                  placeholder="YouTube Video URL"
                  className="w-full px-3 py-2 bg-white border border-slate-300 text-slate-800 rounded-md outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                />
                <button
                  onClick={() => handleDeleteChapter(index)}
                  className="bg-red-600 hover:bg-red-500 text-white px-4 py-1 rounded-md text-sm"
                >
                  Delete Chapter
                </button>
              </div>
            ))}
            <button
              onClick={handleAddChapter}
              className="mt-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-4 py-2 rounded-md"
            >
              + Add Chapter
            </button>
          </div>

          <div className="flex flex-col md:flex-row justify-center gap-4 pt-4">
            <button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white font-bold px-8 py-2 rounded-md"
            >
              Save Changes
            </button>
            <button
              onClick={() => setSelectedUnit(null)}
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold px-8 py-2 rounded-md"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditSpokenEnglish;