import React from "react";
import { FaSchool, FaUniversity } from "react-icons/fa";

const StepClass = ({ lectureData, setLectureData }) => {

    const handleSelect = (value) => {

        setLectureData({
            ...lectureData,
            classType: value,

            // Reset lower-level selections
            year: "",
            group: "",
            subject: "",
            chapters: []
        });

    };

    return (

        <div>

            <h2 className="text-3xl font-bold text-slate-800">

                Select Course

            </h2>

            <p className="text-slate-500 mt-2">

                Choose where you want to add learning content.

            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">

                {/* Class 10 */}

                <button
                    onClick={() => handleSelect("Class10")}
                    className={`
                        rounded-3xl
                        p-8
                        transition-all
                        duration-300
                        shadow-lg
                        border-2
                        hover:scale-105

                        ${lectureData.classType === "Class10"
                            ? "border-blue-600 bg-blue-50"
                            : "border-slate-200 bg-white"
                        }
                    `}
                >

                    <div className="flex justify-center">

                        <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">

                            <FaSchool
                                className="text-5xl text-blue-600"
                            />

                        </div>

                    </div>

                    <h3 className="text-2xl font-bold mt-6">

                        Class 10

                    </h3>

                    <p className="mt-3 text-slate-500">

                        Mathematics, Science, Biology, English,
                        Hindi, Telugu, Urdu and Social Studies.

                    </p>

                </button>

                {/* Intermediate */}

                <button
                    onClick={() => handleSelect("Intermediate")}
                    className={`
                        rounded-3xl
                        p-8
                        transition-all
                        duration-300
                        shadow-lg
                        border-2
                        hover:scale-105

                        ${lectureData.classType === "Intermediate"
                            ? "border-indigo-600 bg-indigo-50"
                            : "border-slate-200 bg-white"
                        }
                    `}
                >

                    <div className="flex justify-center">

                        <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center">

                            <FaUniversity
                                className="text-5xl text-indigo-600"
                            />

                        </div>

                    </div>

                    <h3 className="text-2xl font-bold mt-6">

                        Intermediate

                    </h3>

                    <p className="mt-3 text-slate-500">

                        First Year & Second Year with
                        MPC, BiPC, MEC and CEC.

                    </p>

                </button>

            </div>

        </div>

    );

};

export default StepClass;