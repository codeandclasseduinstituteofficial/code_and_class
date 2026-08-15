import React, { useState } from 'react';
import { toast } from 'react-toastify';

const AddUsers = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async () => {
        if (!name || !email || !password) {
            toast.error("Please fill out all fields.");
            return;
        }

        const newUser = {
            name,
            email,
            password,
        };

        try {
            const { data } = await api.post('/users/register', newUser);

            toast.success('User added successfully!');

            // Reset fields
            setName('');
            setEmail('');
            setPassword('');

        } catch (error) {
            toast.error(
                `Error: ${error.response?.data?.message ||
                error.message ||
                'Registration failed'
                } `
            );
        }

    };

    return (
        <div className="min-h-screen bg-white text-slate-800 px-4 md:px-10 lg:px-20 py-12 relative top-16">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 text-brand-600">
                Add New User
            </h1>

            <div className="bg-white p-6 rounded-xl border border-slate-200 max-w-xl mx-auto shadow-lg space-y-6">
                {/* Name */}
                <div>
                    <label className="block text-sm font-semibold text-brand-600 mb-2">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter full name"
                        className="w-full px-4 py-2 rounded-md bg-white border border-slate-300 text-slate-800 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-semibold text-brand-600 mb-2">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email address"
                        className="w-full px-4 py-2 rounded-md bg-white border border-slate-300 text-slate-800 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    />
                </div>

                {/* Password */}
                <div>
                    <label className="block text-sm font-semibold text-brand-600 mb-2">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a password"
                        className="w-full px-4 py-2 rounded-md bg-white border border-slate-300 text-slate-800 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    />
                </div>

                {/* Submit Button */}
                <div className="text-center pt-4">
                    <button
                        onClick={handleSubmit}
                        className="bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white font-bold px-8 py-2 rounded-md transition-all"
                    >
                        Add User
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddUsers;