import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthProvider';
import { toast } from 'react-toastify';

const EditLecture = () => {
  const { accessToken } = useContext(AuthContext);
  const [units, setUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);

  const API_BASE = `${import.meta.env.VITE_API_URL || "https://codeandclass.onrender.com/api"}/lectures`;

  useEffect(() => {
    fetchLectures();
  }, []);

  const fetchLectures = async () => {
    try {
      const res = await fetch(API_BASE, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      setUnits(data);
    } catch (err) {
      console.error('Failed to fetch lectures', err);
    }
  };

  const handleEdit = (unit) => {
    setSelectedUnit(unit);
  };

  const handleDeleteUnit = async (id) => {
    const confirmDelete = window.confirm('Delete this unit?');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) throw new Error('Failed to delete');
      toast.success('Unit deleted successfully!');
      fetchLectures();
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
      chapters: [...selectedUnit.chapters, { title: '', videoUrl: '', isPaid: false, price: 0 }]
    });
  };

  const handleDeleteChapter = (index) => {
    const confirmDelete = window.confirm('Delete this chapter?');
    if (!confirmDelete) return;
    const updated = selectedUnit.chapters.filter((_, i) => i !== index);
    setSelectedUnit({ ...selectedUnit, chapters: updated });
  };

  const handleSubmit = async () => {
    for (const chap of selectedUnit.chapters) {
      if (chap.isPaid && (!chap.price || Number(chap.price) <= 0)) {
        toast.error(`Please set a valid price for the paid chapter "${chap.title}".`);
        return;
      }
    }

    try {
      const res = await fetch(`${API_BASE}/${selectedUnit._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(selectedUnit),
      });

      if (!res.ok) throw new Error('Update failed');
      toast.success('Lecture updated successfully!');
      setSelectedUnit(null);
      fetchLectures();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 px-4 md:px-10 lg:px-20 py-12 relative top-16">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 text-brand-600">
        Edit Lecture Units
      </h1>

      {!selectedUnit && (
        <div className="space-y-6">
          {units.map((unit) => (
            <div
              key={unit._id}
              className="bg-white p-6 rounded-xl border border-slate-200 shadow-md flex flex-col md:flex-row justify-between items-center gap-4"
            >
              <div>
                <h2 className="text-xl font-bold text-brand-600">{unit.unitTitle}</h2>
                <p className="text-sm text-slate-500">Class: {unit.classLevel}</p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => handleEdit(unit)}
                  className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-2 rounded-md"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteUnit(unit._id)}
                  className="bg-red-600 hover:bg-red-500 text-white font-semibold px-6 py-2 rounded-md"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedUnit && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 max-w-4xl mx-auto shadow-lg space-y-6">
          <select
            value={selectedUnit.classLevel}
            onChange={(e) => setSelectedUnit({ ...selectedUnit, classLevel: e.target.value })}
            className="w-full px-4 py-2 rounded-md bg-white border border-slate-300 text-slate-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
          >
            <option>Class 10</option>
            <option>Intermediate</option>
          </select>

          <input
            type="text"
            value={selectedUnit.unitTitle}
            onChange={(e) => setSelectedUnit({ ...selectedUnit, unitTitle: e.target.value })}
            placeholder="Unit Title"
            className="w-full px-4 py-2 bg-white border border-slate-300 text-slate-800 rounded-md outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          />

          {selectedUnit.chapters.map((chapter, index) => (
            <div key={index} className="bg-slate-100 p-4 rounded-md space-y-2">
              <input
                type="text"
                value={chapter.title}
                onChange={(e) => handleChapterChange(index, 'title', e.target.value)}
                placeholder="Chapter Title"
                className="w-full px-3 py-2 bg-white border border-slate-300 text-slate-800 rounded-md"
              />
              <input
                type="text"
                value={chapter.videoUrl}
                onChange={(e) => handleChapterChange(index, 'videoUrl', e.target.value)}
                placeholder="YouTube Video URL"
                className="w-full px-3 py-2 bg-white border border-slate-300 text-slate-800 rounded-md"
              />

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id={`isPaid-${index}`}
                  checked={!!chapter.isPaid}
                  onChange={(e) => handleChapterChange(index, 'isPaid', e.target.checked)}
                  className="accent-brand-600 w-4 h-4"
                />
                <label htmlFor={`isPaid-${index}`} className="text-sm font-semibold text-slate-700">
                  Paid chapter
                </label>
              </div>

              {chapter.isPaid && (
                <input
                  type="number"
                  min="1"
                  value={chapter.price || ''}
                  onChange={(e) => handleChapterChange(index, 'price', Number(e.target.value))}
                  placeholder="Price (₹)"
                  className="w-full px-3 py-2 bg-white border border-slate-300 text-slate-800 rounded-md"
                />
              )}

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
            className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-4 py-2 rounded-md"
          >
            + Add Chapter
          </button>

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

export default EditLecture;
