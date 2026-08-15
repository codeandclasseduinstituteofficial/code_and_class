import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { AuthContext } from '../context/AuthProvider';
import instance from '../utils/axios';

const QuizAttempt = () => {
  const { quizId } = useParams();
  const { accessToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [answers, setAnswers] = useState({}); // questionId -> selectedOptionIndex
  const [secondsLeft, setSecondsLeft] = useState(null);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const { data } = await instance.get(`/quizzes/${quizId}`, {
          headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
        });
        setQuiz(data);
        setSecondsLeft(data.timeLimitMinutes * 60);
      } catch (err) {
        setError(err?.response?.data?.message || 'Could not load this quiz.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId, accessToken]);

  // Countdown timer — auto-submits when it hits zero
  useEffect(() => {
    if (secondsLeft === null || result) return;
    if (secondsLeft <= 0) {
      handleSubmit();
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, result]);

  const timeDisplay = useMemo(() => {
    if (secondsLeft === null) return '';
    const m = Math.floor(secondsLeft / 60).toString().padStart(2, '0');
    const s = (secondsLeft % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }, [secondsLeft]);

  const selectOption = (questionId, optionIndex) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = async () => {
    if (!accessToken) {
      navigate('/login');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        answers: Object.entries(answers).map(([questionId, selectedOptionIndex]) => ({
          questionId,
          selectedOptionIndex,
        })),
      };
      const { data } = await instance.post(`/quizzes/${quizId}/submit`, payload, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setResult(data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not submit your answers.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center text-slate-400 mt-32 relative top-16">Loading quiz…</div>;
  if (error && !quiz) return <div className="text-center text-red-500 mt-32 relative top-16">{error}</div>;

  if (result) {
    const correctMap = Object.fromEntries(result.correctAnswers.map((c) => [c.questionId, c.correctOptionIndex]));
    return (
      <div className="min-h-screen bg-white px-4 md:px-10 lg:px-20 py-16 relative top-16">
        <div className="max-w-2xl mx-auto">
          <div className="card-surface p-8 text-center mb-8">
            <h1 className="text-2xl font-display font-bold text-slate-900 mb-2">{quiz.title} — Results</h1>
            <p className="text-5xl font-bold text-brand-600 my-4">{result.percentage}%</p>
            <p className="text-slate-500">You scored {result.score} out of {result.totalQuestions}</p>
          </div>

          <div className="space-y-4">
            {quiz.questions.map((q) => {
              const selected = answers[q._id];
              const correctIdx = correctMap[q._id];
              const wasCorrect = Number(selected) === Number(correctIdx);
              return (
                <div key={q._id} className="card-surface p-5">
                  <p className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    {wasCorrect ? <FaCheckCircle className="text-green-500 shrink-0" /> : <FaTimesCircle className="text-red-500 shrink-0" />}
                    {q.questionText}
                  </p>
                  <div className="space-y-1.5 pl-6">
                    {q.options.map((opt, idx) => {
                      const isCorrectOpt = idx === correctIdx;
                      const isSelectedOpt = idx === selected;
                      return (
                        <div
                          key={opt._id}
                          className={`text-sm px-3 py-1.5 rounded-lg ${
                            isCorrectOpt
                              ? 'bg-green-50 text-green-700 font-medium'
                              : isSelectedOpt
                              ? 'bg-red-50 text-red-700'
                              : 'text-slate-500'
                          }`}
                        >
                          {opt.text}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <button onClick={() => navigate('/quizzes')} className="btn-primary">Back to Quizzes</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 md:px-10 lg:px-20 py-16 relative top-16">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-display font-bold text-slate-900">{quiz.title}</h1>
          <div className="flex items-center gap-2 text-brand-600 font-mono font-semibold bg-brand-50 border border-brand-200 rounded-lg px-3 py-1.5">
            <FaClock /> {timeDisplay}
          </div>
        </div>

        <div className="space-y-6">
          {quiz.questions.map((q, qIdx) => (
            <div key={q._id} className="card-surface p-5">
              <p className="font-semibold text-slate-900 mb-4">{qIdx + 1}. {q.questionText}</p>
              <div className="space-y-2">
                {q.options.map((opt, idx) => (
                  <label
                    key={opt._id}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border cursor-pointer transition-colors ${
                      answers[q._id] === idx
                        ? 'border-brand-500 bg-brand-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name={q._id}
                      checked={answers[q._id] === idx}
                      onChange={() => selectOption(q._id, idx)}
                      className="accent-brand-600"
                    />
                    <span className="text-sm text-slate-700">{opt.text}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {error && <p className="text-sm text-red-600 text-center mt-4">{error}</p>}

        <div className="text-center mt-8">
          <button onClick={handleSubmit} disabled={submitting} className="btn-primary disabled:opacity-70">
            {submitting ? 'Submitting…' : 'Submit Quiz'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizAttempt;
