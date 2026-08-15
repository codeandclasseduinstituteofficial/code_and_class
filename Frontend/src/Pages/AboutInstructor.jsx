import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Img from "../assets/asifpic.jpeg";

import {
    FaGraduationCap,
    FaAward,
    FaChalkboardTeacher,
    FaLaptopCode,
    FaArrowRight,
    FaUserGraduate,
    FaBookOpen,
    FaBriefcase,
    FaGlobeAsia,
    FaCertificate,
    FaClock,
    FaEnvelope,
    FaPhoneAlt,
    FaWhatsapp,
} from "react-icons/fa";
import axios from "axios";

const stats = [
    {
        icon: <FaUserGraduate />,
        number: "5000+",
        title: "Students Trained",
        color: "text-blue-600",
        bg: "bg-blue-50",
    },
    {
        icon: <FaBookOpen />,
        number: "50+",
        title: "Professional Courses",
        color: "text-cyan-600",
        bg: "bg-cyan-50",
    },
    {
        icon: <FaAward />,
        number: "12+",
        title: "Years Experience",
        color: "text-amber-500",
        bg: "bg-amber-50",
    },
    {
        icon: <FaBriefcase />,
        number: "1000+",
        title: "Career Guidance",
        color: "text-emerald-600",
        bg: "bg-emerald-50",
    },
    {
        icon: <FaChalkboardTeacher />,
        number: "98%",
        title: "Student Success",
        color: "text-purple-600",
        bg: "bg-purple-50",
    },
    {
        icon: <FaGlobeAsia />,
        number: "24/7",
        title: "Learning Support",
        color: "text-pink-600",
        bg: "bg-pink-50",
    },
];

const features = [
    {
        icon: <FaLaptopCode />,
        title: "Industry-Oriented Curriculum",
        description:
            "Our courses are designed with real-world projects, practical assignments, and current industry standards.",
    },
    {
        icon: <FaChalkboardTeacher />,
        title: "Experienced Trainers",
        description:
            "Learn from passionate educators and industry professionals who provide personal guidance and mentorship.",
    },
    {
        icon: <FaBriefcase />,
        title: "Career Support",
        description:
            "Resume building, interview preparation, communication skills, and placement guidance for every learner.",
    },
    {
        icon: <FaCertificate />,
        title: "Recognized Certifications",
        description:
            "Earn certificates that showcase your skills and strengthen your academic and professional profile.",
    },
    {
        icon: <FaClock />,
        title: "Flexible Learning",
        description:
            "Weekend, weekday, online, and offline batches designed to fit every student's schedule.",
    },
    {
        icon: <FaUserGraduate />,
        title: "Student-Centered Learning",
        description:
            "Small batch sizes, doubt-solving sessions, individual attention, and continuous progress monitoring.",
    },
];

const API = `${import.meta.env.VITE_API_URL || "https://code-and-class.onrender.com/api"}/supporters`

const AboutInstructor = () => {
    const navigate = useNavigate();

    const [teamMembers, setTeamMembers] = useState([])

    useEffect(() => {
        const fetchSupporters = async () => {
            try {
                const response = await axios.get(API);
                setTeamMembers(response?.data?.data);
            } catch (error) {
                console.error("Failed to fetch supporters:", error);
            }
        };

        fetchSupporters();
    }, []);

    return (
        <main className="bg-slate-50">

            {/* ================= HERO SECTION ================= */}

            <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700 text-white">

                {/* Background */}

                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-400/20 blur-3xl rounded-full"></div>

                    <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-blue-400/20 blur-3xl rounded-full"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-6 lg:px-16 py-28">

                    <div className="text-center">

                        <span className="inline-block px-5 py-2 rounded-full bg-white/10 border border-white/20 uppercase tracking-[4px] text-sm font-semibold backdrop-blur">
                            About Code & Class
                        </span>

                        <h1 className="mt-8 text-5xl md:text-7xl font-black leading-tight">
                            Building Future
                            <span className="block text-cyan-300">
                                Leaders Through Education
                            </span>
                        </h1>

                        <p className="mt-8 max-w-3xl mx-auto text-lg md:text-xl text-slate-200 leading-8">
                            We empower students with practical knowledge, industry skills,
                            confidence, and career-focused education through expert
                            mentorship and innovative learning methods.
                        </p>

                        <div className="mt-12 flex flex-wrap justify-center gap-5">

                            <button onClick={() => navigate('/courses')} className="bg-white text-blue-800 px-8 py-4 rounded-full font-bold hover:scale-105 transition duration-300 shadow-lg">
                                Explore Courses
                            </button>

                            <button onClick={() => navigate('/contact')} className="border border-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-blue-800 transition">
                                Contact Us
                            </button>

                        </div>

                    </div>

                    {/* Hero Statistics */}

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-20">

                        {[
                            {
                                number: "5000+",
                                title: "Students",
                            },
                            {
                                number: "50+",
                                title: "Courses",
                            },
                            {
                                number: "12+",
                                title: "Years Experience",
                            },
                            {
                                number: "98%",
                                title: "Success Rate",
                            },
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 text-center"
                            >
                                <h2 className="text-4xl font-black">
                                    {item.number}
                                </h2>

                                <p className="mt-2 text-slate-200">
                                    {item.title}
                                </p>

                            </div>
                        ))}

                    </div>

                </div>

            </section>

            {/* ===== PART 2 STARTS HERE ===== */}

            {/* ================= DIRECTOR SECTION ================= */}

            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-16">

                    {/* Section Heading */}

                    <div className="text-center mb-16">

                        <span className="inline-block px-5 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold uppercase tracking-[3px] text-sm">
                            Meet Our Founder
                        </span>

                        <h2 className="mt-6 text-4xl md:text-5xl font-extrabold text-slate-900">
                            The Vision Behind
                            <span className="text-blue-700"> Code & Class</span>
                        </h2>

                        <p className="mt-6 max-w-3xl mx-auto text-slate-600 text-lg leading-8">
                            Passionate about transforming education through practical learning,
                            modern technology, and career-focused training.
                        </p>

                    </div>

                    {/* Main Grid */}

                    <div className="grid lg:grid-cols-2 gap-20 items-center">

                        {/* Left Image */}

                        <div className="relative flex justify-center">

                            <div className="relative">

                                <img
                                    src={Img}
                                    alt="Mohammed Asif Khan"
                                    className="w-full max-w-md rounded-3xl shadow-2xl object-cover"
                                />

                                {/* Experience Card */}

                                <div className="absolute -bottom-8 -left-8 bg-white rounded-2xl shadow-xl px-8 py-6 border">

                                    <h3 className="text-4xl font-black text-blue-700">
                                        12+
                                    </h3>

                                    <p className="mt-1 text-slate-600 font-medium">
                                        Years of Teaching Experience
                                    </p>

                                </div>

                            </div>

                        </div>

                        {/* Right Content */}

                        <div>

                            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-50 text-blue-700 font-semibold">
                                Founder & Director
                            </span>

                            <h2 className="mt-6 text-5xl font-black text-slate-900">
                                Mohammed
                                <span className="text-blue-700"> Asif Khan</span>
                            </h2>

                            <p className="mt-3 text-xl font-semibold text-slate-600">
                                Educator • Spoken English Trainer • Career Mentor • Technology
                                Enthusiast
                            </p>

                            <p className="mt-8 text-slate-600 leading-8 text-lg">
                                Mohammed Asif Khan is the Founder and Director of Code & Class
                                Educational Institute. With over a decade of teaching
                                experience, he has dedicated his career to empowering students
                                with practical skills, communication confidence, and
                                career-oriented education.
                            </p>

                            <p className="mt-6 text-slate-600 leading-8 text-lg">
                                His vision is to bridge the gap between traditional education
                                and industry requirements by providing modern, affordable, and
                                skill-based learning for students, professionals, and job
                                seekers.
                            </p>

                            {/* Information Cards */}

                            <div className="grid sm:grid-cols-2 gap-6 mt-10">

                                <div className="p-6 rounded-2xl bg-slate-50 border hover:shadow-lg transition">

                                    <FaGraduationCap className="text-3xl text-blue-700" />

                                    <h3 className="mt-4 text-xl font-bold text-slate-900">
                                        Academic Excellence
                                    </h3>

                                    <p className="mt-3 text-slate-600 leading-7">
                                        Dedicated to quality education through practical teaching
                                        methods and continuous student engagement.
                                    </p>

                                </div>

                                <div className="p-6 rounded-2xl bg-slate-50 border hover:shadow-lg transition">

                                    <FaAward className="text-3xl text-blue-700" />

                                    <h3 className="mt-4 text-xl font-bold text-slate-900">
                                        Award Winning Mentor
                                    </h3>

                                    <p className="mt-3 text-slate-600 leading-7">
                                        Recognized for excellence in teaching, student mentorship,
                                        and educational leadership.
                                    </p>

                                </div>

                                <div className="p-6 rounded-2xl bg-slate-50 border hover:shadow-lg transition">

                                    <FaLaptopCode className="text-3xl text-blue-700" />

                                    <h3 className="mt-4 text-xl font-bold text-slate-900">
                                        Technology Expert
                                    </h3>

                                    <p className="mt-3 text-slate-600 leading-7">
                                        Passionate about AI, programming, web development, and
                                        digital education.
                                    </p>

                                </div>

                                <div className="p-6 rounded-2xl bg-slate-50 border hover:shadow-lg transition">

                                    <FaChalkboardTeacher className="text-3xl text-blue-700" />

                                    <h3 className="mt-4 text-xl font-bold text-slate-900">
                                        Student Mentor
                                    </h3>

                                    <p className="mt-3 text-slate-600 leading-7">
                                        Helping students build confidence, communication skills,
                                        and successful careers.
                                    </p>

                                </div>

                            </div>

                            {/* Skills */}

                            <div className="mt-12">

                                <h3 className="text-2xl font-bold text-slate-900 mb-6">
                                    Core Expertise
                                </h3>

                                <div className="flex flex-wrap gap-4">

                                    {[
                                        "Spoken English",
                                        "Public Speaking",
                                        "Computer Education",
                                        "Artificial Intelligence",
                                        "Web Development",
                                        "Career Guidance",
                                        "Leadership",
                                        "Student Mentorship",
                                    ].map((skill, index) => (

                                        <span
                                            key={index}
                                            className="px-5 py-3 rounded-full bg-blue-50 text-blue-700 font-semibold"
                                        >
                                            {skill}
                                        </span>

                                    ))}

                                </div>

                            </div>

                            {/* Buttons */}

                            <div className="mt-12 flex flex-wrap gap-5">

                                <button onClick={() => navigate('/courses')} className="bg-blue-700 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-800 transition flex items-center gap-3">
                                    View Courses
                                    <FaArrowRight />
                                </button>

                                <button onClick={() => navigate('/contact')} className="border border-blue-700 text-blue-700 px-8 py-4 rounded-full font-semibold hover:bg-blue-700 hover:text-white transition">
                                    Contact Director
                                </button>

                            </div>

                        </div>

                    </div>

                </div>
            </section>

            {/* ===== PART 3 STARTS HERE ===== */}
            {/* ================= STATS SECTION ================= */}

            <section className="py-24 bg-slate-50">

                <div className="max-w-7xl mx-auto px-6 lg:px-16">

                    {/* Heading */}

                    <div className="text-center mb-16">

                        <span className="inline-block px-5 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold uppercase tracking-[3px] text-sm">
                            Our Achievements
                        </span>

                        <h2 className="mt-6 text-4xl md:text-5xl font-extrabold text-slate-900">
                            Numbers That
                            <span className="text-blue-700"> Speak Success</span>
                        </h2>

                        <p className="mt-6 max-w-3xl mx-auto text-lg text-slate-600 leading-8">
                            Every milestone reflects our commitment to quality education,
                            practical learning, and helping students achieve their academic
                            and professional goals.
                        </p>

                    </div>

                    {/* Statistics Grid */}

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">

                        {stats.map((item, index) => (

                            <div
                                key={index}
                                className="group bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-2 transition duration-300"
                            >

                                <div
                                    className={`w-16 h-16 rounded-2xl ${item.bg} flex items-center justify-center text-3xl ${item.color}`}
                                >
                                    {item.icon}
                                </div>

                                <h3 className="mt-8 text-5xl font-black text-slate-900">
                                    {item.number}
                                </h3>

                                <p className="mt-3 text-lg font-semibold text-slate-700">
                                    {item.title}
                                </p>

                                <div className="mt-6 h-1 w-14 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 group-hover:w-28 transition-all duration-500"></div>

                            </div>

                        ))}

                    </div>

                    {/* ===== Part 3B Starts Here ===== */}
                    {/* Bottom Banner */}

                    <div className="mt-20 rounded-[30px] bg-gradient-to-r from-blue-700 via-blue-800 to-cyan-700 text-white p-10 lg:p-14 shadow-xl">

                        <div className="grid lg:grid-cols-2 gap-10 items-center">

                            {/* Left Content */}

                            <div>

                                <h3 className="text-3xl md:text-4xl font-bold">
                                    Excellence Through Practical Education
                                </h3>

                                <p className="mt-5 text-slate-200 leading-8 text-lg">
                                    At Code & Class Educational Institute, every student receives
                                    personalized guidance, industry-focused training, and practical
                                    experience to build confidence and achieve long-term career
                                    success.
                                </p>

                            </div>

                            {/* Right Statistics */}

                            <div className="grid grid-cols-2 gap-6">

                                <div className="bg-white/10 rounded-2xl p-6 text-center backdrop-blur">

                                    <h4 className="text-4xl font-black">
                                        12+
                                    </h4>

                                    <p className="mt-2 text-slate-200">
                                        Years of Excellence
                                    </p>

                                </div>

                                <div className="bg-white/10 rounded-2xl p-6 text-center backdrop-blur">

                                    <h4 className="text-4xl font-black">
                                        5000+
                                    </h4>

                                    <p className="mt-2 text-slate-200">
                                        Happy Students
                                    </p>

                                </div>

                                <div className="bg-white/10 rounded-2xl p-6 text-center backdrop-blur">

                                    <h4 className="text-4xl font-black">
                                        50+
                                    </h4>

                                    <p className="mt-2 text-slate-200">
                                        Professional Courses
                                    </p>

                                </div>

                                <div className="bg-white/10 rounded-2xl p-6 text-center backdrop-blur">

                                    <h4 className="text-4xl font-black">
                                        98%
                                    </h4>

                                    <p className="mt-2 text-slate-200">
                                        Success Rate
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

            {/* ===== PART 4 STARTS HERE ===== */}
            {/* ================= WHY CHOOSE US ================= */}

            <section className="py-24 bg-white">

                <div className="max-w-7xl mx-auto px-6 lg:px-16">

                    {/* Heading */}

                    <div className="text-center max-w-3xl mx-auto mb-16">

                        <span className="inline-block px-5 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold uppercase tracking-[3px] text-sm">
                            Why Choose Us
                        </span>

                        <h2 className="mt-6 text-4xl md:text-5xl font-extrabold text-slate-900">
                            Learn Smarter.
                            <span className="text-blue-700"> Build Your Future.</span>
                        </h2>

                        <p className="mt-6 text-lg text-slate-600 leading-8">
                            At Code & Class Educational Institute, we combine quality
                            education, practical training, and career guidance to help every
                            student achieve success with confidence.
                        </p>

                    </div>

                    {/* Content */}

                    <div className="grid lg:grid-cols-2 gap-16 items-center">

                        {/* Left Side */}

                        <div>

                            <h3 className="text-3xl font-bold text-slate-900 leading-tight">
                                More Than an Institute —
                                <span className="block text-blue-700">
                                    A Place to Build Your Career
                                </span>
                            </h3>

                            <p className="mt-6 text-slate-600 text-lg leading-8">
                                We believe education should prepare students for real life.
                                Our learning approach focuses on practical skills,
                                confidence-building, communication, technology, and career
                                readiness.
                            </p>

                            {/* Benefits */}

                            <div className="mt-10 space-y-6">

                                {[
                                    "Personal Attention for Every Student",
                                    "Practical Hands-on Learning",
                                    "Affordable Course Fees",
                                    "Friendly Learning Environment",
                                    "Online & Offline Classes",
                                    "Continuous Student Support",
                                ].map((item, index) => (

                                    <div
                                        key={index}
                                        className="flex items-start gap-4"
                                    >

                                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 font-bold shrink-0">
                                            ✓
                                        </div>

                                        <div>

                                            <h4 className="font-bold text-slate-900">
                                                {item}
                                            </h4>

                                            <p className="text-slate-500 mt-1">
                                                Quality education designed to help students succeed.
                                            </p>

                                        </div>

                                    </div>

                                ))}

                            </div>

                            {/* Button */}

                            <button onClick={() => navigate('/')} className="mt-10 bg-blue-700 hover:bg-blue-800 text-white px-8 py-4 rounded-full font-semibold flex items-center gap-3 transition">
                                Explore Programs
                                <FaArrowRight />
                            </button>

                        </div>

                        {/* ===== Part 4B Starts Here ===== */}
                        {/* Right Side */}

                        <div className="grid sm:grid-cols-2 gap-6">

                            {features.map((feature, index) => (

                                <div
                                    key={index}
                                    className="group bg-slate-50 border border-slate-200 rounded-3xl p-8 hover:shadow-xl hover:-translate-y-2 transition duration-300"
                                >

                                    <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center text-3xl">
                                        {feature.icon}
                                    </div>

                                    <h3 className="mt-6 text-xl font-bold text-slate-900">
                                        {feature.title}
                                    </h3>

                                    <p className="mt-4 text-slate-600 leading-7">
                                        {feature.description}
                                    </p>

                                    <div className="mt-6 h-1 w-14 rounded-full bg-gradient-to-r from-blue-700 to-cyan-500 group-hover:w-24 transition-all duration-500"></div>

                                </div>

                            ))}

                        </div>

                    </div>

                </div>

            </section>

            {/* ===== PART 5 STARTS HERE ===== */}
            {/* ================= TEAM SECTION ================= */}

            <section className="py-24 bg-slate-50">

                <div className="max-w-7xl mx-auto px-6 lg:px-16">

                    {/* Heading */}

                    <div className="text-center max-w-3xl mx-auto mb-16">

                        <span className="inline-block px-5 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold uppercase tracking-[3px] text-sm">
                            Meet Our Team
                        </span>

                        <h2 className="mt-6 text-4xl md:text-5xl font-extrabold text-slate-900">
                            The People Behind
                            <span className="text-blue-700"> Every Success Story</span>
                        </h2>

                        <p className="mt-6 text-lg text-slate-600 leading-8">
                            Our dedicated educators, mentors, and support staff work together
                            to provide an outstanding learning experience for every student.
                        </p>

                    </div>

                    {/* Team Grid */}

                    <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-8">

                        {teamMembers?.map((member, index) => (

                            <div
                                key={index}
                                className="group bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-2xl hover:-translate-y-3 transition duration-500"
                            >

                                {/* Image */}

                                <div className="relative">

                                    <img
                                        src={member?.imgLink}
                                        alt={member?.name}
                                        className="w-full h-80 object-cover group-hover:scale-105 transition duration-500"
                                    />

                                    {/* Overlay */}

                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent"></div>

                                </div>

                                {/* Content */}

                                <div className="p-7">

                                    <h3 className="text-2xl font-bold text-slate-900">
                                        {member?.name}
                                    </h3>

                                    <span className="inline-block mt-3 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
                                        {member?.designation}
                                    </span>

                                    <p className="mt-5 text-slate-600 leading-7">
                                        {member?.description}
                                    </p>

                                    {/* Divider */}

                                    <div className="mt-6 h-px bg-slate-200"></div>

                                    {/* Social Icons */}

                                    <div className="flex justify-center gap-4 mt-6">

                                        <button
                                            onClick={() => {
                                                window.location.href = "mailto:asifsir@codeandclass.com";
                                            }}
                                            className="w-11 h-11 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-700 hover:text-white transition"
                                        >
                                            <FaEnvelope className="mx-auto mt-3" />
                                        </button>

                                        <button onClick={() => navigate('/contact')} className="w-11 h-11 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-700 hover:text-white transition">
                                            <FaPhoneAlt className="mx-auto mt-3" />
                                        </button>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                    {/* ===== PART 5B STARTS HERE ===== */}
                    {/* Bottom Banner */}

                    <div className="mt-20 bg-gradient-to-r from-blue-700 to-cyan-600 rounded-[32px] p-10 lg:p-14 text-white">

                        <div className="grid lg:grid-cols-2 gap-10 items-center">

                            {/* Left Content */}

                            <div>

                                <h3 className="text-3xl md:text-4xl font-bold">
                                    Learning Begins With Great Teachers
                                </h3>

                                <p className="mt-5 text-blue-100 leading-8 text-lg">
                                    Our faculty members combine academic excellence with
                                    real-world experience to help students become confident
                                    professionals and lifelong learners.
                                </p>

                            </div>

                            {/* Right Statistics */}

                            <div className="grid grid-cols-2 gap-6">

                                <div className="bg-white/10 rounded-2xl p-6 text-center backdrop-blur">

                                    <h4 className="text-4xl font-black">
                                        10+
                                    </h4>

                                    <p className="mt-2 text-blue-100">
                                        Expert Trainers
                                    </p>

                                </div>

                                <div className="bg-white/10 rounded-2xl p-6 text-center backdrop-blur">

                                    <h4 className="text-4xl font-black">
                                        12+
                                    </h4>

                                    <p className="mt-2 text-blue-100">
                                        Years Experience
                                    </p>

                                </div>

                                <div className="bg-white/10 rounded-2xl p-6 text-center backdrop-blur">

                                    <h4 className="text-4xl font-black">
                                        5000+
                                    </h4>

                                    <p className="mt-2 text-blue-100">
                                        Students Guided
                                    </p>

                                </div>

                                <div className="bg-white/10 rounded-2xl p-6 text-center backdrop-blur">

                                    <h4 className="text-4xl font-black">
                                        98%
                                    </h4>

                                    <p className="mt-2 text-blue-100">
                                        Success Rate
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

            {/* ===== PART 6 STARTS HERE ===== */}
            {/* ================= CTA SECTION ================= */}

            <section className="py-24 bg-white">

                <div className="max-w-7xl mx-auto px-6 lg:px-16">

                    <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-700 text-white">

                        {/* Decorative Background */}

                        <div className="absolute -top-24 -left-24 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>

                        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl"></div>

                        <div className="relative z-10 px-8 py-16 md:px-16 md:py-20 text-center">

                            <span className="inline-block px-5 py-2 rounded-full bg-white/10 border border-white/20 uppercase tracking-[3px] text-sm font-semibold">
                                Join Code & Class
                            </span>

                            <h2 className="mt-8 text-4xl md:text-6xl font-black leading-tight">
                                Your Future Starts
                                <span className="block text-cyan-300">
                                    With One Decision
                                </span>
                            </h2>

                            <p className="mt-8 max-w-3xl mx-auto text-lg leading-8 text-slate-200">
                                Whether you're a student, job seeker, or working professional,
                                our practical courses and expert mentors will help you achieve
                                your academic and career goals.
                            </p>

                            {/* Buttons */}

                            <div className="flex flex-wrap justify-center gap-5 mt-12">

                                <button onClick={() => navigate('/courses')} className="bg-white text-blue-800 px-8 py-4 rounded-full font-bold flex items-center gap-3 hover:scale-105 transition">
                                    Explore Courses
                                    <FaArrowRight />
                                </button>

                                <button onClick={() => navigate('/contact')} className="border border-white px-8 py-4 rounded-full font-semibold flex items-center gap-3 hover:bg-white hover:text-blue-800 transition">
                                    <FaPhoneAlt />
                                    Contact Us
                                </button>

                                <button
                                    onClick={() =>
                                        window.open(
                                            "https://www.whatsapp.com/channel/0029VbBQoOTCHDyr0cD8Jr3j",
                                            "_blank"
                                        )
                                    }
                                    className="bg-green-500 hover:bg-green-600 px-8 py-4 rounded-full font-semibold flex items-center gap-3 transition"
                                >
                                    <FaWhatsapp />
                                    WhatsApp
                                </button>

                            </div>

                            {/* Statistics */}

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">

                                {[
                                    {
                                        number: "5000+",
                                        title: "Students",
                                    },
                                    {
                                        number: "50+",
                                        title: "Courses",
                                    },
                                    {
                                        number: "12+",
                                        title: "Years",
                                    },
                                    {
                                        number: "98%",
                                        title: "Success",
                                    },
                                ].map((item, index) => (

                                    <div
                                        key={index}
                                        className="bg-white/10 rounded-2xl p-6 backdrop-blur"
                                    >

                                        <h3 className="text-4xl font-black">
                                            {item.number}
                                        </h3>

                                        <p className="mt-2 text-slate-200">
                                            {item.title}
                                        </p>

                                    </div>

                                ))}

                            </div>

                        </div>

                    </div>

                </div>

            </section>

        </main>
    );
};

export default AboutInstructor;