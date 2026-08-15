import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const SpokenEnglishProgress = () => {
  const { level } = useParams();

  const [units, setUnits] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(null);

  const API_BASE = `${import.meta.env.VITE_API_URL || "https://code-and-class.onrender.com/api"}/spoken-lectures`;

  useEffect(() => {
    fetchUnits();
  }, [level]);

  useEffect(() => {
    if (units.length > 0 && units[0]?.chapters?.length > 0) {
      setSelectedChapter(units[0].chapters[0]);
    }
  }, [units]);

  const fetchUnits = async () => {
    try {
      const response = await fetch(`${API_BASE}/class/${level}`);
      const data = await response.json();
      setUnits(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative top-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-700 via-brand-600 to-brand-500 text-white">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <p className="uppercase tracking-widest text-brand-100 text-sm">
            Spoken English
          </p>

          <h1 className="text-3xl md:text-5xl font-bold mt-2">
            {level} Level
          </h1>

          <p className="mt-3 text-brand-100 max-w-2xl">
            Improve your spoken English with structured lessons. Watch every
            lecture in sequence and build your confidence step by step.
          </p>
        </div>
      </div>

      <div className="max-w-8xl mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Video Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="aspect-video bg-black">
                {selectedChapter ? (
                  <iframe
                    src={selectedChapter.videoUrl}
                    title={selectedChapter.title}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white">
                    No video available
                  </div>
                )}
              </div>

              <div className="p-6">
                <span className="text-brand-600 text-sm font-semibold">
                  Now Playing
                </span>

                <h2 className="text-2xl font-bold mt-2 text-slate-800">
                  {selectedChapter?.title || "Select a Lesson"}
                </h2>

                <p className="mt-3 text-slate-500 leading-relaxed">
                  Continue your spoken English journey by selecting any lesson
                  from the curriculum.
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
                    <summary className="cursor-pointer list-none px-6 py-4 font-semibold text-slate-800 flex justify-between items-center hover:bg-slate-50 transition">
                      <span>{unit.unitTitle}</span>

                      <span className="text-xs text-brand-600">
                        {unit.chapters.length} Lessons
                      </span>
                    </summary>

                    <div className="pb-3">
                      {unit.chapters.map((chapter, idx) => {
                        const active =
                          selectedChapter?.title === chapter.title;

                        return (
                          <button
                            key={idx}
                            onClick={() => setSelectedChapter(chapter)}
                            className={`w-full text-left px-6 py-3 flex items-center gap-3 transition border-l-4 ${active
                                ? "bg-brand-50 border-brand-600 text-brand-700"
                                : "border-transparent hover:bg-slate-50 text-slate-600"
                              }`}
                          >
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${active
                                  ? "bg-brand-600 text-white"
                                  : "bg-slate-200 text-slate-700"
                                }`}
                            >
                              {idx + 1}
                            </div>

                            <div>
                              <p className="font-medium">{chapter.title}</p>
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

export default SpokenEnglishProgress;