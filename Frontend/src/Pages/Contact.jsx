import React, { useEffect, useRef, useState } from "react";
import {
  FaEnvelopeOpenText,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaClock,
  FaPaperPlane,
  FaCheckCircle,
  FaGraduationCap,
  FaUsers,
  FaCertificate,
} from "react-icons/fa";

import AOS from "aos";
import "aos/dist/aos.css";
import emailjs from "emailjs-com";
import Modal from "../components/Modal";

const Contact = () => {

  emailjs.init(import.meta.env.VITE_EMAILJS_USER_ID);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true
    });
  }, []);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,

      {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message
      }
    )
      .then(() => {
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: ""
        });
        setLoading(false);
        setShowModal(true);
      })

      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  };

  return (
    <div className="bg-slate-50 min-h-screen relative top-16">
      {/* HERO */}

      <section className="bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 text-white py-28 px-6 rounded-b-[70px]">
        <div className="max-w-5xl mx-auto text-center">
          <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur flex items-center justify-center mx-auto mb-6">
            <FaEnvelopeOpenText className="text-5xl" />
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold">
            Let's Build Your Future Together
          </h1>

          <p className="mt-6 text-lg text-brand-100 max-w-3xl mx-auto">
            Have questions about courses, admissions,
            certifications or career guidance?
            Our experts are here to help you.

          </p>
        </div>
      </section>

      {/* MAIN CONTACT */}
      <section className="max-w-8xl mx-auto px-6 py-20">

        <div className="grid lg:grid-cols-3 gap-8">
          {/* CONTACT INFO */}
          <div
            data-aos="fade-right"
            className="lg:col-span-1 bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
            <h2 className="text-2xl font-bold mb-8 text-slate-900">
              Contact Information
            </h2>

            <div className="space-y-7">
              <ContactCard
                icon={<FaMapMarkerAlt />}
                title="Visit Campus"
                text="Code and Class Educational Institute"
              />

              <ContactCard

                icon={<FaPhoneAlt />}
                title="Call Us"
                text="+91 93472 30146"
              />

              <ContactCard

                icon={<FaEnvelopeOpenText />}
                title="Email"
                text="asifsir@codeandclass.com"

              />

              <ContactCard
                icon={<FaClock />}
                title="Working Hours"
                text="Mon - Sat : 9AM - 9PM"

              />
            </div>
          </div>

          {/* FORM */}
          <div data-aos="fade-left" className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-10 border border-slate-100">
            <h2 className="text-3xl font-bold mb-8 text-slate-900">
              Send Us A Message
            </h2>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  label="Your Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />

                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <Input
                label="Subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
              />

              <div>
                <label className="font-semibold text-sm">
                  Message
                </label>

                <textarea
                  required
                  name="message"
                  rows="6"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message..."
                  className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:ring-4 focus:ring-brand-100 focus:border-brand-500" />
              </div>

              <button
                disabled={loading}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white py-4 rounded-xl font-bold flex justify-center items-center gap-3 transition shadow-lg hover:scale-[1.02]"
              >
                <FaPaperPlane />
                {
                  loading
                    ?
                    "Sending..."
                    :
                    "Send Message"
                }
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ANIMATED STATS */}
      <StatsSection />

      {/* MAP */}
      <section className="max-w-7xl mx-auto px-6 pb-20">

        <div className="rounded-3xl overflow-hidden shadow-xl">

          <iframe
            title="Google Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3808.137669071989!2d78.47967107516419!3d17.357107283524932!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb9991afbe2483%3A0x66f496aa418886da!2sCode%20and%20class%20educational%20institute!5e0!3m2!1sen!2sin!4v1784658597894!5m2!1sen!2sin"
            className="w-full h-[450px]"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </section>

      {
        showModal &&
        <Modal
          message="Thank you for contacting us! We'll get back to you soon."
          onClose={() => setShowModal(false)}
        />
      }
    </div>
  );
};

const StatsSection = () => {


  const ref = useRef(null);

  const started = useRef(false);


  const [values, setValues] = useState({
    students: 0,
    courses: 0,
    success: 0
  });



  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        animate(5000, v => setValues(x => ({ ...x, students: v })));
        animate(100, v => setValues(x => ({ ...x, courses: v })));
        animate(95, v => setValues(x => ({ ...x, success: v })));
      }
    }, { threshold: .4 });

    if (ref.current)
      observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const animate = (target, setter) => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.ceil(target / 50);
      if (current >= target) {
        setter(target);
        clearInterval(interval);
      }
      else {
        setter(current);
      }
    }, 30);
  };

  return (

    <section ref={ref}
      className="max-w-6xl mx-auto px-6 pb-20">
      <div className="grid md:grid-cols-3 gap-6">
        <StatCard
          icon={<FaUsers />}
          number={values.students + "+"}
          text="Students Trained"
        />

        <StatCard
          icon={<FaGraduationCap />}
          number={values.courses + "+"}
          text="Courses Available"
        />

        <StatCard
          icon={<FaCertificate />}
          number={values.success + "%"}
          text="Student Satisfaction"
        />
      </div>
    </section>
  );
};

const ContactCard = ({ icon, title, text }) => (
  <div className="flex gap-4 items-center">
    <div className="w-14 h-14 rounded-2xl bg-brand-100 text-brand-600 items-center flex text-xl justify-center">
      {icon}
    </div>

    <div>
      <h3 className="font-bold text-slate-900">
        {title}
      </h3>

      <p className="text-sm text-slate-500">
        {text}
      </p>
    </div>
  </div>
);

const Input = ({ label, ...props }) => (
  <div>
    <label className="font-semibold text-sm">
      {label}
    </label>

    <input
      required
      className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:ring-4 focus:ring-brand-100 focus:border-brand-500"
      {...props}
    />
  </div>
);

const StatCard = ({ icon, number, text }) => (
  <div className="bg-white rounded-3xl shadow-xl p-8 text-center hover:-translate-y-2 transition">

    <div className="text-brand-600 text-3xl flex justify-center mb-4">
      {icon}
    </div>

    <h2 className="text-4xl font-extrabold text-brand-600">
      {number}
    </h2>

    <p className="text-slate-500 mt-2">
      {text}
    </p>
  </div>
);

export default Contact;