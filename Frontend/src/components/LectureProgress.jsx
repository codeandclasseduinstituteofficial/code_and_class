import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';
import { AuthContext } from '../context/AuthProvider';
import ChapterCheckout from './ChapterCheckout';

const LectureProgress = () => {
  const classId = useParams()
  const { accessToken } = useContext(AuthContext);

  const [units, setUnits] = useState([])
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedUnitId, setSelectedUnitId] = useState(null);

  const API_BASE = `${import.meta.env.VITE_API_URL || "https://code-and-class.onrender.com/api"}/lectures`

  useEffect(() => {
    fetchUnits()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId, accessToken])

  useEffect(() => {
    if (units.length > 0 && units[0].chapters.length > 0) {
      setSelectedChapter(units[0].chapters[0]);
      setSelectedUnitId(units[0]._id);
    }
  }, [units]);

  const fetchUnits = async () => {
    try {
      const rawUnits = await fetch(`${API_BASE}/class/${classId.classId}`, {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      })
      const unitsData = await rawUnits.json()
      setUnits(unitsData)
    } catch (error) {
      console.log(error)
    }
  }

  const handleChapterUnlocked = () => {
    // Refetch so the newly purchased chapter's videoUrl comes back unlocked
    fetchUnits();
  };

  return (
    <div className="min-h-screen bg-slate-50 relative top-16">

      {/* Header */}
      <div className="bg-gradient-to-r from-brand-700 via-brand-600 to-brand-500 text-white">
        <div className="max-w-7xl mx-auto px-6 py-10">

          <p className="uppercase tracking-widest text-brand-100 text-sm">
            Online Learning
          </p>

          <h1 className="text-3xl md:text-5xl font-bold mt-2">
            {classId.classId} Course
          </h1>

          <p className="mt-3 text-brand-100 max-w-2xl">
            Watch every lecture in sequence, track your progress,
            and master every concept step by step.
          </p>

        </div>
      </div>

      <div className="max-w-8xl mx-auto px-6 py-10">

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Video Section */}
          <div className="lg:col-span-2">

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

              <div className="aspect-video bg-slate-900 flex items-center justify-center">
                {selectedChapter && selectedChapter.isPaid && !selectedChapter.unlocked ? (
                  <ChapterCheckout
                    lectureId={selectedUnitId}
                    chapterId={selectedChapter._id}
                    chapterTitle={selectedChapter.title}
                    price={selectedChapter.price}
                    onUnlocked={handleChapterUnlocked}
                  />
                ) : (
                  <iframe
                    src={selectedChapter?.videoUrl}
                    title={selectedChapter?.title}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </div>

              <div className="p-6">

                <span className="text-brand-600 text-sm font-semibold">
                  Now Playing
                </span>

                <h2 className="text-2xl font-bold mt-2 text-slate-800 flex items-center gap-2">
                  {selectedChapter?.title || "Select a Chapter"}
                  {selectedChapter?.isPaid && !selectedChapter?.unlocked && (
                    <FaLock className="text-amber-500 text-base" />
                  )}
                </h2>

                <p className="mt-3 text-slate-500 leading-relaxed">
                  Continue learning by selecting any chapter from the course
                  curriculum.
                </p>

              </div>

            </div>

          </div>

          {/* Sidebar */}
          <div>

            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 sticky top-24">

              <div className="p-6 border-b">

                <h2 className="text-xl font-bold text-slate-800">
                  Course Content
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  {units.length} Units Available
                </p>

              </div>

              <div className="max-h-[650px] overflow-y-auto">

                {units.map((unit, index) => (

                  <details
                    key={index}
                    className="border-b last:border-none group"
                    open={index === 0}
                  >

                    <summary
                      className="
                  cursor-pointer
                  list-none
                  px-6
                  py-4
                  font-semibold
                  text-slate-800
                  flex
                  justify-between
                  items-center
                  hover:bg-slate-50
                  transition
                "
                    >

                      <span>{unit.unitTitle}</span>

                      <span className="text-xs text-brand-600">
                        {unit.chapters.length} Lectures
                      </span>

                    </summary>

                    <div className="pb-3">

                      {unit.chapters.map((chapter, idx) => {

                        const active =
                          selectedChapter?.title === chapter.title && selectedUnitId === unit._id;
                        const locked = chapter.isPaid && !chapter.unlocked;

                        return (

                          <button
                            key={idx}
                            onClick={() => {
                              setSelectedChapter(chapter);
                              setSelectedUnitId(unit._id);
                            }}
                            className={`
                        w-full
                        text-left
                        px-6
                        py-3
                        flex
                        items-center
                        gap-3
                        transition
                        border-l-4

                        ${active
                                ? "bg-brand-50 border-brand-600 text-brand-700"
                                : "border-transparent hover:bg-slate-50 text-slate-600"
                              }
                      `}
                          >

                            <div
                              className={`
                          w-8
                          h-8
                          rounded-full
                          flex
                          items-center
                          justify-center
                          text-xs
                          font-bold

                          ${active
                                  ? "bg-brand-600 text-white"
                                  : "bg-slate-200 text-slate-700"
                                }
                        `}
                            >
                              {idx + 1}
                            </div>

                            <div className="flex-1">

                              <p className="font-medium flex items-center gap-2">
                                {chapter.title}
                                {locked && <FaLock className="text-amber-500 text-xs shrink-0" />}
                              </p>
                              {locked && (
                                <p className="text-xs text-amber-600 font-semibold">₹{chapter.price}</p>
                              )}

                            </div>

                          </button>

                        );

                      })}

                    </div>

                  </details>

                ))}

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default LectureProgress;
