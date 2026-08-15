import React, { useEffect, useRef, useState } from 'react';
import { FaShieldAlt, FaStar, FaUsers, FaCheckCircle } from 'react-icons/fa';

const TrustedBySection = () => {
    const [count, setCount] = useState(0);
    const sectionRef = useRef(null);
    const hasAnimated = useRef(false);
    const target = 25000;

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;
                    animateCounter();
                }
            },
            { threshold: 0.3 }
        );

        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    const animateCounter = () => {
        const duration = 1500;
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        let step = 0;

        const timer = setInterval(() => {
            step++;
            current += increment;
            if (step >= steps) {
                setCount(target);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, duration / steps);
    };

    return (
        <section ref={sectionRef} className="py-16 bg-slate-50 px-4 md:px-10 lg:px-20">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <h2 className="section-heading mb-1">Trusted by Students</h2>
                    <p className="text-slate-500">Real learners, real outcomes</p>
                </div>

                {/* Counter + Trust */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    {/* Counter block */}
                    <div className="card-surface p-8 text-center">
                        <div className="flex justify-center items-baseline gap-2">
                            <span className="text-4xl md:text-5xl font-bold text-slate-900">
                                {count.toLocaleString('en-IN')}
                            </span>
                            <span className="text-lg text-slate-500">+ students</span>
                        </div>
                        <p className="text-slate-500 mt-2">Joined our courses and resources</p>
                    </div>

                    {/* Trust proofs */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2 card-surface p-4 flex items-center">
                            <div className="rounded-full bg-green-50 flex items-center justify-center mr-3 w-13 h-13 shrink-0" style={{ width: 52, height: 52 }}>
                                <FaShieldAlt className="text-green-600 text-xl" />
                            </div>
                            <div>
                                <h6 className="font-semibold text-slate-900 mb-0">Verified Learning Platform</h6>
                                <small className="text-slate-500">Secure content delivery and privacy focused</small>
                            </div>
                        </div>

                        <div className="card-surface p-4 text-center">
                            <FaStar className="text-amber-400 text-2xl mx-auto mb-1" />
                            <div className="font-semibold text-slate-900">4.7/5</div>
                            <small className="text-slate-500">Average rating</small>
                        </div>

                        <div className="card-surface p-4 text-center">
                            <FaUsers className="text-brand-600 text-2xl mx-auto mb-1" />
                            <div className="font-semibold text-slate-900">150k+</div>
                            <small className="text-slate-500">Monthly learners</small>
                        </div>
                    </div>
                </div>

                {/* Social proof row */}
                <div className="text-center mt-8">
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-white rounded-full shadow-sm">
                        <FaCheckCircle className="text-brand-600" />
                        <span className="text-sm text-slate-500">
                            Trusted by schools, coaching institutes, and self-learners
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TrustedBySection;