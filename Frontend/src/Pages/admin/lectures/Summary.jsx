import React, { useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthProvider";
import {
    addClassTenLecture,
    addIntermediateLecture
} from "../../../services/lecture.service";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Summary = ({ lectureData }) => {

    const navigate = useNavigate()
    const { accessToken } = useContext(AuthContext);

    const [loading, setLoading] = useState(false);

    const submitData = async () => {


        try {


            setLoading(true);



            let response;



            if (
                lectureData.classType === "Class10"
            ) {

                response =
                    await addClassTenLecture(
                        lectureData,
                        accessToken
                    );

            }

            else {


                response =
                    await addIntermediateLecture(
                        lectureData,
                        accessToken
                    );


            }



            toast.success(
                "Lecture published successfully"
            );

            navigate('/dashboard')


        }
        catch (error) {


            toast.error(error.message);


        }
        finally {


            setLoading(false);


        }


    };

    return (

        <div>

            <h2 className="text-3xl font-bold">

                Review Content

            </h2>

            <p className="text-slate-500 mt-2">

                Review everything before publishing.

            </p>

            <div className="mt-8 bg-slate-50 rounded-2xl p-8">

                <div className="space-y-3">

                    <p>

                        <strong>Class :</strong>

                        {lectureData.classType}

                    </p>

                    {

                        lectureData.classType === "Intermediate"

                        &&

                        <>

                            <p>

                                <strong>Year :</strong>

                                {lectureData.year}

                            </p>

                            <p>

                                <strong>Group :</strong>

                                {lectureData.group}

                            </p>

                        </>

                    }

                    <p>

                        <strong>Subject :</strong>

                        {lectureData.subject}

                    </p>

                </div>

                <div className="mt-10">

                    {

                        lectureData.chapters.map((chapter, chapterIndex) => (

                            <div

                                key={chapterIndex}

                                className="mb-8 bg-white rounded-2xl border shadow"

                            >

                                <div className="p-5 border-b">

                                    <h3 className="text-xl font-bold">

                                        {chapter.chapterNo}

                                    </h3>

                                    <p className="text-slate-500">

                                        {chapter.chapterName}

                                    </p>

                                </div>

                                <div className="p-5">

                                    {

                                        chapter.problems.map((problem, index) => (

                                            <div

                                                key={index}

                                                className="border rounded-xl p-4 mb-4"

                                            >

                                                <h4 className="font-bold">

                                                    {problem.name}

                                                </h4>

                                                <p className="mt-2 text-sm text-slate-500">

                                                    {problem.description}

                                                </p>

                                                <a

                                                    href={problem.videoLink}

                                                    target="_blank"

                                                    rel="noreferrer"

                                                    className="text-blue-600"

                                                >

                                                    Video Link

                                                </a>

                                                <div className="mt-3">

                                                    {

                                                        problem.isPaid

                                                            ?

                                                            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full">

                                                                Paid ₹{problem.price}

                                                            </span>

                                                            :

                                                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">

                                                                Free

                                                            </span>

                                                    }

                                                </div>

                                            </div>

                                        ))

                                    }

                                </div>

                            </div>

                        ))

                    }

                </div>

                <button

                    onClick={submitData}

                    disabled={loading}

                    className="w-full mt-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold"

                >

                    {

                        loading

                            ?

                            "Publishing..."

                            :

                            "Publish Course"

                    }

                </button>

            </div>

        </div>

    );

};

export default Summary;