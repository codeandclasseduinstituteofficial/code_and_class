import React, { useEffect, useRef, useState } from "react";
import { Zoom } from "react-awesome-reveal";

const Gallery = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    // Counter states
    const [photoCount, setPhotoCount] = useState(0);
    const [eventCount, setEventCount] = useState(0);
    const [studentCount, setStudentCount] = useState(0);

    const statsRef = useRef(null);
    const hasAnimated = useRef(false);

    // Fetch gallery images
    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL || "https://codeandclass.onrender.com/api"}/gallery`
                );
                const data = await res.json();
                setImages(data);
            } catch (err) {
                console.error("Error fetching gallery:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchGallery();
    }, []);

    // Counter animation
    const animateCounter = (target, setter) => {
        const duration = 1500;
        const steps = 60;
        const increment = target / steps;

        let current = 0;
        let step = 0;

        const timer = setInterval(() => {
            step++;
            current += increment;

            if (step >= steps) {
                setter(target);
                clearInterval(timer);
            } else {
                setter(Math.floor(current));
            }
        }, duration / steps);
    };

    // Start animation when stats become visible
    useEffect(() => {
        if (images.length === 0) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;

                    animateCounter(images.length, setPhotoCount);
                    animateCounter(50, setEventCount);
                    animateCounter(1000, setStudentCount);
                }
            },
            { threshold: 0.3 }
        );

        if (statsRef.current) {
            observer.observe(statsRef.current);
        }

        return () => observer.disconnect();
    }, [images]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white relative top-16">

            {/* Hero */}
            <section className="py-20 px-6 text-center">
                <span className="inline-block bg-brand-100 text-brand-600 px-4 py-1 rounded-full text-sm font-semibold mb-4">
                    📸 Code and Class Gallery
                </span>

                <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900">
                    Moments That{" "}
                    <span className="relative inline-block text-brand-600">
                        Inspire

                        <svg
                            className="absolute left-0 top-full mt-1 w-full h-3"
                            viewBox="0 0 100 10"
                            preserveAspectRatio="none"
                        >
                            <path
                                d="M0 8 Q50 0 100 8"
                                stroke="currentColor"
                                strokeWidth="2"
                                fill="transparent"
                                className="text-accent-400"
                            />
                        </svg>
                    </span>
                </h1>

                <p className="max-w-2xl mx-auto mt-6 text-slate-500 text-lg">
                    Explore our workshops, classrooms, student achievements,
                    certifications, campus life, and unforgettable memories.
                </p>
            </section>

            {/* Animated Stats */}
            <section ref={statsRef} className="max-w-6xl mx-auto px-6 mb-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    <div className="bg-white rounded-3xl shadow-lg p-8 text-center hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
                        <h2 className="text-5xl font-extrabold text-brand-600">
                            {photoCount}+
                        </h2>
                        <p className="mt-3 text-slate-500 font-medium">
                            Gallery Photos
                        </p>
                    </div>

                    <div className="bg-white rounded-3xl shadow-lg p-8 text-center hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
                        <h2 className="text-5xl font-extrabold text-brand-600">
                            {eventCount}+
                        </h2>
                        <p className="mt-3 text-slate-500 font-medium">
                            Events Conducted
                        </p>
                    </div>

                    <div className="bg-white rounded-3xl shadow-lg p-8 text-center hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
                        <h2 className="text-5xl font-extrabold text-brand-600">
                            {studentCount.toLocaleString()}+
                        </h2>
                        <p className="mt-3 text-slate-500 font-medium">
                            Happy Students
                        </p>
                    </div>

                </div>
            </section>

            {/* Gallery */}
            <section className="max-w-7xl mx-auto px-6 pb-24">

                {loading ? (
                    <div className="text-center text-slate-500 text-lg">
                        Loading Gallery...
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

                        {images.map((img, index) => (
                            <Zoom key={index} triggerOnce>

                                <div className="group relative overflow-hidden rounded-3xl shadow-xl bg-white cursor-pointer">

                                    <img
                                        src={img.imageUrl}
                                        alt={`Gallery ${index + 1}`}
                                        loading="lazy"
                                        className="w-full h-80 object-cover transition-all duration-700 group-hover:scale-110"
                                    />

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end">

                                        <div className="p-6 text-white">

                                            <h3 className="text-xl font-bold">
                                                Code and Class
                                            </h3>

                                            <p className="text-sm text-slate-200 mt-1">
                                                Learning • Innovation • Success
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            </Zoom>
                        ))}

                    </div>
                )}

            </section>

        </div>
    );
};

export default Gallery;