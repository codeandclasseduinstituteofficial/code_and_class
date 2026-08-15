import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/AuthProvider';
import { authAxios } from '../../utils/authAxios';

const API_BASE = `${import.meta.env.VITE_API_URL || "http://localhost:8080/api"}/courses`;

const CourseManager = () => {
    const [courses, setCourses] = useState([]);
    const [editingCourse, setEditingCourse] = useState(null);
    const { accessToken } = useContext(AuthContext);

    const api = authAxios(() => accessToken);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const res = await fetch(API_BASE);
            const data = await res.json();
            setCourses(data);
        } catch (err) {
            toast.error(err);
        }
    };

    const handleDelete = async (courseId) => {
        if (!window.confirm('Delete this course?')) return;

        try {
            await api.delete(`${API_BASE}/${courseId}`);
            toast.success('Course Deleted Successfully')

            setCourses((prev) =>
                prev.filter((c) => c._id !== courseId)
            );
        } catch (err) {
            console.error('Delete failed:', err);

            toast.error(
                err?.response?.data?.message ||
                'Delete failed'
            );
        }
    };

    const handleUpdate = async (updatedCourse) => {
        try {
            const { data } = await api.put(
                `${API_BASE}/${updatedCourse._id}`,
                updatedCourse
            );

            setCourses((prev) =>
                prev.map((c) =>
                    c._id === data._id ? data : c
                )
            );
            toast.success('Course Updated Successfully')

            setEditingCourse(null);
        } catch (err) {
            console.error('Update failed:', err);

            toast.error(
                err?.response?.data?.message ||
                'Update failed'
            );
        }
    };

    return (
        <div className="min-h-screen bg-white text-slate-800 px-4 md:px-10 py-28">
            <h1 className="text-4xl font-bold text-center text-brand-600 mb-10">
                Manage Courses
            </h1>

            {!editingCourse ? (
                <div className="grid md:grid-cols-2 gap-6">
                    {courses.map((course) => (
                        <CourseCard
                            key={course._id}
                            course={course}
                            onEdit={() => setEditingCourse(course)}
                            onDelete={() => handleDelete(course._id)}
                        />
                    ))}
                </div>
            ) : (
                <EditCourseForm
                    initialData={editingCourse}
                    onCancel={() => setEditingCourse(null)}
                    onSave={handleUpdate}
                />
            )}
        </div>
    );
};

export default CourseManager;

const CourseCard = ({ course, onEdit, onDelete }) => (
    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
        <img src={course.thumbnail} className="h-48 w-full object-cover rounded" />

        <h2 className="text-xl font-bold text-brand-600">
            {course.title}
            {course.isPopular && (
                <span className="ml-2 text-xs bg-brand-600 text-white px-2 py-0.5 rounded-full">
                    Popular
                </span>
            )}
        </h2>

        <p className="text-slate-500 line-clamp-2">{course.description}</p>

        <div className="flex justify-between pt-2">
            <button onClick={onEdit} className="bg-brand-600 px-4 py-1 rounded">
                Edit
            </button>
            <button onClick={onDelete} className="bg-red-600 px-4 py-1 rounded">
                Delete
            </button>
        </div>
    </div>
);

const EditCourseForm = ({ initialData, onSave, onCancel }) => {
    const [formData, setFormData] = useState({ ...initialData });
    const [jobInput, setJobInput] = useState('');

    const togglePopular = () =>
        setFormData((prev) => ({ ...prev, isPopular: !prev.isPopular }));

    return (
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl space-y-5">
            <h2 className="text-xl text-brand-600 font-bold">Edit Course</h2>

            {['title', 'thumbnail', 'duration', 'price', 'discount'].map((f) => (
                <input
                    key={f}
                    value={formData[f]}
                    onChange={(e) =>
                        setFormData({ ...formData, [f]: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-white border border-slate-300 rounded"
                    placeholder={f}
                />
            ))}

            {/* Popular Toggle */}
            <div className="flex justify-between items-center border border-slate-300 p-3 rounded">
                <span className="text-brand-600 font-semibold">Popular Course</span>
                <button
                    onClick={togglePopular}
                    className={`w-14 h-7 rounded-full p-1 ${formData.isPopular ? 'bg-brand-600' : 'bg-slate-300'
                        }`}
                >
                    <div
                        className={`bg-white h-5 w-5 rounded-full transition ${formData.isPopular ? 'translate-x-7' : ''
                            }`}
                    />
                </button>
            </div>

            <div className="flex justify-center gap-4 pt-4">
                <button
                    onClick={() => onSave(formData)}
                    className="bg-brand-600 px-6 py-2 rounded"
                >
                    Save
                </button>
                <button onClick={onCancel} className="bg-red-600 px-6 py-2 rounded">
                    Cancel
                </button>
            </div>
        </div>
    );
};
