import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthProvider';

const NgoDetails = () => {
    const { accessToken } = useContext(AuthContext);
    const [ngos, setNgos] = useState([]);
    const [selectedNgo, setSelectedNgo] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [ngoData, setNgoData] = useState({
        name: '',
        shortDescription: '',
        description: '',
        image: ''
    });

    const API_URL = `${import.meta.env.VITE_API_URL || "https://codeandclass.onrender.com/api"}/ngos`;

    // Fetch all NGOs
    const getAllNgos = async () => {
        try {
            const response = await fetch(`${API_URL}/ngos`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching NGOs', error);
            throw error;
        }
    };

    // Add a new NGO
    const addNgo = async (newNgoData) => {
        try {
            const { data } = await api.post('/ngos', newNgoData);

            return data;

        } catch (error) {
            console.error('Error adding NGO', error);
            throw error;
        }

    };

    // Update an existing NGO
    const updateNgo = async (id, updatedNgoData) => {
        try {
            const response = await fetch(`${API_URL}/ngos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
                body: JSON.stringify(updatedNgoData)
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error updating NGO', error);
            throw error;
        }
    };

    // Delete an NGO
    const deleteNgo = async (id) => {
        try {
            const response = await fetch(`${API_URL}/ngos/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error deleting NGO', error);
            throw error;
        }
    };

    useEffect(() => {
        const fetchNgos = async () => {
            try {
                const data = await getAllNgos();
                setNgos(data);
            } catch (error) {
                console.error('Error fetching NGOs:', error);
            }
        };

        fetchNgos();
    }, []);

    const handleCardClick = (ngo) => {
        setSelectedNgo(ngo);
        setIsEditing(false);
        setIsAdding(false);
    };

    const handleEditClick = (ngo) => {
        setSelectedNgo(ngo);
        setIsEditing(true);
        setIsAdding(false);
        setNgoData({
            name: ngo.name,
            shortDescription: ngo.shortDescription,
            description: ngo.description,
            image: ngo.image
        });
    };

    const handleUpdate = async () => {
        try {
            const updatedNgo = await updateNgo(selectedNgo._id, ngoData);
            setNgos(ngos.map((ngo) => (ngo._id === updatedNgo._id ? updatedNgo : ngo)));
            setIsEditing(false);
            setSelectedNgo(null);
        } catch (error) {
            console.error('Error updating NGO:', error);
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this NGO?");
        if (!confirmDelete) return;

        try {
            await deleteNgo(id);
            setNgos(ngos.filter((ngo) => ngo._id !== id));
            setSelectedNgo(null);
        } catch (error) {
            console.error('Error deleting NGO:', error);
        }
    };

    const handleAddNgo = async () => {
        try {
            const newNgo = await addNgo(ngoData);
            setNgos([...ngos, newNgo]);
            setIsAdding(false);
            setNgoData({ name: '', shortDescription: '', description: '', image: '' });
        } catch (error) {
            console.error('Error adding NGO:', error);
        }
    };

    return (
        <div className="bg-white text-slate-800 min-h-screen px-4 py-6 relative top-16">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-brand-600">NGO Directory</h1>
                <button
                    onClick={() => {
                        setIsAdding(true);
                        setIsEditing(false);
                        setSelectedNgo(null);
                        setNgoData({ name: '', shortDescription: '', description: '', image: '' });
                    }}
                    className="bg-brand-600 hover:bg-brand-700 text-white font-semibold py-2 px-4 rounded transition"
                >
                    + Add NGO
                </button>
            </div>

            {(isAdding || isEditing) && (
                <div className="card-surface text-slate-800 p-6 max-w-3xl mx-auto mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-slate-900">
                        {isEditing ? `Edit NGO: ${selectedNgo.name}` : 'Add New NGO'}
                    </h2>
                    <input
                        type="text"
                        value={ngoData.name}
                        onChange={(e) => setNgoData({ ...ngoData, name: e.target.value })}
                        placeholder="Name"
                        className="w-full p-2 mb-3 rounded-md border border-slate-300 bg-white text-slate-800 outline-none focus:border-brand-500"
                    />
                    <input
                        type="text"
                        value={ngoData.shortDescription}
                        onChange={(e) => setNgoData({ ...ngoData, shortDescription: e.target.value })}
                        placeholder="Short Description"
                        className="w-full p-2 mb-3 rounded-md border border-slate-300 bg-white text-slate-800 outline-none focus:border-brand-500"
                    />
                    <textarea
                        value={ngoData.description}
                        onChange={(e) => setNgoData({ ...ngoData, description: e.target.value })}
                        placeholder="Description"
                        rows='4'
                        className="w-full field-sizing-content p-2 mb-3 rounded-md border border-slate-300 bg-white text-slate-800 outline-none focus:border-brand-500"
                    />
                    <input
                        type="text"
                        value={ngoData.image}
                        onChange={(e) => setNgoData({ ...ngoData, image: e.target.value })}
                        placeholder="Image URL"
                        className="w-full p-2 mb-4 rounded-md border border-slate-300 bg-white text-slate-800 outline-none focus:border-brand-500"
                    />
                    <button
                        onClick={isEditing ? handleUpdate : handleAddNgo}
                        className="bg-brand-500 text-white py-2 px-4 rounded hover:bg-brand-600 transition duration-300"
                    >
                        {isEditing ? 'Update NGO' : 'Add NGO'}
                    </button>
                </div>
            )}

            {selectedNgo && !isEditing && (
                <div className="card-surface text-slate-800 p-6 max-w-3xl mx-auto mb-8 text-center">
                    <h2 className="text-3xl font-semibold mb-4">{selectedNgo.name}</h2>
                    <img src={selectedNgo.image} alt={selectedNgo.name} className="w-full h-64 object-cover rounded-lg mb-4" />
                    <p className="text-lg mb-4">{selectedNgo.description}</p>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={() => setSelectedNgo(null)}
                            className="bg-brand-500 text-white py-2 px-4 rounded hover:bg-brand-600 transition"
                        >
                            Back
                        </button>
                        <button
                            onClick={() => handleEditClick(selectedNgo)}
                            className="bg-brand-600 text-white py-2 px-4 rounded hover:bg-brand-700 transition"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => handleDelete(selectedNgo._id)}
                            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {ngos.map((ngo) => (
                    <div
                        key={ngo._id}
                        className="card-surface p-4 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
                        onClick={() => handleCardClick(ngo)}
                    >
                        <img src={ngo.image} alt={ngo.name} className="w-full h-48 object-cover rounded-lg mb-3" />
                        <h3 className="text-xl font-semibold mb-1 text-brand-600">{ngo.name}</h3>
                        <p className="text-slate-500 text-sm">{ngo.shortDescription}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NgoDetails;
