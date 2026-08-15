import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthProvider';
import { toast } from 'react-toastify';

const API_BASE = `${import.meta.env.VITE_API_URL || "https://code-and-class.onrender.com/api"}/notes`; // Update if needed

const EditNotes = () => {
  const { accessToken } = useContext(AuthContext);
  const [notes, setNotes] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState({ image: '', title: '', driveLink: '', isPaid: false, price: 0 });

  useEffect(() => {
    fetchNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await fetch(API_BASE, {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      });
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      console.error('Failed to fetch notes:', err);
    }
  };

  const handleEditClick = (index) => {
    setEditIndex(index);
    setEditData({ ...notes[index] });
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this note?');
    if (!confirm) return;

    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!res.ok) throw new Error('Delete failed');

      setNotes(notes.filter((note) => note._id !== id));
      toast.success('Note deleted successfully!');
    } catch (err) {
      console.error('Error deleting note:', err);
      toast.error('Something went wrong.');
    }
  };

  const handleSave = async () => {
    if (editData.isPaid && (!editData.price || Number(editData.price) <= 0)) {
      toast.error('Please set a valid price for a paid note.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/${editData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          ...editData,
          price: editData.isPaid ? Number(editData.price) : 0,
        }),
      });

      if (!res.ok) throw new Error('Update failed');

      const updatedNote = await res.json();
      const updatedNotes = [...notes];
      updatedNotes[editIndex] = updatedNote;
      setNotes(updatedNotes);
      setEditIndex(null);
      toast.success('Note updated successfully!');
    } catch (err) {
      console.error('Error updating note:', err);
      toast.error('Something went wrong.');
    }
  };

  const handleChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 px-4 md:px-10 lg:px-20 py-20 relative top-16">
      <h1 className="text-3xl md:text-4xl font-bold text-brand-600 text-center mb-10">Edit & Manage Notes</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {notes.map((note, index) => (
          <div
            key={note._id}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow space-y-4"
          >
            {editIndex === index ? (
              <>
                <input
                  type="text"
                  value={editData.image}
                  onChange={(e) => handleChange('image', e.target.value)}
                  placeholder="Image URL"
                  className="w-full px-3 py-2 rounded-md bg-white border border-slate-300 text-slate-800 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                />
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Title"
                  className="w-full px-3 py-2 rounded-md bg-white border border-slate-300 text-slate-800 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                />
                <input
                  type="text"
                  value={editData.driveLink}
                  onChange={(e) => handleChange('driveLink', e.target.value)}
                  placeholder="Drive PDF Link"
                  className="w-full px-3 py-2 rounded-md bg-white border border-slate-300 text-slate-800 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                />

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="editIsPaid"
                    checked={!!editData.isPaid}
                    onChange={(e) => handleChange('isPaid', e.target.checked)}
                    className="accent-brand-600 w-4 h-4"
                  />
                  <label htmlFor="editIsPaid" className="text-sm font-semibold text-slate-700">
                    Paid note
                  </label>
                </div>

                {editData.isPaid && (
                  <input
                    type="number"
                    min="1"
                    value={editData.price || ''}
                    onChange={(e) => handleChange('price', e.target.value)}
                    placeholder="Price (₹)"
                    className="w-full px-3 py-2 rounded-md bg-white border border-slate-300 text-slate-800 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                  />
                )}

                <div className="flex gap-4">
                  <button
                    onClick={handleSave}
                    className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-md font-semibold"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditIndex(null)}
                    className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-md font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <img
                  src={note.image}
                  alt={note.title}
                  className="w-full h-48 object-cover rounded-md"
                />
                <h2 className="text-xl font-bold text-brand-600 flex items-center gap-2">
                  {note.title}
                  {note.isPaid ? (
                    <span className="text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
                      Paid · ₹{note.price}
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-green-600 bg-green-50 border border-green-200 rounded-full px-2 py-0.5">
                      Free
                    </span>
                  )}
                </h2>
                <a
                  href={note.driveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-brand-600 underline break-words"
                >
                  Download PDF
                </a>
                <div className="flex justify-between pt-2">
                  <button
                    onClick={() => handleEditClick(index)}
                    className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-1 rounded-md font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(note._id)}
                    className="bg-red-600 hover:bg-red-500 text-white px-4 py-1 rounded-md font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditNotes;
