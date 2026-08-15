import React, { useContext, useState } from 'react';
import { authAxios } from '../../utils/authAxios';
import { toast } from 'react-toastify';

const AddCourse = () => {
    const [course, setCourse] = useState('');
    const [thumbnail, setThumbnail] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [duration, setDuration] = useState('');
    const [price, setPrice] = useState('');
    const [discount, setDiscount] = useState('');
    const [jobs, setJobs] = useState([]);
    const [jobInput, setJobInput] = useState('');
    const [isPopular, setIsPopular] = useState(false);
    const [courseType, setCourseType] = useState('');

    const { accessToken } = useContext(AuthContext);

    const api = authAxios(() => accessToken);

    const handleAddJob = () => {
        if (jobInput.trim()) {
            setJobs([...jobs, jobInput]);
            setJobInput('');
        }
    };

    const handleSubmit = async () => {
        if (
            !course.trim() ||
            !thumbnail.trim() ||
            !title.trim() ||
            !description.trim() ||
            !duration.trim() ||
            !price.trim() ||
            !discount.trim() ||
            !courseType.trim() ||
            jobs.length === 0
        ) {
            toast.error('Please fill out all fields and add at least one job role.');
            return;
        }

        const courseData = {
            course,
            thumbnail,
            title,
            description,
            duration,
            price,
            discount,
            courseType,
            jobs,
            isPopular,
        };

        try {
            const res = await api.post(
                `${import.meta.env.VITE_API_URL || 'https://code-and-class.onrender.com/api'}/courses`,
                courseData
            );

            toast.success('Course successfully saved!');

            // Reset form
            setCourse('');
            setThumbnail('');
            setTitle('');
            setDescription('');
            setDuration('');
            setPrice('');
            setDiscount('');
            setCourseType('');
            setJobs([]);
            setJobInput('');
            setIsPopular(false);
        } catch (err) {
            console.error('Error:', err);
            toast.error(`Error: ${err.message}`);
        }
    };

    return (
        <div className="min-h-screen bg-white text-slate-800 px-4 md:px-10 lg:px-20 py-12 relative top-16">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 text-brand-600">
                Add New Course
            </h1>

            <div className="bg-white p-6 rounded-xl border border-slate-200 max-w-3xl mx-auto shadow-lg space-y-6">
                {/* Course Slug */}
                <div>
                    <label className="block text-sm font-semibold text-brand-600 mb-2">Course Slug (URL)</label>
                    <input
                        required
                        type="text"
                        value={course}
                        onChange={(e) => setCourse(e.target.value)}
                        placeholder="e.g., react-for-beginners"
                        className="w-full px-4 py-2 rounded-md bg-white border border-slate-300 text-slate-800 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    />
                </div>

                {/* Thumbnail */}
                <div>
                    <label className="block text-sm font-semibold text-brand-600 mb-2">Thumbnail URL</label>
                    <input
                        required
                        type="text"
                        value={thumbnail}
                        onChange={(e) => setThumbnail(e.target.value)}
                        placeholder="Paste image URL here"
                        className="w-full px-4 py-2 rounded-md bg-white border border-slate-300 text-slate-800 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    />
                </div>

                {/* Title */}
                <div>
                    <label className="block text-sm font-semibold text-brand-600 mb-2">Course Title</label>
                    <input
                        required
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., React for Beginners"
                        className="w-full px-4 py-2 rounded-md bg-white border border-slate-300 text-slate-800 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-semibold text-brand-600 mb-2">Course Description</label>
                    <textarea
                        required
                        rows="4"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Write the course details here..."
                        className="w-full px-4 py-2 rounded-md bg-white border border-slate-300 text-slate-800 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 resize-none"
                    />
                </div>

                {/* Duration */}
                <div>
                    <label className="block text-sm font-semibold text-brand-600 mb-2">Duration</label>
                    <input
                        required
                        type="text"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        placeholder="e.g., 6 weeks"
                        className="w-full px-4 py-2 rounded-md bg-white border border-slate-300 text-slate-800 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    />
                </div>

                {/* Price and Discount */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-semibold text-brand-600 mb-2">Price</label>
                        <input
                            required
                            type="text"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="e.g., ₹4999"
                            className="w-full px-4 py-2 rounded-md bg-white border border-slate-300 text-slate-800 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-semibold text-brand-600 mb-2">Discount</label>
                        <input
                            required
                            type="text"
                            value={discount}
                            onChange={(e) => setDiscount(e.target.value)}
                            placeholder="e.g., 50%"
                            className="w-full px-4 py-2 rounded-md bg-white border border-slate-300 text-slate-800 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                        />
                    </div>
                </div>

                {/* Course Type */}
                <div>
                    <label className="block text-sm font-semibold text-brand-600 mb-2">
                        Course Type
                    </label>

                    <select
                        value={courseType}
                        onChange={(e) => setCourseType(e.target.value)}
                        className="
            w-full px-4 py-2 rounded-md
            bg-white
            border border-slate-300
            text-slate-800
            outline-none
            focus:border-brand-500
            focus:ring-1
            focus:ring-brand-500
            cursor-pointer
        "
                    >
                        <option value="">
                            Select Course Type
                        </option>

                        <option value="only-online">
                            Only Online
                        </option>

                        <option value="online-offline">
                            Online and Offline
                        </option>

                        <option value="only-offline">
                            Only Offline
                        </option>

                    </select>
                </div>

                {/* Popular Course Toggle */}
                <div className="flex items-center justify-between bg-white border border-slate-300 rounded-md px-4 py-3">
                    <span className="text-sm font-semibold text-brand-600">
                        Mark as Popular Course
                    </span>

                    <button
                        type="button"
                        onClick={() => setIsPopular((prev) => !prev)}
                        className={`w-14 h-7 flex items-center rounded-full p-1 transition-colors
      ${isPopular ? 'bg-brand-600' : 'bg-slate-300'}`}
                    >
                        <span
                            className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform
        ${isPopular ? 'translate-x-7' : 'translate-x-0'}`}
                        />
                    </button>
                </div>

                {/* Job Roles */}
                <div>
                    <label className="block text-sm font-semibold text-brand-600 mb-2">Job Roles</label>
                    <div className="flex gap-2 mb-3">
                        <input
                            required
                            type="text"
                            value={jobInput}
                            onChange={(e) => setJobInput(e.target.value)}
                            placeholder="e.g., Frontend Developer - Fresher"
                            className="flex-1 px-4 py-2 rounded-md bg-white border border-slate-300 text-slate-800 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                        />
                        <button
                            onClick={handleAddJob}
                            className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-md font-semibold"
                        >
                            Add
                        </button>
                    </div>
                    <ul className="list-disc list-inside text-slate-600 space-y-1">
                        {jobs.map((job, idx) => (
                            <li key={idx}>{job}</li>
                        ))}
                    </ul>
                </div>

                {/* Submit Button */}
                <div className="text-center pt-4">
                    <button
                        onClick={handleSubmit}
                        className="bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white font-bold px-8 py-2 rounded-md transition-all"
                    >
                        Submit Course
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddCourse;