import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthProvider';
import { toast } from 'react-toastify';
import { authAxios } from '../../utils/authAxios';

const AddNotes = () => {
    const { accessToken } = useContext(AuthContext);
    const api = authAxios(() => accessToken);

    const [formData, setFormData] = useState({
        image: '',
        title: '',
        driveLink: '',
        isPaid: false,
        price: '',
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const API_BASE = `${import.meta.env.VITE_API_URL || "https://code-and-class.onrender.com/api"}/notes`;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.isPaid && (!formData.price || Number(formData.price) <= 0)) {
            setMessage('❌ Please set a valid price for a paid note.');
            return;
        }

        setLoading(true);
        setMessage('');


        try {
            const { data } = await api.post(API_BASE, {
                ...formData,
                price: formData.isPaid ? Number(formData.price) : 0,
            });

            setMessage('✅ Notes added successfully!');
            toast.success('Notes added successfully!');

            setFormData({
                image: '',
                title: '',
                driveLink: '',
                isPaid: false,
                price: '',
            });

        } catch (err) {
            setMessage(
                err.response?.data?.message || '❌ Error adding notes. Try again.'
            );

            console.error('Error adding notes:', err);
        } finally {
            setLoading(false);
        }

    };

    return (
        <div className="min-h-screen bg-white text-slate-800 px-4 md:px-10 lg:px-20 py-20 relative top-16">
            <h1 className="text-3xl md:text-4xl font-bold text-brand-600 mb-10 text-center">
                Upload Study Notes
            </h1>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-lg max-w-2xl mx-auto space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-brand-600 mb-2">Image URL</label>
                    <input
                        type="text"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-md bg-white border border-slate-300 text-slate-800 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                        placeholder="https://example.com/image.jpg"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-brand-600 mb-2">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-md bg-white border border-slate-300 text-slate-800 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                        placeholder="Enter note title"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-brand-600 mb-2">Drive PDF Link</label>
                    <input
                        type="url"
                        name="driveLink"
                        value={formData.driveLink}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-md bg-white border border-slate-300 text-slate-800 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                        placeholder="https://drive.google.com/..."
                        required
                    />
                </div>

                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        id="isPaid"
                        name="isPaid"
                        checked={formData.isPaid}
                        onChange={handleChange}
                        className="accent-brand-600 w-4 h-4"
                    />
                    <label htmlFor="isPaid" className="text-sm font-semibold text-slate-700">
                        This is a paid note
                    </label>
                </div>

                {formData.isPaid && (
                    <div>
                        <label className="block text-sm font-semibold text-brand-600 mb-2">Price (₹)</label>
                        <input
                            type="number"
                            min="1"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-md bg-white border border-slate-300 text-slate-800 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                            placeholder="e.g., 99"
                        />
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-2 rounded-md transition"
                >
                    {loading ? 'Adding...' : 'Add Note'}
                </button>

                {message && <p className="text-center mt-4 text-sm text-brand-600">{message}</p>}
            </form>
        </div>
    );
};

export default AddNotes;