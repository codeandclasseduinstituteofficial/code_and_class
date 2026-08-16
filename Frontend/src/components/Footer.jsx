import React, { useContext } from 'react';
import { FaInstagram, FaWhatsapp, FaYoutube } from 'react-icons/fa';
import { SiGmail } from "react-icons/si";
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';

const Footer = () => {
  const navigate = useNavigate();
  const { accessToken, user } = useContext(AuthContext);

  // Same gatekeeper used in the Navbar: only lets the user through to
  // Quizzes if they're authenticated, otherwise redirects to /login.
  const handleQuizzesClick = (e) => {
    if (!(accessToken && user)) {
      e.preventDefault();
      navigate('/login', { state: { from: '/quizzes' } });
    }
  };

  return (
    <footer className="bg-slate-900 relative top-24 text-slate-300 px-4 md:px-10 lg:px-20 py-12 mt-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-8 max-w-6xl mx-auto">
        {/* Brand & About */}
        <div>
          <h2 className="font-display text-2xl font-bold text-white mb-2">Code and Class</h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Empowering students with practical coding skills and real-world project experience. Learn. Build. Grow.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-200 mb-4">Quick Links</h3>
          <ul className="text-sm text-slate-400 space-y-2">
            <li><Link to="/" className="hover:text-white transition">Home</Link></li>
            <li><Link to="/courses" className="hover:text-white transition">Courses</Link></li>
            <li><Link to="/quizzes" onClick={handleQuizzesClick} className="hover:text-white transition">Quizzes</Link></li>
            <li><Link to="/contact" className="hover:text-white transition">Contact Us</Link></li>
            <li><Link to="/certificate-verification" className="hover:text-white transition">Verify Certificate</Link></li>
            {/* <li><Link to="/notes" className="hover:text-white transition">Notes</Link></li> */}
            <li><Link to="/ngos" className="hover:text-white transition">Partner Ngo's</Link></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-200 mb-4">Connect With Us</h3>
          <div className="flex space-x-3">
            <Link to="https://www.youtube.com/@CodeAndClass" target='_blank' className="bg-slate-800 hover:bg-brand-600 text-white p-2.5 rounded-full transition">
              <FaYoutube />
            </Link>
            <Link to="https://www.instagram.com/code_and_class?igsh=ZnBsbzhtcG43Zzlk" target='_blank' className="bg-slate-800 hover:bg-brand-600 text-white p-2.5 rounded-full transition">
              <FaInstagram />
            </Link>
            <Link to="https://whatsapp.com/channel/0029VbBQoOTCHDyr0cD8Jr3j" target='_blank' className="bg-slate-800 hover:bg-brand-600 text-white p-2.5 rounded-full transition">
              <FaWhatsapp />
            </Link>
            <Link to="mailto:asifsir@codeandclass.com" target='_blank' className="bg-slate-800 hover:bg-brand-600 text-white p-2.5 rounded-full transition">
              <SiGmail />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-slate-800 pt-6 text-center text-sm text-slate-500 max-w-6xl mx-auto">
        © {new Date().getFullYear()} Code and Class. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;