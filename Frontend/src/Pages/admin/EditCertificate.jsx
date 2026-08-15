import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthProvider';
import { toast } from 'react-toastify';
import { authAxios } from '../../utils/authAxios';

const CertificateManager = () => {
    const { accessToken } = useContext(AuthContext);

    const api = authAxios(() => accessToken);
    const [certificates, setCertificates] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [formData, setFormData] = useState({
        certificateNo: '',
        name: '',
        course: '',
        date: '',
        status: 'Verified',
    });

    useEffect(() => {
        fetchCertificates()
    }, []);

    const API_BASE = `${import.meta.env.VITE_API_URL || "http://localhost:8080/api"}/certificates`

    const fetchCertificates = async () => {
        try {
            const fetchCertificate = await api.get(API_BASE)
            const rawCertificate = await fetchCertificate?.data
            setCertificates(rawCertificate);
        } catch (err) {
            console.log(err)
        }
    }

    const handleEditClick = (index) => {
        setEditingIndex(index);
        setFormData(certificates[index]);
    };

    const handleDeleteClick = async (index) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this certificate?"
        );

        if (!confirmDelete) return;

        const certToDelete = certificates[index];

        try {
            await api.delete(`/certificates/${certToDelete._id}`);
            const updated = [...certificates];
            updated.splice(index, 1);

            setCertificates(updated);
            setEditingIndex(null);

            toast.success("Certificate deleted successfully!");
        } catch (err) {
            console.error("Delete failed:", err);

            toast.error(
                err.response?.data?.message ||
                "Failed to delete certificate."
            );
        }
    };

    const handleChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleUpdate = async () => {
        const certToUpdate = certificates[editingIndex];

        if (!certToUpdate?._id) {
            toast.error("Certificate ID is missing.");
            return;
        }

        try {
            const { data } = await api.put(
                `/certificates/${certToUpdate._id}`,
                formData
            );

            const updatedCert = data?.data || data;

            setCertificates((prev) => {
                const updated = [...prev];
                updated[editingIndex] = updatedCert;
                return updated;
            });
            
            toast.success("Certificate updated successfully!");
            setEditingIndex(null);

        } catch (err) {
            console.error("Update failed:", err);

            toast.error(
                err.response?.data?.message ||
                "Failed to update certificate."
            );
        }
    };

    return (
        <div className="min-h-screen bg-white text-slate-800 px-4 md:px-10 lg:px-20 py-12 relative top-16">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 text-brand-600">
                Certificate Manager
            </h1>

            {/* If editing */}
            {editingIndex !== null ? (
                <div className="bg-white p-6 rounded-xl border border-slate-200 max-w-2xl mx-auto shadow-lg space-y-6 mb-10">
                    <h2 className="text-xl font-bold text-brand-600">Edit Certificate</h2>

                    {['certificate_no', 'name', 'father_name', 'course', 'date', 'dob', 'duration'].map((field, idx) => (
                        <div key={idx}>
                            <label className="block text-sm font-semibold text-brand-600 mb-2 capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                            <input
                                type={field === 'date' ? 'text' : 'text'}
                                value={formData[field]}
                                onChange={(e) => handleChange(field, e.target.value)}
                                className="w-full px-4 py-2 rounded-md bg-white border border-slate-300 text-slate-800 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                            />
                        </div>
                    ))}

                    <div>
                        <label className="block text-sm font-semibold text-brand-600 mb-2">Status</label>
                        <select
                            value={formData.status}
                            onChange={(e) => handleChange('status', e.target.value)}
                            className="w-full px-4 py-2 rounded-md bg-white border border-slate-300 text-slate-800 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                        >
                            <option value="Verified">Verified</option>
                            <option value="Pending">Pending</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>

                    <div className="flex justify-center gap-4 pt-4">
                        <button
                            onClick={handleUpdate}
                            className="bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white font-bold px-8 py-2 rounded-md"
                        >
                            Update
                        </button>
                        <button
                            onClick={() => setEditingIndex(null)}
                            className="bg-red-600 hover:bg-red-500 text-white font-bold px-8 py-2 rounded-md"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : null}

            {/* Certificate List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {certificates?.map((cert, index) => (
                    <div
                        key={index}
                        className="bg-white p-4 rounded-xl border border-slate-200 shadow space-y-3"
                    >
                        <h3 className="text-lg font-bold text-brand-600">{cert.name}</h3>
                        <p className="text-slate-500 text-sm"><strong>Certificate No:</strong> {cert?.certificate_no}</p>
                        <p className="text-slate-500 text-sm"><strong>Father Name: </strong> {cert?.father_name}</p>
                        <p className="text-slate-500 text-sm"><strong>Date of Birth: </strong> {cert?.dob}</p>
                        <p className="text-slate-600"><strong>Course:</strong> {cert?.course}</p>
                        <p className="text-slate-600"><strong>Duration:</strong> {cert?.duration}</p>
                        <p className="text-slate-600"><strong>Date: </strong> {cert?.date}</p>
                        <p className="text-slate-600">
                            <strong>Status:</strong>{' '}
                            <span
                                className={`px-2 py-1 rounded-md text-sm font-semibold ${cert.status === 'Verified'
                                    ? 'text-green-400'
                                    : cert.status === 'Pending'
                                        ? 'text-yellow-400'
                                        : 'text-red-400'
                                    }`}
                            >
                                {cert.status}
                            </span>
                        </p>
                        <div className="flex justify-between pt-2">
                            <button
                                onClick={() => handleEditClick(index)}
                                className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-1 rounded-md font-semibold"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDeleteClick(index)}
                                className="bg-red-600 hover:bg-red-500 text-white px-4 py-1 rounded-md font-semibold"
                            >
                                Delete
                            </button>
                            <Link to={`/dashboard/certificate/${certificates[index]?.certificate_no}`}>
                                <button
                                    onClick={() => handleEditClick(index)}
                                    className="bg-green-500 hover:bg-green-400 text-white px-4 py-1 rounded-md font-semibold"
                                >
                                    Download Certificate
                                </button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CertificateManager;