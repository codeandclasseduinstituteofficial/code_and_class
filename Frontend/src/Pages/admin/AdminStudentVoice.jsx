import React, { useState } from "react";
import axios from "axios";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthProvider";
import { authAxios } from "../../utils/authAxios";
import {
    FaCheckCircle,
    FaTimesCircle,
    FaVideo,
    FaSearch,
    FaUserGraduate,
    FaBookOpen,
    FaClock,
} from "react-icons/fa";

const AdminStudentVoice = () => {
    const [voices, setVoices] = useState([]);
    const [search, setSearch] = useState("");

    const { accessToken } = useContext(AuthContext);

    const api = authAxios(() => accessToken);

    const approveVoice = async (id) => {

        try {

            await api.put(
                `/studentVoice/approve/${id}`
            );


            setVoices((prev) =>
                prev.map((voice) =>
                    voice._id === id
                        ?
                        {
                            ...voice,
                            approved: true
                        }
                        :
                        voice
                )
            );


        } catch (error) {

            console.log(error);

        }

    };

    const fetchStudentVoices = async () => {

        try {

            const { data } = await api.get(
                "/studentVoice/admin/all"
            );


            setVoices(
                data.voices || []
            );


        } catch (error) {

            console.log(
                "Fetch Student Voices Error:",
                error.response?.data || error.message
            );

        }

    };


    useEffect(() => {

        fetchStudentVoices();

    }, []);


    const rejectVoice = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to reject and delete this student voice?"
        );


        if (!confirmDelete)
            return;


        try {

            await api.delete(
                `/studentVoice/${id}`
            );


            setVoices((prev) =>
                prev.filter(
                    voice => voice._id !== id
                )
            );


        } catch (error) {

            console.log(error);

        }

    };

    const filteredVoices = voices.filter((voice) =>
        voice.name
            .toLowerCase()
            .includes(search.toLowerCase())
    );


    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8 mt-10">

            <div className="max-w-7xl mx-auto">


                {/* Header */}

                <div className="bg-gradient-to-r from-brand-600 to-brand-700 rounded-3xl p-8 text-white shadow-xl">

                    <h1 className="text-3xl md:text-4xl font-bold">
                        Student Voices
                    </h1>

                    <p className="mt-3 text-brand-100 max-w-2xl">
                        Review student testimonials, approve genuine
                        experiences, and publish them on your website.
                    </p>


                </div>



                {/* Stats */}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">


                    <div className="bg-white rounded-2xl shadow p-6">

                        <p className="text-slate-500">
                            Total Submissions
                        </p>

                        <h2 className="text-3xl font-bold mt-2">
                            {voices.length}
                        </h2>

                    </div>



                    <div className="bg-white rounded-2xl shadow p-6">

                        <p className="text-slate-500">
                            Pending Review
                        </p>

                        <h2 className="text-3xl font-bold text-orange-500 mt-2">
                            {
                                voices.filter(
                                    v => !v.approved
                                ).length
                            }
                        </h2>

                    </div>



                    <div className="bg-white rounded-2xl shadow p-6">

                        <p className="text-slate-500">
                            Published
                        </p>

                        <h2 className="text-3xl font-bold text-green-600 mt-2">
                            {
                                voices.filter(
                                    v => v.approved
                                ).length
                            }
                        </h2>

                    </div>


                </div>




                {/* Search */}

                <div className="bg-white rounded-2xl shadow mt-8 p-5">

                    <div className="relative max-w-md">

                        <FaSearch
                            className="absolute left-4 top-4 text-slate-400"
                        />


                        <input
                            type="text"
                            placeholder="Search student..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="
              w-full
              pl-11
              pr-4
              py-3
              border
              rounded-xl
              outline-none
              focus:border-brand-600
              "
                        />

                    </div>

                </div>




                {/* Desktop Table */}

                <div className="hidden md:block bg-white rounded-3xl shadow mt-6 overflow-hidden">


                    <table className="w-full">


                        <thead className="bg-slate-100">

                            <tr>

                                <th className="p-4 text-left">
                                    Student
                                </th>

                                <th className="p-4 text-left">
                                    Course
                                </th>

                                <th className="p-4 text-left">
                                    Description
                                </th>

                                <th className="p-4 text-left">
                                    Status
                                </th>

                                <th className="p-4 text-center">
                                    Actions
                                </th>

                            </tr>

                        </thead>



                        <tbody>

                            {filteredVoices.map((voice) => (

                                <tr
                                    key={voice._id}
                                    className="border-t hover:bg-slate-50"
                                >


                                    <td className="p-4">

                                        <div className="flex items-center gap-3">

                                            <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
                                                <FaUserGraduate className="text-brand-600" />
                                            </div>


                                            <span className="font-semibold">
                                                {voice?.name}
                                            </span>

                                        </div>

                                    </td>


                                    <td className="p-4">

                                        <div className="flex gap-2 items-center">
                                            <FaBookOpen className="text-slate-400" />
                                            {voice?.course}
                                        </div>

                                    </td>


                                    <td className="p-4 max-w-xs text-sm text-slate-600">

                                        {voice?.description}

                                    </td>



                                    <td className="p-4">
                                        {
                                            voice?.approved === true
                                                ?
                                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                                                    Approved
                                                </span>
                                                :
                                                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                                                    Pending
                                                </span>
                                        }

                                    </td>



                                    <td className="p-4">

                                        <div className="flex justify-center gap-3">


                                            <button
                                                onClick={() => approveVoice(voice?._id)}
                                                className="
                    w-10 h-10
                    rounded-lg
                    bg-green-100
                    text-green-600
                    hover:bg-green-600
                    hover:text-white
                    transition
                    "
                                            >

                                                <FaCheckCircle className="mx-auto" />

                                            </button>



                                            <button
                                                onClick={() => rejectVoice(voice?._id)}
                                                className="
                    w-10 h-10
                    rounded-lg
                    bg-red-100
                    text-red-600
                    hover:bg-red-600
                    hover:text-white
                    transition
                    "
                                            >

                                                <FaTimesCircle className="mx-auto" />

                                            </button>


                                        </div>

                                    </td>


                                </tr>

                            ))}

                        </tbody>


                    </table>


                </div>





                {/* Mobile Cards */}

                <div className="md:hidden space-y-5 mt-6">


                    {
                        filteredVoices.map((voice) => (

                            <div
                                key={voice?._id}
                                className="bg-white rounded-2xl shadow p-5"
                            >

                                <h3 className="font-bold text-lg">
                                    {voice?.name}
                                </h3>


                                <p className="text-sm text-slate-500 mt-2">
                                    {voice?.course}
                                </p>


                                <p className="text-sm text-slate-600 mt-3">
                                    {voice?.description}
                                </p>


                                <div className="flex gap-3 mt-5">

                                    <button
                                        onClick={() => approveVoice(voice?._id)}
                                        className="flex-1 bg-green-600 text-white py-2 rounded-lg"
                                    >
                                        Approve
                                    </button>


                                    <button
                                        onClick={() => rejectVoice(voice?._id)}
                                        className="flex-1 bg-red-600 text-white py-2 rounded-lg"
                                    >
                                        Reject
                                    </button>

                                </div>


                            </div>

                        ))
                    }


                </div>



            </div>

        </div>
    );
};


export default AdminStudentVoice;