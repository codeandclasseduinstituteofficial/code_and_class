import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthProvider';
import { toast } from 'react-toastify';

const API_BASE = `${import.meta.env.VITE_API_URL || "https://code-and-class.onrender.com/api"}/users`;

const EditUser = () => {
  const { accessToken } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  // Fetch all users
  useEffect(() => {
    if (!accessToken) return;
    fetch(API_BASE, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => toast.error('Failed to load users'));
  }, [accessToken]);

  // Handle field changes
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Start editing
  const handleEditClick = (user) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, password: '' });
  };

  // Id Card
  // const handleIdcardClick = (user) => {
  //   setEditingUser(user);
  //   setFormData({ name: user.name, email: user.email, password: '' });
  // };

  // Cancel edit
  const cancelEdit = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', password: '' });
  };

  // Update user
  const handleUpdate = async () => {
    if (!formData.name || !formData.email) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/${editingUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to update user');

      toast.success('User updated successfully');
      const updated = await response.json();
      setUsers(users.map(u => (u._id === updated._id ? updated : u)));
      cancelEdit();
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this user?');
    if (!confirmed) return;

    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) throw new Error('Failed to delete user');

      toast.success('User deleted');
      setUsers(users.filter(user => user._id !== id));
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 px-4 md:px-10 lg:px-20 py-12 relative top-16">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 text-brand-600">
        Manage Users
      </h1>

      {/* Edit Form */}
      {editingUser && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 max-w-2xl mx-auto shadow-lg space-y-6 mb-10">
          <h2 className="text-xl font-bold text-brand-600 mb-4 text-center">Edit User</h2>

          <div>
            <label className="block text-sm font-semibold text-brand-600 mb-2">Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-white border border-slate-300 text-slate-800 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              placeholder="User name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-600 mb-2">Email</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-white border border-slate-300 text-slate-800 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              placeholder="User email"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-600 mb-2">Password</label>
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-white border border-slate-300 text-slate-800 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              placeholder="New password (optional)"
              type="password"
            />
          </div>

          <div className="flex gap-4 justify-center pt-2">
            <button
              onClick={handleUpdate}
              className="bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white font-bold px-6 py-2 rounded-md"
            >
              Save Changes
            </button>
            <button
              onClick={cancelEdit}
              className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-6 py-2 rounded-md"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* User List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map(user => (
          <div
            key={user._id}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-md space-y-2"
          >
            <p className="text-brand-600 font-semibold">Name: <span className="text-slate-900">{user.name}</span></p>
            <p className="text-brand-600 font-semibold">Email: <span className="text-slate-900">{user.email}</span></p>
            <p className="text-brand-600 font-semibold">Role: <span className="text-slate-900 capitalize">{user.role}</span></p>

            <div className="flex gap-3 pt-3">
              <button
                onClick={() => handleEditClick(user)}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1 rounded-md text-sm"
              >
                Edit
              </button>
              {/* <button
                onClick={() => handleIdcardClick(user)}
                className="bg-green-600 hover:bg-green-500 text-white px-4 py-1 rounded-md text-sm"
              >
                Edit
              </button> */}
              <button
                onClick={() => handleDelete(user._id)}
                className="bg-red-600 hover:bg-red-500 text-white px-4 py-1 rounded-md text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditUser;