import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBook,
  FaChalkboardTeacher,
  FaFileAlt,
  FaQuestionCircle,
  FaShoppingCart,
  FaCertificate,
  FaUsers,
  FaImages,
  FaHandsHelping,
  FaArrowRight,
  FaVideo,
  FaMicrophone,
  FaGraduationCap,
  FaUniversity,
  FaSchool,
  FaPlusCircle,
  FaMoneyBillWave,
} from "react-icons/fa";
import MaintenanceModal from "../../components/MaintenanceModal";

const sections = [
  {
    heading: "Courses & Learning",
    items: [
      { title: "Add Courses", link: "/dashboard/add-course", icon: <FaBook />, color: "from-blue-500 to-cyan-500" },
      { title: "Edit Courses", link: "/dashboard/edit-course", icon: <FaBook />, color: "from-sky-500 to-blue-600" },
      { title: "Add Lectures", link: "/dashboard/add-class-lecture", icon: <FaChalkboardTeacher />, color: "from-purple-500 to-indigo-600", maintenance: true },
      { title: "Edit Lectures", link: "/dashboard/edit-lecture", icon: <FaChalkboardTeacher />, color: "from-violet-500 to-purple-600", maintenance: true },
      { title: "Spoken English", link: "/dashboard/manage-spoken-english", icon: <FaBook />, color: "from-green-500 to-emerald-600" },
      { title: "Student Fees", link: "/dashboard/fees", icon: <FaMoneyBillWave />, color: "from-yellow-500 to-amber-600" },
      { title: "Meeting Links", link: "/dashboard/meeting-links", icon: <FaVideo />, color: "from-sky-500 to-blue-600" },
      { title: "Exams", link: "/dashboard/exams", icon: <FaFileAlt />, color: "from-red-500 to-rose-600" },
      { title: "Blog", link: "/dashboard/blogs", icon: <FaFileAlt />, color: "from-purple-500 to-fuchsia-600" },
      { title: "Add Notes", link: "/dashboard/add-notes", icon: <FaFileAlt />, color: "from-orange-500 to-amber-500", maintenance: true },
      { title: "Edit Notes", link: "/dashboard/edit-notes", icon: <FaFileAlt />, color: "from-yellow-500 to-orange-500", maintenance: true },
    ],
  },
  {
    heading: "Quizzes & Sales",
    items: [
      { title: "Create Quiz", link: "/dashboard/add-quiz", icon: <FaQuestionCircle />, color: "from-pink-500 to-rose-500" },
      { title: "Manage Quizzes", link: "/dashboard/manage-quizzes", icon: <FaQuestionCircle />, color: "from-rose-500 to-red-500" },
      { title: "Orders & Revenue", link: "/dashboard/orders", icon: <FaShoppingCart />, color: "from-red-500 to-orange-500" },
    ],
  },
  {
    heading: "Certificates & Students",
    items: [
      { title: "Certificates", link: "/dashboard/add-certificate", icon: <FaCertificate />, color: "from-indigo-500 to-blue-500" },
      { title: "Edit Certificates", link: "/dashboard/edit-certificate", icon: <FaCertificate />, color: "from-indigo-600 to-violet-600" },
      { title: "Add Users", link: "/dashboard/add-users", icon: <FaUsers />, color: "from-teal-500 to-cyan-500" },
      { title: "Edit Users", link: "/dashboard/edit-users", icon: <FaUsers />, color: "from-cyan-500 to-sky-500" },
      { title: "Applications", link: "/dashboard/applications", icon: <FaFileAlt />, color: "from-blue-600 to-indigo-500" },
    ],
  },
  {
    heading: "Content & Partners",
    items: [
      { title: "Gallery", link: "/dashboard/edit-gallery", icon: <FaImages />, color: "from-fuchsia-500 to-pink-500" },
      { title: "NGO Partners", link: "/dashboard/ngo-details", icon: <FaHandsHelping />, color: "from-lime-500 to-green-500"},
    ],
  },
  {
    heading: "Students Voice & Success Stories",
    items: [
      { title: "Student Voice", link: "/dashboard/admin-student-voice", icon: <FaMicrophone />, color: "from-fuchsia-500 to-pink-500" },
      { title: "Success Stories", link: "/dashboard/success-stories", icon: <FaVideo />, color: "from-lime-500 to-green-500" },
    ],
  },
  {
    heading: "Add, Edit and Delete Your Supporters",
    items: [
      { title: "Supporters", link: "/dashboard/admin-supporters", icon: <FaUsers />, color: "from-fuchsia-500 to-pink-500" },
    ],
  },
  {
    heading: "Manage Home Schooling Videos",
    items: [
      {
        title: "Home Schooling",
        link: "/dashboard/admin-homeSchooling",
        icon: <FaGraduationCap />,
        color: "from-blue-500 to-cyan-500"
      },
    ],
  },
  {
    heading: "Add and Manage Courses",

    items: [

      {
        title: "Add - Class 10",
        link: "/dashboard/add-class",
        icon: <FaPlusCircle />,
        color: "from-blue-500 to-cyan-500"
      },

      {
        title: "Manage - Class 10",
        link: "/dashboard/manage-class-ten",
        icon: <FaSchool />,
        color: "from-blue-500 to-cyan-500"
      }

    ]

  },
  {
    heading: "Manage Courses",

    items: [
      {
        title: "Add - Intermediate",
        link: "/dashboard/add-class",
        icon: <FaPlusCircle />,
        color: "from-blue-500 to-cyan-500"
      },
      {
        title: "Intermediate",
        link: "/dashboard/manage-intermediate",
        icon: <FaUniversity />,
        color: "from-indigo-500 to-purple-500"
      }

    ]
  },
];

const stats = [
  {
    title: "Courses",
    value: "20+",
    icon: <FaBook />,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Students",
    value: "1.2K",
    icon: <FaUsers />,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Orders",
    value: "340",
    icon: <FaShoppingCart />,
    color: "bg-orange-100 text-orange-600",
  },
  {
    title: "Revenue",
    value: "₹2.4L",
    icon: <FaCertificate />,
    color: "bg-purple-100 text-purple-600",
  },
];

const Dashboard = () => {

  const [showMaintenance, setShowMaintenance] = useState(false);

  const handleCardClick = (e, item) => {
    if (item.maintenance) {
      e.preventDefault(); // stops <Link> navigation, no route change, no backend call
      setShowMaintenance(true);
    }
    // else: let Link navigate normally
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">

      {/* Background Glow */}

      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-100 rounded-full blur-[120px] opacity-60"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-100 rounded-full blur-[140px] opacity-60"></div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-28">

        {/* Hero */}

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-blue-600 to-cyan-500 text-white p-10 shadow-xl mb-12">

          <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-16 w-60 h-60 bg-cyan-300/20 rounded-full blur-3xl"></div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">

            <div>
              <p className="uppercase tracking-widest text-blue-100 text-sm mb-2">
                Admin Panel
              </p>

              <h1 className="text-4xl font-bold">
                Welcome Back 👋
              </h1>

              <p className="mt-3 text-blue-100 max-w-2xl">
                Manage courses, students, lectures, quizzes, certificates,
                gallery, NGO partners and orders from one dashboard.
              </p>
            </div>

            <div className="bg-white/15 backdrop-blur-md rounded-2xl px-6 py-4">
              <p className="text-sm text-blue-100">Today's Status</p>
              <h2 className="text-3xl font-bold">All Systems Operational</h2>
            </div>

          </div>

        </div>

        {/* Stats */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-14">

          {stats.map((stat) => (

            <div
              key={stat.title}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >

              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${stat.color}`}>
                {stat.icon}
              </div>

              <p className="mt-5 text-slate-500 text-sm">
                {stat.title}
              </p>

              <h2 className="text-3xl font-bold text-slate-800 mt-1">
                {stat.value}
              </h2>

            </div>

          ))}

        </div>

        {/* Sections */}

        <div className="space-y-14">

          {sections.map((section, i) => (

            <div key={i}>

              <div className="flex items-center gap-3 mb-7">

                <div className="w-2 h-8 rounded-full bg-indigo-600"></div>

                <h2 className="text-2xl font-bold text-slate-800">
                  {section.heading}
                </h2>

              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

                {section.items.map((item) => (

                  <Link
                    key={item.link}
                    to={item.link}
                    onClick={(e) => handleCardClick(e, item)}
                  >

                    <div className="group bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 hover:-translate-y-2">

                      <div className={`h-1.5 bg-gradient-to-r ${item.color}`} />

                      <div className="p-7">

                        <div
                          className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${item.color} text-white text-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}
                        >
                          {item.icon}
                        </div>

                        <h3 className="mt-6 text-lg font-bold text-slate-800">
                          {item.title}
                        </h3>

                        <p className="mt-2 text-sm text-slate-500 leading-6">
                          Manage this section quickly from your admin dashboard.
                        </p>

                        <div className="mt-6 flex items-center gap-2 text-indigo-600 font-semibold">

                          Open

                          <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />

                        </div>

                      </div>

                    </div>

                  </Link>

                ))}

              </div>

            </div>

          ))}

        </div>

      </div>

      <MaintenanceModal
        isOpen={showMaintenance}
        onClose={() => setShowMaintenance(false)}
      />

    </div>
  );
};

export default Dashboard;