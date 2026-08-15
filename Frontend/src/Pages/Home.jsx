import React, { useEffect, useState } from "react";
import { Link, Link as RouterLink } from "react-router-dom";
import {
  FaCode,
  FaChalkboardTeacher,
  FaGraduationCap,
  FaArrowRight,
  FaLaptopCode,
  FaBriefcase,
  FaCertificate,
  FaCheckCircle,
  FaUsers,
} from "react-icons/fa";
import { Link as ScrollLink, Element } from "react-scroll";
import { Fade } from "react-awesome-reveal";
import PartnersScroll from "../components/PartnersScroll";
import SuccessStories from "../components/SuccessStories";
import TrustedBySection from "../components/TrustedBySection";
import axios from "axios";

const CourseCardSkeleton = () => (
  <div className="card-surface h-full flex flex-col overflow-hidden animate-pulse">
    <div className="w-full h-44 bg-slate-200" />
    <div className="px-5 py-4 flex-1 flex flex-col gap-3">
      <div className="h-5 bg-slate-200 rounded w-3/4" />
      <div className="h-3 bg-slate-200 rounded w-full" />
      <div className="h-3 bg-slate-200 rounded w-5/6" />
      <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between">
        <div className="h-5 bg-slate-200 rounded w-16" />
        <div className="h-5 bg-slate-200 rounded w-20" />
      </div>
    </div>
  </div>
);

const tuitionPrograms = [
  {
    title: "Tuition Classes (All Boards)",
    color: "brand",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
    items: [
      "Nursery – 8th (1st Batch)",
      "9th – 10th (Each Batch)",
      "Intermediate – CEC, MPC, BiPC",
    ],
  },
  {
    title: "TOSS (Open School)",
    color: "accent",
    image:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
    items: [
      "10th Class & Intermediate",
      "One Sitting – 5 Subjects",
      "Sunday Classes Available",
    ],
  },
  {
    title: "Intermediate Specializations",
    color: "brand",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
    items: [
      "MPC – Maths, Physics, Chemistry",
      "CEC – Commerce, Economics, Civics",
      "BiPC – Biology, Physics, Chemistry",
    ],
    highlight: true,
  },
  {
    title: "10th Class Support",
    color: "accent",
    image:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80",
    items: [
      "State & CBSE Boards",
      "Doubt Clarification Sessions",
      "Exam-Oriented Preparation",
    ],
  },
  {
    title: "Career Guidance & Counseling",
    color: "brand",
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80",
    items: [
      "Help choosing career paths",
      "Bridge between school & tech",
      "Guidance for Open Schooling",
    ],
    highlight: true,
  },
  {
    title: "Explore All Programs",
    color: "accent",
    image:
      "https://images.unsplash.com/photo-1513258496099-48168024aec0?w=800&q=80",
    items: [
      "Limited Seats Available",
      "Start your Future TODAY!",
      "Personalized Academic Support",
    ],
    highlight: true,
  },
];

const handleEnquireNow = (course) => {

  // Example
  window.location.href = "/contact";
};

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [diplomaCourses, setDiplomaCourses] = useState([]);

  useEffect(() => {
    const fetchPopularCourses = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL || "https://code-and-class.onrender.com/api"}/courses/popular`
        );

        setDiplomaCourses(data);
      } catch (error) {
        console.error("Failed to fetch popular courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularCourses();
  }, []);

  return (
    <>
      <Element name="top" />
      <div className="relative top-16">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-brand-50 via-white to-white px-4 md:px-10 lg:px-20 pt-20 pb-24 md:pt-28 md:pb-32 overflow-hidden">
          {/* Decorative background */}
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-brand-200/30 rounded-full blur-3xl -z-0" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-200/20 rounded-full blur-3xl -z-0" />
          <div
            className="absolute inset-0 -z-0 opacity-[0.15]"
            style={{
              backgroundImage:
                "linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)",
              backgroundSize: "48px 48px",
              maskImage:
                "radial-gradient(ellipse 60% 50% at 50% 0%, black 40%, transparent 100%)",
            }}
          />

          <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: copy */}
            <div className="text-center lg:text-left">
              <span className="inline-flex items-center gap-2 bg-brand-100 text-brand-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-600 animate-pulse" />
                Admissions Open
              </span>

              <h1 className="text-4xl md:text-6xl font-display font-extrabold text-slate-900 mb-6 tracking-tight leading-[1.1]">
                Welcome to{" "}
                <span className="relative inline-block text-brand-600">
                  Code and Class
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

              <p className="text-slate-500 max-w-xl mx-auto lg:mx-0 text-base md:text-lg mb-10 leading-relaxed">
                Build industry-ready skills with expert-led training in Full
                Stack Development, ADCA, Advanced Accounting, Spoken English,
                and career-focused certification programs.
              </p>

              {/* Premium CTA Section */}
              <div className="mb-12">
                <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4 mb-4">
                  {/* Primary Button */}
                  <RouterLink
                    to="/courses"
                    className="
        group relative overflow-hidden
        inline-flex items-center justify-center gap-3
        rounded-2xl
        bg-gradient-to-r from-brand-600 to-brand-700
        px-8 py-4
        min-w-[190px]
        text-white
        font-semibold
        shadow-xl shadow-brand-600/25
        transition-all duration-300
        hover:-translate-y-1
        hover:shadow-2xl hover:shadow-brand-600/30
      "
                  >
                    <span className="relative z-10">Explore Courses</span>

                    <FaArrowRight
                      className="
          relative z-10
          transition-transform duration-300
          group-hover:translate-x-1
        "
                    />

                    <span
                      className="
          absolute inset-0
          translate-y-full
          bg-white/10
          transition-transform duration-500
          group-hover:translate-y-0
        "
                    />
                  </RouterLink>

                  {/* Online Course Button */}
                  <RouterLink
                    to="/online-courses"
                    className="
        group relative
        inline-flex items-center justify-center gap-3
        rounded-2xl
        min-w-[210px]
        px-8 py-4

        bg-gradient-to-r
        from-orange-500
        via-orange-500
        to-amber-400

        text-white
        font-semibold

        shadow-xl
        shadow-orange-500/30

        transition-all duration-300
        hover:-translate-y-1
        hover:shadow-2xl
      "
                  >
                    <span
                      className="
          absolute -top-3 right-5
          rounded-full
          bg-red-500
          px-3 py-1
          text-[10px]
          tracking-wide
          font-bold
          shadow-md
        "
                    >
                      NEW
                    </span>

                    <span>Enroll Online Course</span>

                    <span
                      className="
          rounded-full
          bg-white/20
          px-2 py-1
          text-xs
        "
                    >
                      →
                    </span>
                  </RouterLink>
                </div>

                <div className="flex items-center gap-10">
                  {/* Certificate */}
                  <RouterLink
                    to="/certificate-verification"
                    className="
        inline-flex items-center justify-center

        min-w-[190px]

        rounded-2xl

        px-8 py-4

        border
        border-slate-200

        bg-white

        text-slate-700

        font-semibold

        shadow-sm

        transition-all duration-300

        hover:-translate-y-1
        hover:border-brand-300
        hover:text-brand-600
        hover:shadow-lg
      "
                  >
                    Verify Certificate
                  </RouterLink>


                  {/* Tuition Link */}
                  <div className="mt-6 flex items-center gap-3">
                    <span className="h-px w-10 bg-slate-200" />

                    <ScrollLink
                      to="tuitions"
                      smooth={true}
                      duration={600}
                      offset={-80}
                      className="
        group
        cursor-pointer
        text-sm
        font-semibold
        text-slate-500

        transition-colors

        hover:text-brand-600
      "
                    >
                      Explore Tuition Programs
                      <span
                        className="
        inline-block ml-2
        transition-transform
        group-hover:translate-x-1
      "
                      >
                        →
                      </span>
                    </ScrollLink>
                  </div>
                </div>
              </div>

              {/* Trust strip */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-8">
                <div className="flex items-center gap-4">
                  <div
                    className="
w-14 h-14 rounded-2xl
bg-brand-100
flex items-center justify-center
"
                  >
                    <FaUsers className="text-brand-600 text-xl" />
                  </div>

                  <div>
                    <h3 className="text-3xl font-extrabold text-slate-900">
                      40K+
                    </h3>

                    <p className="text-sm text-slate-500">Students Trained</p>
                  </div>
                </div>

                <div className="h-14 w-px bg-slate-200 hidden sm:block" />

                <div className="flex items-center gap-4">
                  <div
                    className="
w-14 h-14 rounded-2xl
bg-yellow-100
flex items-center justify-center
"
                  >
                    <span className="text-xl">⭐</span>
                  </div>

                  <div>
                    <h3 className="text-3xl font-extrabold text-slate-900">
                      4.7/5
                    </h3>

                    <p className="text-sm text-slate-500">Student Rating</p>
                  </div>
                </div>

                <div className="h-14 w-px bg-slate-200 hidden sm:block" />

                <div className="flex items-center gap-4">
                  <div
                    className="
w-14 h-14 rounded-2xl
bg-green-100
flex items-center justify-center
"
                  >
                    <FaCheckCircle className="text-green-600 text-xl" />
                  </div>

                  <div>
                    <h3 className="text-3xl font-extrabold text-slate-900">
                      100%
                    </h3>

                    <p className="text-sm text-slate-500">Placement Support</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: visual panel */}
            <div className="relative hidden lg:block">
              {/* Main "editor" card */}
              <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center gap-1.5 px-4 py-3 bg-slate-50 border-b border-slate-100">
                  <span className="w-3 h-3 rounded-full bg-red-400" />
                  <span className="w-3 h-3 rounded-full bg-amber-400" />
                  <span className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="ml-3 text-xs text-slate-400 font-mono">
                    course.js
                  </span>
                </div>
                <div className="p-6 font-mono text-sm space-y-2">
                  <div>
                    <span className="text-purple-500">const</span>{" "}
                    <span className="text-blue-600">student</span> = {"{"}
                  </div>
                  <div className="pl-4">
                    <span className="text-slate-500">skills:</span>{" "}
                    <span className="text-green-600">
                      'Full Stack Developer'
                    </span>
                    ,
                  </div>
                  <div className="pl-4">
                    <span className="text-slate-500">status:</span>{" "}
                    <span className="text-green-600">'Job Ready'</span>,
                  </div>
                  <div className="pl-4">
                    <span className="text-slate-500">placed:</span>{" "}
                    <span className="text-brand-600">true</span>
                  </div>
                  <div>{"}"}</div>
                </div>
              </div>

              {/* Floating stat card - top right */}
              <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 flex items-center gap-3 animate-[float_4s_ease-in-out_infinite]">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                  <FaCheckCircle className="text-green-600" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">
                    Certificate Issued
                  </div>
                  <div className="text-xs text-slate-400">
                    Full Stack Development
                  </div>
                </div>
              </div>

              {/* Floating stat card - bottom left */}
              <div className="absolute -bottom-8 -left-8 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 flex items-center gap-3 animate-[float_4s_ease-in-out_infinite_1s]">
                <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center shrink-0">
                  <FaUsers className="text-brand-600" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">15k+</div>
                  <div className="text-xs text-slate-400">Monthly learners</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <PartnersScroll />
        </section>

        {/* How It Works */}
        <section className="px-4 md:px-10 lg:px-20 py-20 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-heading mb-2">Your Path to a Career</h2>
            <p className="section-subheading mx-auto">
              From your first class to your first job offer — here's how it
              works
            </p>
          </div>

          <div className="relative">
            {/* Connecting line - desktop only */}
            <div className="hidden md:block absolute top-14 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-100 via-brand-300 to-brand-100" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
              {[
                {
                  to: "/courses",
                  icon: FaCode,
                  title: "Learn to Code",
                  desc: "Build your fundamentals with hands-on projects in React, Node.js, MongoDB, and more.",
                  num: "01",
                },
                {
                  to: "/about",
                  icon: FaChalkboardTeacher,
                  title: "Get Mentored",
                  desc: "Learn from industry professionals with real-world experience and practical guidance.",
                  num: "02",
                },
                {
                  to: "/contact",
                  icon: FaGraduationCap,
                  title: "Get Certified & Hired",
                  desc: "Complete your course, earn a certificate, and get placement support to land your first job.",
                  num: "03",
                },
              ].map(({ to, icon: Icon, title, desc, num }) => (
                <RouterLink key={num} to={to} className="group relative">
                  <div className="flex flex-col items-center text-center">
                    {/* Step circle sits on top of the connecting line */}
                    <div className="relative z-10 w-28 h-28 rounded-full bg-white border-2 border-brand-100 flex items-center justify-center mb-6 shadow-sm group-hover:border-brand-500 group-hover:shadow-lg transition-all duration-300">
                      <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center group-hover:bg-brand-600 transition-colors duration-300">
                        <Icon className="text-2xl text-brand-600 group-hover:text-white transition-colors duration-300" />
                      </div>
                      <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent-500 text-white text-xs font-bold flex items-center justify-center shadow">
                        {num}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                      {title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
                      {desc}
                    </p>

                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      Get started <FaArrowRight className="text-xs" />
                    </span>
                  </div>
                </RouterLink>
              ))}
            </div>
          </div>
        </section>

        <section>
          <SuccessStories />
        </section>

        {/* Popular Diploma Courses */}
        <Fade cascade triggerOnce>
          <section className="px-4 md:px-10 lg:px-20 py-16 bg-white">
            <div className="max-w-8xl mx-auto">
              <h2 className="section-heading text-center mb-2">
                Popular Diploma Courses
              </h2>
              <p className="section-subheading text-center mx-auto mb-10">
                Career-focused diplomas designed to get you job-ready
              </p>
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <CourseCardSkeleton key={i} />
                  ))}
                </div>
              ) : diplomaCourses?.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-slate-400 text-lg">
                    No courses available yet. Check back soon!
                  </p>
                </div>
              ) : (
                <div className="sm:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-7">
                  {diplomaCourses.map((course, idx) => (
                    <div key={idx}>
                      <div className="group rounded-xl bg-white overflow-hidden shadow-[0_4px_14px_rgba(0,0,0,0.08)] border border-transparent hover:border-brand-600 transition-all duration-300 hover:shadow-xl">
                        {/* Image */}
                        <div className="relative w-full h-48 overflow-hidden">
                          <img
                            src={course?.thumbnail}
                            alt={course?.title}
                            loading="lazy"
                            className="object-cover transition-all duration-500 group-hover:scale-105 h-48 w-full"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent transition-all duration-500 group-hover:bg-black/20" />
                        </div>

                        {/* Content */}
                        <div className="p-4 space-y-3">
                          <h3 className="text-md font-bold text-[#162f51] leading-snug line-clamp-2 min-h-[48px]">
                            {course?.title}
                          </h3>

                          {/* Fee / Duration */}
                          <div className="flex gap-3">
                            <div className="flex-1 bg-[#faf2ec] rounded-lg p-2">
                              <div className="text-xs text-gray-500">
                                💰 Fee
                              </div>
                              <div className="text-[#e6662a] text-sm font-bold">
                                ₹{course?.price}
                              </div>
                            </div>
                            <div className="flex-1 bg-[#eef4ff] rounded-lg p-2">
                              <div className="text-xs text-gray-500">
                                ⏱️ Duration
                              </div>
                              <div className="text-[#1d3b70] text-sm font-bold">
                                {course?.duration}
                              </div>
                            </div>
                          </div>

                          {/* Badges */}
                          <div className="flex gap-2">
                            <div className="flex-1 flex items-center justify-center gap-1.5 bg-[#e8f5e9] rounded-lg px-1 py-1.5">
                              <span className="text-xs">🎯</span>
                              <span className="text-[11px] font-semibold text-[#2e7d32]">
                                Placement Assistance
                              </span>
                            </div>
                          </div>

                          {/* Buttons */}
                          <div className="flex gap-3 mt-2 justify-between">
                            <button
                              onClick={() => handleEnquireNow(course)}
                              className="px-4 py-2 rounded-md font-semibold transition-all duration-300 cursor-pointer text-xs bg-brand-600 text-white hover:bg-white hover:text-brand-600 hover:border hover:border-brand-600 h-10 flex items-center justify-center flex-1"
                            >
                              Enquire Now
                            </button>
                            <RouterLink
                              to={`/courses/${course?._id}`}
                              className="px-4 py-2 rounded-md font-semibold transition-all duration-300 cursor-pointer text-sm border border-brand-600 text-brand-600 hover:bg-brand-600 hover:text-white h-10 flex items-center justify-center flex-1"
                            >
                              Know More
                            </RouterLink>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </Fade>

        {/* Tuition & TOSS Section */}
        <Fade direction="up" triggerOnce>
          <Element name="tuitions" />
          <section className="px-4 md:px-10 lg:px-20 py-16 bg-white">
            <div className="max-w-6xl mx-auto">
              <h2 className="section-heading text-center mb-2">
                Tuition & Open School Programs
              </h2>
              <p className="section-subheading text-center mx-auto mb-10">
                Structured academic support alongside your diploma
              </p>

              <div className="sm:grid grid-cols-2 lg:grid-cols-3 gap-6 mt-7">
                {tuitionPrograms.map((p, idx) => (
                  <div key={idx}>
                    <div className="group rounded-xl bg-white overflow-hidden shadow-[0_4px_14px_rgba(0,0,0,0.08)] border border-transparent hover:border-[#2a619d] transition-all duration-300 hover:shadow-xl h-full flex flex-col">
                      {/* Image header */}
                      <div className="relative w-full h-40 overflow-hidden">
                        <img
                          src={p.image}
                          alt={p.title}
                          loading="lazy"
                          className="object-cover transition-all duration-500 group-hover:scale-105 h-40 w-full"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent transition-all duration-500 group-hover:bg-black/25" />
                        <h3 className="absolute bottom-3 left-4 right-4 text-white text-lg font-bold leading-snug drop-shadow">
                          {p.title}
                        </h3>
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-3 flex-1 flex flex-col">
                        <ul className="text-slate-600 text-sm space-y-2 flex-1">
                          {p.items.map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-[#2a619d] mt-0.5">✓</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>

                        {p.highlight && (
                          <div className="flex items-center justify-center gap-1.5 bg-[#fff4e5] rounded-lg px-2 py-1.5 w-fit">
                            <span className="text-xs">⭐</span>
                            <span className="text-[11px] font-semibold text-[#b8630a]">
                              Recommended
                            </span>
                          </div>
                        )}

                        <RouterLink
                          to="/contact"
                          className="mt-2 px-4 py-2 rounded-md font-semibold transition-all duration-300 cursor-pointer text-sm bg-[#2a619d] text-white hover:bg-white hover:text-[#2a619d] hover:border hover:border-[#2a619d] h-10 flex items-center justify-center"
                        >
                          Enquire Now
                        </RouterLink>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6 flex justify-center">
              <p className="rounded-lg border border-blue-100 bg-blue-50 px-5 py-3 text-center text-base text-slate-700">
                Please{" "}
                <span
                  className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                >
                  Login
                </span>{" "}
                to access and complete the application form.
              </p>
            </div>
          </section>
        </Fade>

        <section>
          <TrustedBySection />
        </section>

        {/* Call to Action */}
        <section className="text-center py-20 px-4 bg-gradient-to-r from-brand-600 to-brand-700">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">
            Ready to kickstart your tech career?
          </h2>
          <RouterLink
            to="/courses"
            className="inline-flex items-center gap-2 bg-white text-brand-700 font-bold px-8 py-3 rounded-xl transition-all shadow-lg hover:bg-slate-100"
          >
            Get Started Now <FaArrowRight />
          </RouterLink>
        </section>

        {/* Why Choose Us */}
        <section className="px-4 md:px-10 lg:px-20 py-20 bg-slate-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="section-heading mb-2">Why Choose Us</h2>
              <p className="section-subheading mx-auto">
                Everything about how we teach is built around one goal — getting
                you hired
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: FaChalkboardTeacher,
                  title: "Industry Experts",
                  desc: "Trained by professionals actively working in the field, not just textbook instructors.",
                },
                {
                  icon: FaLaptopCode,
                  title: "Hands-on Projects",
                  desc: "Every course is built around real projects, not just theory and slides.",
                },
                {
                  icon: FaBriefcase,
                  title: "Placement Support",
                  desc: "Resume building, mock interviews, and direct connections with hiring partners.",
                },
                {
                  icon: FaCertificate,
                  title: "Recognized Certification",
                  desc: "Government and industry-affiliated certificates that hold real value.",
                },
              ].map(({ icon: Icon, title, desc }, idx) => (
                <div
                  key={idx}
                  className="card-surface p-6 h-full text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-brand-200"
                >
                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-brand-100 flex items-center justify-center">
                    <Icon className="text-2xl text-brand-600" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Highlight stat strip */}
            <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { value: "15+", label: "Years of Experience" },
                { value: "40k+", label: "Students Trained" },
                { value: "500+", label: "Hiring Partners" },
                { value: "4.7/5", label: "Average Rating" },
              ].map(({ value, label }, idx) => (
                <div key={idx}>
                  <div className="text-3xl md:text-4xl font-extrabold text-brand-600">
                    {value}
                  </div>
                  <div className="text-slate-500 text-sm mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Scroll to Top */}
        <ScrollLink
          to="top"
          smooth={true}
          duration={500}
          className="fixed bottom-6 right-6 bg-brand-600 hover:bg-brand-700 text-white p-3 rounded-full shadow-lg z-50 transition cursor-pointer"
        >
          ↑
        </ScrollLink>
      </div>
    </>
  );
};

export default Home;
