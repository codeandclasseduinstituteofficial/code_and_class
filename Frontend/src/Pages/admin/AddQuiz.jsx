import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthProvider';
import instance from '../../utils/axios';

const emptyQuestion = () => ({
  questionText: '',
  options: ['', ''],
  correctOptionIndex: 0,
});

const AddQuiz = () => {
  const { accessToken } = useContext(AuthContext);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [courseId, setCourseId] = useState(''); // '' = free/public quiz
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(10);
  const [questions, setQuestions] = useState([emptyQuestion()]);
  const [courses, setCourses] = useState([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await instance.get('/courses');
        setCourses(data);
      } catch (err) {
        console.error('Failed to load courses', err);
      }
    };
    fetchCourses();
  }, []);

  const updateQuestion = (qIdx, field, value) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[qIdx] = { ...copy[qIdx], [field]: value };
      return copy;
    });
  };

  const updateOption = (qIdx, oIdx, value) => {
    setQuestions((prev) => {
      const copy = [...prev];
      const options = [...copy[qIdx].options];
      options[oIdx] = value;
      copy[qIdx] = { ...copy[qIdx], options };
      return copy;
    });
  };

  const addOption = (qIdx) => {
    setQuestions((prev) => {
      const copy = [...prev];
      if (copy[qIdx].options.length >= 6) return prev;
      copy[qIdx] = { ...copy[qIdx], options: [...copy[qIdx].options, ''] };
      return copy;
    });
  };

  const removeOption = (qIdx, oIdx) => {
    setQuestions((prev) => {
      const copy = [...prev];
      if (copy[qIdx].options.length <= 2) return prev;
      const options = copy[qIdx].options.filter((_, i) => i !== oIdx);
      const correctOptionIndex = copy[qIdx].correctOptionIndex >= options.length ? 0 : copy[qIdx].correctOptionIndex;
      copy[qIdx] = { ...copy[qIdx], options, correctOptionIndex };
      return copy;
    });
  };

  const addQuestion = () => setQuestions((prev) => [...prev, emptyQuestion()]);

  const removeQuestion = (qIdx) => {
    setQuestions((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== qIdx) : prev));
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCourseId('');
    setTimeLimitMinutes(10);
    setQuestions([emptyQuestion()]);
  };

  const handleSubmit = async () => {
    setStatus('');

    if (!title.trim() || questions.length === 0) {
      setStatus('error:Please add a title and at least one question.');
      return;
    }
    for (const q of questions) {
      if (!q.questionText.trim() || q.options.some((o) => !o.trim())) {
        setStatus('error:Every question needs text and all its options filled in.');
        return;
      }
    }

    try {
      await instance.post(
        '/quizzes',
        {
          title,
          description,
          course: courseId || null,
          timeLimitMinutes: Number(timeLimitMinutes),
          questions: questions.map((q) => ({
            questionText: q.questionText,
            options: q.options.map((text) => ({ text })),
            correctOptionIndex: q.correctOptionIndex,
          })),
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setStatus('success:Quiz created successfully!');
      resetForm();
    } catch (err) {
      setStatus(`error:${err?.response?.data?.message || 'Failed to create quiz'}`);
    }
  };

  const inputClass =
    'w-full px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-800 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500';
  const labelClass = 'block text-sm font-semibold text-slate-700 mb-1.5';

  return (
    <div className="min-h-screen bg-slate-50 px-4 md:px-10 lg:px-20 py-12 relative top-16">
      <h1 className="text-3xl font-display font-bold text-center mb-8 text-slate-900">Create a Quiz</h1>

      <div className="card-surface p-6 max-w-3xl mx-auto space-y-6">
        <div>
          <label className={labelClass}>Quiz Title</label>
          <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., React Basics Quiz" />
        </div>

        <div>
          <label className={labelClass}>Description (optional)</label>
          <textarea className={inputClass} rows="2" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description shown on the quiz list" />
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className={labelClass}>Lock to a Course (leave blank for a free/public quiz)</label>
            <select className={inputClass} value={courseId} onChange={(e) => setCourseId(e.target.value)}>
              <option value="">Free — open to everyone</option>
              {courses.map((c) => (
                <option key={c._id} value={c._id}>{c.title}</option>
              ))}
            </select>
          </div>
          <div className="w-40">
            <label className={labelClass}>Time Limit (min)</label>
            <input type="number" min="1" className={inputClass} value={timeLimitMinutes} onChange={(e) => setTimeLimitMinutes(e.target.value)} />
          </div>
        </div>

        <div className="space-y-5">
          {questions.map((q, qIdx) => (
            <div key={qIdx} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-brand-600">Question {qIdx + 1}</span>
                {questions.length > 1 && (
                  <button onClick={() => removeQuestion(qIdx)} className="text-xs text-red-500 hover:underline">Remove</button>
                )}
              </div>

              <input
                className={inputClass + ' mb-3'}
                placeholder="Question text"
                value={q.questionText}
                onChange={(e) => updateQuestion(qIdx, 'questionText', e.target.value)}
              />

              <div className="space-y-2">
                {q.options.map((opt, oIdx) => (
                  <div key={oIdx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`correct-${qIdx}`}
                      checked={q.correctOptionIndex === oIdx}
                      onChange={() => updateQuestion(qIdx, 'correctOptionIndex', oIdx)}
                      title="Mark as correct answer"
                      className="accent-brand-600"
                    />
                    <input
                      className={inputClass}
                      placeholder={`Option ${oIdx + 1}`}
                      value={opt}
                      onChange={(e) => updateOption(qIdx, oIdx, e.target.value)}
                    />
                    {q.options.length > 2 && (
                      <button onClick={() => removeOption(qIdx, oIdx)} className="text-slate-400 hover:text-red-500 text-sm px-2">✕</button>
                    )}
                  </div>
                ))}
              </div>

              <button onClick={() => addOption(qIdx)} className="text-xs text-brand-600 font-semibold mt-2 hover:underline">
                + Add Option
              </button>
              <p className="text-xs text-slate-400 mt-1">Select the radio button next to the correct answer.</p>
            </div>
          ))}
        </div>

        <button onClick={addQuestion} className="btn-outline w-full">+ Add Another Question</button>

        {status && (
          <p className={`text-sm text-center ${status.startsWith('error') ? 'text-red-600' : 'text-green-600'}`}>
            {status.split(':').slice(1).join(':')}
          </p>
        )}

        <div className="text-center pt-2">
          <button onClick={handleSubmit} className="btn-primary px-10">Publish Quiz</button>
        </div>
      </div>
    </div>
  );
};

export default AddQuiz;
