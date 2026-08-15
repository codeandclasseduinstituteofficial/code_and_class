import React, { useState } from "react";

import ProgressStepper from "../../../Pages/admin/lectures/ProgressStepper";
import StepClass from "../../../Pages/admin/lectures/StepClass";
import StepSubject from "../../../Pages/admin/lectures/StepSubject";
// import StepIntermediate from "../../../Pages/admin/lectures/StepIntermediate";
import ChapterManager from "../../../Pages/admin/lectures/ChapterManager";
import Summary from "../../../Pages/admin/lectures/Summary";
import { toast } from "react-toastify";

const AddLecture = () => {

    const [step, setStep] = useState(1);

    const [lectureData, setLectureData] = useState({

        classType: "",

        year: "",

        group: "",

        subject: "",

        chapters: []

    });


    const nextStep = () => {


        if (step === 1 && !lectureData.classType) {

            toast.error("Please select class");

            return;

        }



        if (step === 2) {


            if (
                !lectureData.subject
            ) {

                toast.error("Please select subject");

                return;

            }


            if (
                lectureData.classType === "Intermediate"
                &&
                (
                    !lectureData.year ||
                    !lectureData.group
                )

            ) {

                toast.error(
                    "Please select year and group"
                );

                return;

            }


        }



        if (step === 3) {


            if (
                lectureData.chapters.length === 0
            ) {

                toast.error(
                    "Add at least one chapter"
                );

                return;

            }


        }



        setStep(step + 1);



    };


    const previousStep = () => {

        if (step > 1) {
            setStep(step - 1);
        }

    };


    return (

        <div className="min-h-screen bg-slate-100 py-10 px-4">

            <div className="max-w-7xl mx-auto">

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

                    <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8">

                        <h1 className="text-4xl font-bold text-white">

                            Add Learning Content

                        </h1>

                        <p className="text-blue-100 mt-2">

                            Create courses for Class 10 and Intermediate.

                        </p>

                    </div>

                    <div className="p-8">

                        <ProgressStepper step={step} />

                        <div className="mt-10">

                            {step === 1 && (

                                <StepClass

                                    lectureData={lectureData}

                                    setLectureData={setLectureData}

                                />

                            )}

                            {step === 2 && (

                                <StepSubject

                                    lectureData={lectureData}

                                    setLectureData={setLectureData}

                                />

                            )}

                            {step === 3 && (

                                <ChapterManager

                                    lectureData={lectureData}

                                    setLectureData={setLectureData}

                                />

                            )}

                            {step === 4 && (

                                <Summary

                                    lectureData={lectureData}

                                />

                            )}

                        </div>

                        <div className="flex justify-between mt-10">

                            <button

                                onClick={previousStep}

                                disabled={step === 1}

                                className="px-8 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 disabled:opacity-40"

                            >

                                Previous

                            </button>

                            {

                                step < 4 && (

                                    <button

                                        onClick={nextStep}

                                        className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white"

                                    >

                                        Next

                                    </button>

                                )

                            }

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

};

export default AddLecture;