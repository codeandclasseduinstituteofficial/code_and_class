import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaLock, FaUnlock, FaQuestionCircle, FaClock, FaStar } from 'react-icons/fa';
import { AuthContext } from '../context/AuthProvider';
import instance from '../utils/axios';

const Quizzes = () => {
  const { accessToken } = useContext(AuthContext);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const { data } = await instance.get('/quizzes', {
          headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
        });
        setQuizzes(data);
      } catch (err) {
        console.error('Failed to fetch quizzes', err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, [accessToken]);

  return (
    <div className="min-h-screen bg-white px-4 md:px-10 lg:px-20 py-16 relative top-16">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <h1 className="section-heading mb-4">Practice Quizzes</h1>
          <p className="section-subheading">
            Test what you've learned. Free quizzes are open to everyone — course quizzes unlock once you're enrolled.
          </p>
        </div>

        {loading ? (
          <p className="text-center text-slate-400">Loading quizzes…</p>
        ) : quizzes.length === 0 ? (
          <p className="text-center text-slate-400">No quizzes published yet. Check back soon!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {quizzes.map((quiz) => (
              <div key={quiz._id} className={`card-surface p-6 flex flex-col ${quiz.isSpecial ? 'ring-2 ring-amber-400' : ''}`}>
                <div className="flex items-start justify-between mb-2 gap-2">
                  <h3 className="text-lg font-bold text-slate-900">{quiz.title}</h3>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    {quiz.isSpecial && (
                      <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5 flex items-center gap-1">
                        <FaStar className="text-[10px]" /> Special
                      </span>
                    )}
                    {quiz.isFree ? (
                      <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-200 rounded-full px-2 py-0.5">Free</span>
                    ) : quiz.isLocked ? (
                      <span className="text-xs font-semibold text-slate-500 bg-slate-100 border border-slate-200 rounded-full px-2 py-0.5 flex items-center gap-1">
                        <FaLock className="text-[10px]" /> {quiz.paymentLocked ? `₹${quiz.price}` : 'Locked'}
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-brand-700 bg-brand-50 border border-brand-200 rounded-full px-2 py-0.5 flex items-center gap-1">
                        <FaUnlock className="text-[10px]" /> Unlocked
                      </span>
                    )}
                  </div>
                </div>
                {quiz.description && <p className="text-sm text-slate-500 mb-4 flex-1">{quiz.description}</p>}
                <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                  <span className="flex items-center gap-1"><FaQuestionCircle /> {quiz.questionCount} questions</span>
                  <span className="flex items-center gap-1"><FaClock /> {quiz.timeLimitMinutes} min</span>
                </div>

                {quiz.courseLocked ? (
                  <Link to={`/courses/${quiz.course?._id}`} className="btn-outline w-full">
                    View Course to Unlock
                  </Link>
                ) : quiz.paymentLocked ? (
                  <Link to={`/buy-quiz/${quiz._id}`} className="btn-primary w-full">
                    Pay ₹{quiz.price} to Unlock
                  </Link>
                ) : (
                  <Link to={`/quizzes/${quiz._id}`} className="btn-primary w-full">
                    Start Quiz
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Quizzes;
