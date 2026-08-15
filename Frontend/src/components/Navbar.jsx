import React, { useState, useContext } from 'react';
import { FaBars, FaTimes, FaChevronDown } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';
import Logo from '../assets/Logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClassesOpen, setIsClassesOpen] = useState(false);
  const location = useLocation();
  const [mobileClassesOpen, setMobileClassesOpen] = useState(false);

  const { accessToken, user } = useContext(AuthContext);

  const isActive = (path) =>
    location.pathname.startsWith(path) ? 'text-brand-600 bg-brand-50' : 'text-slate-600';

  const dashboardPath =
    user?.role === 'admin'
      ? '/dashboard'
      : user?.role === 'user'
        ? '/user-dashboard'
        : '/';

  const navLink =
    'text-sm font-medium px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-brand-600 transition-colors';

  return (
    <div className="w-full bg-white/90 backdrop-blur-md border-b border-slate-200 fixed top-0 left-0 z-30">
      <div className="flex w-full justify-between items-center px-6 md:px-14 py-3">
        <Link to="/" className="flex items-center gap-2">
          <img src={Logo} className="w-10 h-10 object-contain rounded-lg" alt="Code and Class Logo" />
          <span className="font-display font-bold text-lg text-slate-900 hidden sm:block">Code and Class</span>
        </Link>

        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-slate-700">
            {isOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
          </button>
        </div>

        {/* Desktop */}
        <div className="hidden md:flex flex-row space-x-1 items-center">
          {accessToken && user && (
            <Link to={dashboardPath} className={`${navLink} ${isActive(dashboardPath)}`}>
              Dashboard
            </Link>
          )}

          <Link to="/" className={`${navLink} ${isActive('/home')}`}>Home</Link>

          {/* Classes */}
          <div className="relative" onMouseEnter={() => setIsClassesOpen(true)} onMouseLeave={() => setIsClassesOpen(false)}>
            <button className={`${navLink} flex items-center gap-1`}>Classes <FaChevronDown className="text-xs" /></button>
            {isClassesOpen && (
              <div className="absolute left-0 top-full bg-white w-48 rounded-xl shadow-lg border border-slate-200 py-1 overflow-hidden z-50">
                {['Home-Schooling', 'Class-10', 'Intermediate'].map((text, idx) => (
                  <Link key={idx} to={`/classes/${text}`} className="block text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-600 px-4 py-2">{text}</Link>
                ))}
              </div>
            )}
          </div>

          {/* Spoken English */}
          <Link to="/spoken-english" className={`${navLink} ${isActive('/spoken-english')}`}>Spoken English</Link>

          <Link to="/blogs" className={`${navLink} ${isActive('/blogs')}`}>Blogs</Link>
          {accessToken && user && (
            <Link to="/quizzes" className={`${navLink} ${isActive('/quizzes')}`}>Quizzes</Link>
          )}
          <Link to="/exams" className={`${navLink} ${isActive('/exams')}`}>Exams</Link>
          <Link to="/gallery" className={`${navLink} ${isActive('/gallery')}`}>Gallery</Link>
          <Link to="/contact" className={`${navLink} ${isActive('/contact')}`}>Contact</Link>

          {accessToken ? (
            <Link to="/logout" className="ml-2 btn-outline !px-4 !py-2 text-sm">Logout</Link>
          ) : (
            <Link to="/login" className="ml-2 btn-primary !px-4 !py-2 text-sm">Login</Link>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-6 py-4 space-y-1">

          {accessToken && user && (
            <Link
              to={dashboardPath}
              onClick={() => setIsOpen(false)}
              className={navLink}
            >
              Dashboard
            </Link>
          )}

          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className={navLink}
          >
            Home
          </Link>

          {/* Classes */}
          <div>
            <button
              onClick={() => setMobileClassesOpen(!mobileClassesOpen)}
              className={`${navLink} w-full flex justify-between items-center`}
            >
              <span>Classes</span>

              <FaChevronDown
                className={`transition-transform duration-300 ${mobileClassesOpen ? "rotate-180" : ""
                  }`}
              />
            </button>

            {mobileClassesOpen && (
              <div className="ml-5 mt-2 flex flex-col border-l-2 border-brand-200">

                <Link
                  to="/classes/Home-Schooling"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:text-brand-600"
                >
                  Home Schooling
                </Link>

                <Link
                  to="/classes/Class-10"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:text-brand-600"
                >
                  Class 10
                </Link>

                <Link
                  to="/classes/Intermediate"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:text-brand-600"
                >
                  Intermediate
                </Link>

              </div>
            )}
          </div>

          {/* Spoken English */}
          <Link
            to="/spoken-english"
            onClick={() => setIsOpen(false)}
            className={`${navLink} w-full flex justify-between items-center`}
          >
            <span>Spoken English</span>
          </Link>

          <div className='flex flex-col'>
            <Link
              to="/blogs"
              onClick={() => setIsOpen(false)}
              className={navLink}
            >
              Blogs
            </Link>

            {accessToken && user && (
              <Link
                to="/quizzes"
                onClick={() => setIsOpen(false)}
                className={navLink}
              >
                Quizzes
              </Link>
            )}

            <Link
              to="/exams"
              onClick={() => setIsOpen(false)}
              className={navLink}
            >
              Exams
            </Link>

            <Link
              to="/gallery"
              onClick={() => setIsOpen(false)}
              className={navLink}
            >
              Gallery
            </Link>

            <Link
              to="/contact"
              onClick={() => setIsOpen(false)}
              className={navLink}
            >
              Contact
            </Link>

            {accessToken ? (
              <Link
                to="/logout"
                onClick={() => setIsOpen(false)}
                className="mt-2 btn-outline text-center"
              >
                Logout
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="mt-2 btn-primary text-center"
              >
                Login
              </Link>
            )}
          </div>

        </div>
      )}
    </div>
  );
};

export default Navbar;
