import React, { useEffect, useState } from "react";
import { FaChevronLeft, FaUserEdit, FaCalendarAlt } from "react-icons/fa";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const toEmbedUrl = (url) => {
    if (!url) return url;
    if (url.includes("watch?v=")) return url.replace("watch?v=", "embed/");
    return url;
};

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        fetch(`${API_BASE}/blogs`)
            .then((res) => res.json())
            .then((data) => setBlogs(data.data || []))
            .catch(() => setBlogs([]))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-5 md:p-10 mt-10">
            <div className="max-w-5xl mx-auto">

                {!selected && (
                    <>
                        <h1 className="text-4xl font-bold text-center">Blog</h1>
                        <p className="text-center text-gray-500 mt-3">
                            Tips, updates, and stories from Code and Class.
                        </p>

                        {loading ? (
                            <p className="text-center text-gray-500 mt-10">Loading...</p>
                        ) : blogs.length === 0 ? (
                            <p className="text-center text-gray-500 mt-10">No posts yet. Check back soon.</p>
                        ) : (
                            <div className="grid md:grid-cols-2 gap-6 mt-10">
                                {blogs.map((blog) => (
                                    <button
                                        key={blog._id}
                                        onClick={() => setSelected(blog)}
                                        className="bg-white shadow rounded-2xl overflow-hidden text-left hover:shadow-lg transition border"
                                    >
                                        {blog.imageUrl && (
                                            <img
                                                src={blog.imageUrl}
                                                alt={blog.title}
                                                className="w-full h-44 object-cover"
                                            />
                                        )}
                                        <div className="p-6">
                                            <h2 className="text-xl font-bold">{blog.title}</h2>
                                            <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                                                {blog.summary || blog.content}
                                            </p>
                                            <div className="flex items-center gap-4 text-xs text-gray-400 mt-4">
                                                <span className="flex items-center gap-1"><FaUserEdit /> {blog.author}</span>
                                                <span className="flex items-center gap-1">
                                                    <FaCalendarAlt /> {new Date(blog.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {selected && (
                    <div>
                        <button
                            onClick={() => setSelected(null)}
                            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6"
                        >
                            <FaChevronLeft /> All posts
                        </button>

                        <div className="bg-white rounded-3xl shadow p-6 md:p-8">
                            {selected.imageUrl && (
                                <img
                                    src={selected.imageUrl}
                                    alt={selected.title}
                                    className="w-full max-h-96 object-cover rounded-2xl mb-6"
                                />
                            )}

                            <h1 className="text-3xl font-bold">{selected.title}</h1>

                            <div className="flex items-center gap-4 text-sm text-gray-400 mt-3">
                                <span className="flex items-center gap-1"><FaUserEdit /> {selected.author}</span>
                                <span className="flex items-center gap-1">
                                    <FaCalendarAlt /> {new Date(selected.createdAt).toLocaleDateString()}
                                </span>
                            </div>

                            <p className="text-gray-700 mt-6 leading-relaxed whitespace-pre-line">
                                {selected.content}
                            </p>

                            {selected.videoUrl && (
                                <div className="mt-8 aspect-video rounded-2xl overflow-hidden bg-black">
                                    <iframe
                                        title="Blog video"
                                        className="w-full h-full"
                                        src={toEmbedUrl(selected.videoUrl)}
                                        allowFullScreen
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Blogs;
