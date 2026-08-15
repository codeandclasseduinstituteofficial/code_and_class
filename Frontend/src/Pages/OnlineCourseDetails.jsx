import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  FaClock, FaBriefcase, FaBook, FaCheckCircle, FaShieldAlt,
  FaCertificate, FaUsers, FaChevronRight, FaStar,
} from 'react-icons/fa';
import Checkout from '../components/Checkout';

const DetailSkeleton = () => (
  <div className="bg-white min-h-screen px-4 md:px-10 lg:px-20 py-10 relative top-16 animate-pulse">
    <div className="max-w-6xl mx-auto">
      <div className="w-full h-56 md:h-72 rounded-2xl bg-slate-200 mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-8 bg-slate-200 rounded w-3/4" />
          <div className="h-4 bg-slate-200 rounded w-1/3" />
          <div className="card-surface p-6 space-y-3">
            <div className="h-4 bg-slate-200 rounded w-full" />
            <div className="h-4 bg-slate-200 rounded w-full" />
            <div className="h-4 bg-slate-200 rounded w-2/3" />
          </div>
        </div>
        <div className="card-surface p-6 h-64 bg-slate-100" />
      </div>
    </div>
  </div>
);

const OnlineCourseDetails = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCourse = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8080/api"}/courses/online-courses/${courseId}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setCourse(data);
    } catch (err) {
      console.error(err);
      setError('Could not load this course.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  if (loading) return <DetailSkeleton />;

  if (error) {
    return (
      <div className="text-center py-32 relative top-16 px-4">
        <p className="text-red-500 text-lg mb-4">{error}</p>
        <RouterLink to="/courses" className="btn-primary inline-flex">
          Browse other courses
        </RouterLink>
      </div>
    );
  }

  const coursePrice =
    Number(course?.price?.toString?.().replace(/[^\d.]/g, "")) || 0;

  const platformFee = 1000;

  const totalPrice = coursePrice + platformFee;

  const rawDiscountPct =
    Number(course?.discount?.toString?.().replace(/[^\d.]/g, "")) || 0;

  const originalPrice = rawDiscountPct
    ? Math.round(coursePrice + (coursePrice * rawDiscountPct) / 100)
    : coursePrice;

  return (
    <div className="bg-white min-h-screen relative top-16">
      {/* Hero banner */}
      <div className="relative w-full h-56 md:h-80 overflow-hidden">
        <img
          src={course?.thumbnail}
          alt={`${course?.title} banner`}
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Breadcrumb + title overlay */}
        <div className="absolute inset-0 flex flex-col justify-end px-4 md:px-10 lg:px-20 pb-6">
          <div className="max-w-6xl mx-auto w-full">
            <div className="flex items-center gap-2 text-xs text-white/70 mb-3">
              <RouterLink to="/courses" className="hover:text-white transition-colors">Courses</RouterLink>
              <FaChevronRight className="text-[10px]" />
              <span className="text-white/90 line-clamp-1">{course?.title}</span>
            </div>
            {course?.isPopular && (
              <span className="inline-block text-xs font-bold bg-accent-500 text-white px-3 py-1 rounded-full shadow mb-3 w-fit">
                🔥 Popular Course
              </span>
            )}
            <h1 className="text-2xl md:text-4xl font-display font-bold text-white max-w-3xl">
              {course?.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-10 lg:px-20 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick facts strip */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-brand-50 text-brand-700 px-4 py-2 rounded-full text-sm font-semibold">
                  <FaClock /> {course?.duration || 'Flexible'}
                </div>
                <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                  <FaCertificate /> Certified Course
                </div>
                <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-full text-sm font-semibold">
                  <FaStar className="text-amber-500" /> 4.7/5 rating
                </div>
              </div>

              {/* Description */}
              <div className="card-surface p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <FaBook className="text-brand-500" /> Course Description
                </h2>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                  {course?.description}
                </p>
              </div>

              {/* Job opportunities */}
              {course?.jobs?.length > 0 && (
                <div className="card-surface p-6">
                  <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <FaBriefcase className="text-brand-500" /> Job Opportunities
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {course.jobs.map((job, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-slate-50 rounded-lg px-4 py-3 text-sm text-slate-700">
                        <FaCheckCircle className="text-green-500 shrink-0" />
                        {job}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="card-surface p-4">
                  <FaShieldAlt className="text-brand-500 text-xl mx-auto mb-2" />
                  <div className="text-xs font-semibold text-slate-600">Verified Curriculum</div>
                </div>
                <div className="card-surface p-4">
                  <FaUsers className="text-brand-500 text-xl mx-auto mb-2" />
                  <div className="text-xs font-semibold text-slate-600">Mentor Support</div>
                </div>
                <div className="card-surface p-4">
                  <FaCertificate className="text-brand-500 text-xl mx-auto mb-2" />
                  <div className="text-xs font-semibold text-slate-600">Recognized Certificate</div>
                </div>
              </div>
            </div>

            {/* Purchase card */}
            <div className="lg:col-span-1">
              <div className="card-surface p-6 sticky top-24 space-y-5 border-2 border-brand-100 shadow-lg">
                <div>
                  <div className="flex items-baseline gap-2">
                    <div className="space-y-3 p-2">

                      <div className="flex justify-between gap-2">
                        <span>Course Fee</span>
                        <span>₹{coursePrice}</span>
                      </div>

                      <div className="flex justify-between gap-2">
                        <span>Online Platform Fee</span>
                        <span>₹{platformFee}</span>
                      </div>

                      <hr />

                      <div className="flex justify-between text-2xl font-bold">
                        <span>Total</span>
                        <span>₹{totalPrice}</span>
                      </div>

                    </div>
                    {rawDiscountPct > 0 && (
                      <span className="text-base text-slate-400 line-through">₹{originalPrice}</span>
                    )}
                  </div>
                  {rawDiscountPct > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-block text-xs font-bold text-green-700 bg-green-50 border border-green-200 rounded-full px-2.5 py-1">
                        {course.discount}% OFF
                      </span>
                      <span className="text-xs text-red-500 font-medium">Limited-time offer</span>
                    </div>
                  )}
                </div>

                <Checkout
                  courseId={course?._id}
                  courseTitle={course?.title}
                  isOnlineCourse={true}
                />

                {/* What's included */}
                <div className="pt-4 border-t border-slate-100 space-y-2.5">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">This course includes</p>
                  {[
                    'Lifetime access to course material',
                    'Certificate of completion',
                    'Hands-on project experience',
                    '1-on-1 mentor support',
                    'Placement assistance',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2 text-sm text-slate-600">
                      <FaCheckCircle className="text-green-500 mt-0.5 shrink-0 text-sm" />
                      {item}
                    </div>
                  ))}
                </div>

                <p className="text-xs text-center text-slate-400 pt-2">
                  Have questions? <RouterLink to="/contact" className="text-brand-600 font-semibold hover:underline">Talk to us</RouterLink>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnlineCourseDetails;