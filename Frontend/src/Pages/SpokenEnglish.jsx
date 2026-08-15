import React, { useEffect, useState } from "react";
import {
    FaHeadphones,
    FaBookOpen,
    FaPenFancy,
    FaMicrophone,
    FaChevronLeft,
    FaPlayCircle,
} from "react-icons/fa";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const SKILLS = [
    {
        key: "Listening",
        label: "Listening",
        icon: FaHeadphones,
        gradient: "from-indigo-500 to-blue-600",
        blurb: "Train your ear with real conversations and audio lessons.",
    },
    {
        key: "Reading",
        label: "Reading",
        icon: FaBookOpen,
        gradient: "from-emerald-500 to-teal-600",
        blurb: "Build vocabulary and comprehension with guided passages.",
    },
    {
        key: "Writing",
        label: "Writing",
        icon: FaPenFancy,
        gradient: "from-amber-500 to-orange-600",
        blurb: "Practice structured writing tasks at every level.",
    },
    {
        key: "Speaking",
        label: "Speaking",
        icon: FaMicrophone,
        gradient: "from-rose-500 to-pink-600",
        blurb: "Gain confidence and fluency through speaking practice.",
    },
];

const toEmbedUrl = (url) => {
    if (!url) return url;
    if (url.includes("watch?v=")) return url.replace("watch?v=", "embed/");
    return url;
};

const SpokenEnglish = () => {
    const [skill, setSkill] = useState(null);
    const [levels, setLevels] = useState([]);
    const [levelsLoading, setLevelsLoading] = useState(false);
    const [selectedLevel, setSelectedLevel] = useState(null);

    useEffect(() => {
        if (!skill) return;

        setLevelsLoading(true);
        setSelectedLevel(null);

        fetch(`${API_BASE}/spoken-english/skill/${skill}`)
            .then((res) => res.json())
            .then((data) => setLevels(data.data || []))
            .catch(() => setLevels([]))
            .finally(() => setLevelsLoading(false));
    }, [skill]);

    return (
        <div className="min-h-screen bg-gray-50 p-5 md:p-10 mt-10">
            <div className="max-w-7xl mx-auto">

                <h1 className="text-4xl font-bold text-center">
                    Spoken English
                </h1>

                <p className="text-center text-gray-500 mt-3 max-w-2xl mx-auto">
                    Master English one skill at a time — pick a skill below,
                    then choose your level to get started.
                </p>

                {/* SKILL CARDS */}
                {!skill && (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
                        {SKILLS.map((s) => {
                            const Icon = s.icon;
                            return (
                                <button
                                    key={s.key}
                                    onClick={() => setSkill(s.key)}
                                    className={`bg-gradient-to-br ${s.gradient} text-white rounded-3xl p-8 shadow-xl hover:scale-105 transition text-left`}
                                >
                                    <Icon className="text-4xl mb-5" />
                                    <h2 className="text-2xl font-bold">{s.label}</h2>
                                    <p className="text-sm text-white/80 mt-2">{s.blurb}</p>
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* LEVELS */}
                {skill && !selectedLevel && (
                    <div className="mt-10">
                        <button
                            onClick={() => setSkill(null)}
                            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6"
                        >
                            <FaChevronLeft /> All skills
                        </button>

                        <h2 className="text-3xl font-bold">{skill}</h2>

                        {levelsLoading && (
                            <p className="text-gray-500 mt-6">Loading levels...</p>
                        )}

                        {!levelsLoading && levels.length === 0 && (
                            <p className="text-gray-500 mt-6">
                                No levels have been added for {skill} yet. Please check back soon.
                            </p>
                        )}

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                            {levels.map((lvl) => (
                                <button
                                    key={lvl._id}
                                    onClick={() => setSelectedLevel(lvl)}
                                    className="bg-white shadow-lg rounded-2xl p-6 text-left hover:bg-indigo-50 border"
                                >
                                    <span className="inline-block bg-indigo-100 text-indigo-700 text-sm font-bold px-3 py-1 rounded-full">
                                        {lvl.levelName}
                                    </span>
                                    <h3 className="text-xl font-bold mt-3">{lvl.title}</h3>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* LEVEL DETAIL */}
                {skill && selectedLevel && (
                    <div className="mt-10">
                        <button
                            onClick={() => setSelectedLevel(null)}
                            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6"
                        >
                            <FaChevronLeft /> All {skill} levels
                        </button>

                        <div className="bg-white rounded-3xl shadow p-6 md:p-8">
                            <span className="inline-block bg-indigo-100 text-indigo-700 text-sm font-bold px-3 py-1 rounded-full">
                                {selectedLevel.levelName}
                            </span>

                            <h2 className="text-3xl font-bold mt-4">
                                {selectedLevel.title}
                            </h2>

                            {selectedLevel.description && (
                                <p className="text-gray-600 mt-4 leading-relaxed whitespace-pre-line">
                                    {selectedLevel.description}
                                </p>
                            )}

                            {/* Listening: audio/video player */}
                            {skill === "Listening" && selectedLevel.audioUrl && (
                                <div className="mt-8">
                                    <h3 className="font-bold flex items-center gap-2 mb-3">
                                        <FaPlayCircle /> Listen
                                    </h3>
                                    {selectedLevel.audioUrl.includes("youtube") || selectedLevel.audioUrl.includes("youtu.be") ? (
                                        <div className="aspect-video rounded-2xl overflow-hidden bg-black">
                                            <iframe
                                                title="Listening audio"
                                                className="w-full h-full"
                                                src={toEmbedUrl(selectedLevel.audioUrl)}
                                                allowFullScreen
                                            />
                                        </div>
                                    ) : (
                                        <audio controls className="w-full">
                                            <source src={selectedLevel.audioUrl} />
                                        </audio>
                                    )}
                                </div>
                            )}

                            {/* Reading: supporting image */}
                            {skill === "Reading" && selectedLevel.imageUrl && (
                                <div className="mt-8">
                                    <img
                                        src={selectedLevel.imageUrl}
                                        alt={selectedLevel.title}
                                        className="w-full rounded-2xl border"
                                    />
                                </div>
                            )}

                            {/* Writing: the task/prompt */}
                            {skill === "Writing" && selectedLevel.writingPrompt && (
                                <div className="mt-8 bg-amber-50 border border-amber-200 rounded-2xl p-6">
                                    <h3 className="font-bold text-amber-700 mb-2">
                                        Writing Task
                                    </h3>
                                    <p className="text-gray-700 whitespace-pre-line">
                                        {selectedLevel.writingPrompt}
                                    </p>
                                </div>
                            )}

                            {/* Speaking: practice video, if provided */}
                            {skill === "Speaking" && selectedLevel.videoUrl && (
                                <div className="mt-8 aspect-video rounded-2xl overflow-hidden bg-black">
                                    <iframe
                                        title="Speaking practice"
                                        className="w-full h-full"
                                        src={toEmbedUrl(selectedLevel.videoUrl)}
                                        allowFullScreen
                                    />
                                </div>
                            )}

                            {/* Any skill can optionally include a supporting video */}
                            {skill !== "Speaking" && selectedLevel.videoUrl && (
                                <div className="mt-8 aspect-video rounded-2xl overflow-hidden bg-black">
                                    <iframe
                                        title="Supporting video"
                                        className="w-full h-full"
                                        src={toEmbedUrl(selectedLevel.videoUrl)}
                                        allowFullScreen
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default SpokenEnglish;
