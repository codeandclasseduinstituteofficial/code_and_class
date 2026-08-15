import React, { useEffect, useState } from 'react';
import CourseCard from '../components/CourseCard';
import { Fade } from 'react-awesome-reveal';
import { FaSearch } from 'react-icons/fa';
import instance from '../utils/axios';

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

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    handleFetchCourses();
  }, []);

  const handleFetchCourses = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || "https://code-and-class.onrender.com/api"}/courses`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setCourses(data.courses || data);
    } catch (err) {
      console.error('Failed to fetch courses', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses?.filter((c) =>
    c?.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white py-16 px-4 sm:px-6 md:px-10 lg:px-20 relative top-16">
      {/* Heading */}
      <div className="text-center mb-10 max-w-2xl mx-auto">
        <h1 className="section-heading mb-4">Explore Our Courses</h1>
        <p className="section-subheading">
          Upskill yourself with industry-relevant courses designed to help you land your dream job.
        </p>
      </div>

      {/* Search bar */}
      <div className="max-w-md mx-auto mb-12 relative">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search courses..."
          className="w-full pl-11 pr-4 py-3 rounded-full border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-400 transition-all"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {Array.from({ length: 6 }).map((_, i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredCourses?.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-slate-400 text-lg">
            {search ? `No courses found for "${search}"` : 'No courses available yet. Check back soon!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Fade direction="up" triggerOnce cascade damping={0.05}>
            {filteredCourses?.map((course) => (
              <CourseCard
                key={course?._id}
                title={course?.title}
                description={course?.description}
                link={course?._id}
                imageUrl={course?.thumbnail}
                isPopular={course?.isPopular}
                price={course?.price}
                discount={course?.discount}
              />
            ))}
          </Fade>
        </div>
      )}
    </div>
  );
};

export default Courses;