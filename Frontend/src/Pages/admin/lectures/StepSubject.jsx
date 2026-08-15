import React from "react";

const classTenSubjects = [
    "Mathematics",
    "Physics",
    "Biology",
    "English",
    "Hindi",
    "Telugu",
    "Urdu",
    "Social Studies"
];

const intermediateData = {
    "MPC": [
        "Maths 1A",
        "Maths 1B",
        "Physics",
        "Chemistry",
        "English",
        "Arabic"
    ],

    "BiPC": [
        "Botany",
        "Zoology",
        "Physics",
        "Chemistry",
        "English",
        "Arabic"
    ],

    "MEC": [
        "Mathematics",
        "Economics",
        "Commerce",
        "English"
    ],

    "CEC": [
        "Economics",
        "Commerce",
        "Civics",
        "English"
    ]
};

const StepSubject = ({ lectureData, setLectureData }) => {

    const updateField = (field, value) => {

        setLectureData({

            ...lectureData,

            [field]: value

        });

    };

    return (

        <div>

            <h2 className="text-3xl font-bold text-slate-800">

                Course Information

            </h2>

            <p className="text-slate-500 mt-2">

                Select the subject where lectures will be added.

            </p>

            {/* ================= CLASS 10 ================= */}

            {

                lectureData.classType === "Class10"

                &&

                <div className="mt-8">

                    <label className="font-semibold">

                        Subject

                    </label>

                    <select

                        value={lectureData.subject}

                        onChange={(e) => updateField("subject", e.target.value)}

                        className="w-full mt-3 p-4 rounded-xl border"

                    >

                        <option value="">

                            Select Subject

                        </option>

                        {

                            classTenSubjects.map(subject => (

                                <option

                                    key={subject}

                                    value={subject}

                                >

                                    {subject}

                                </option>

                            ))

                        }

                    </select>

                </div>

            }

            {/* ================= INTERMEDIATE ================= */}

            {

                lectureData.classType === "Intermediate"

                &&

                <div className="space-y-8 mt-8">

                    {/* Year */}

                    <div>

                        <label className="font-semibold">

                            Academic Year

                        </label>

                        <select

                            value={lectureData.year}

                            onChange={(e) => {

                                setLectureData({

                                    ...lectureData,

                                    year: e.target.value,

                                    group: "",

                                    subject: ""

                                })

                            }}

                            className="w-full mt-3 p-4 rounded-xl border"

                        >

                            <option value="">

                                Select Year

                            </option>

                            <option>

                                First Year

                            </option>

                            <option>

                                Second Year

                            </option>

                        </select>

                    </div>

                    {/* Group */}

                    {

                        lectureData.year &&

                        <div>

                            <label className="font-semibold">

                                Group

                            </label>

                            <select

                                value={lectureData.group}

                                onChange={(e) => {

                                    setLectureData({

                                        ...lectureData,

                                        group: e.target.value,

                                        subject: ""

                                    })

                                }}

                                className="w-full mt-3 p-4 rounded-xl border"

                            >

                                <option value="">

                                    Select Group

                                </option>

                                <option>

                                    MPC

                                </option>

                                <option>

                                    BiPC

                                </option>

                                <option>

                                    MEC

                                </option>

                                <option>

                                    CEC

                                </option>

                            </select>

                        </div>

                    }

                    {/* Subject */}

                    {

                        lectureData.group &&

                        <div>

                            <label className="font-semibold">

                                Subject

                            </label>

                            <select

                                value={lectureData.subject}

                                onChange={(e) => updateField("subject", e.target.value)}

                                className="w-full mt-3 p-4 rounded-xl border"

                            >

                                <option value="">

                                    Select Subject

                                </option>

                                {

                                    intermediateData[lectureData.group].map(subject => (

                                        <option

                                            key={subject}

                                            value={subject}

                                        >

                                            {subject}

                                        </option>

                                    ))

                                }

                            </select>

                        </div>

                    }

                </div>

            }

        </div>

    );

};

export default StepSubject;