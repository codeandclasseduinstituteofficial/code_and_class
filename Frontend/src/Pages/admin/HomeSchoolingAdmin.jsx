import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { authAxios } from "../../utils/authAxios";
import { AuthContext } from "../../context/AuthProvider";

const HomeSchoolingAdmin = () => {

    const [videos, setVideos] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const [editId, setEditId] = useState(null);
    const { accessToken } = useContext(AuthContext);

    const api = authAxios(() => accessToken);

    const [formData, setFormData] = useState({
        title: "",
        videoLink: "",
        ageLimit: ""
    });


    const API = `${import.meta.env.VITE_API_URL || "https://code-and-class.onrender.com/api"}/homeSchooling`;


    // Get Videos
    const fetchVideos = async () => {
        try {
            const res = await axios.get(API);
            setVideos(res.data.data);
        } catch (error) {
            console.log(error);
        }
    };


    useEffect(() => {
        fetchVideos();
    }, []);



    // Input Change
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };



    // Add / Update
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            if (editId) {

                await api.put(
                    `${API}/${editId}`,
                    formData
                );

            } else {

                await api.post(
                    `${API}/add`,
                    formData
                );

            }


            setFormData({
                title: "",
                videoLink: "",
                ageLimit: ""
            });

            setEditId(null);
            setShowModal(false);

            fetchVideos();


        } catch (error) {
            console.log(error);
        }

    };



    // Delete
    const deleteVideo = async (id) => {

        if (!window.confirm("Delete this video?")) return;

        await api.delete(
            `${API}/${id}`
        );

        fetchVideos();

    };



    // Edit
    const editVideo = (video) => {

        setEditId(video._id);

        setFormData({
            title: video.title,
            videoLink: video.videoLink,
            ageLimit: video.ageLimit
        });

        setShowModal(true);

    };




    return (

        <div className="min-h-screen bg-gray-100 p-4 md:p-8 mt-10">


            {/* Header */}

            <div className="flex flex-col md:flex-row justify-between items-center mb-8">

                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Home Schooling Videos
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Manage educational videos and learning content
                    </p>

                </div>


                <button

                    onClick={() => setShowModal(true)}

                    className="
        mt-4 md:mt-0
        bg-blue-600
        text-white
        px-6
        py-3
        rounded-xl
        shadow
        hover:bg-blue-700
        transition
        "

                >
                    + Add Video
                </button>


            </div>





            {/* Cards */}


            <div className="
      grid
      grid-cols-1
      sm:grid-cols-2
      lg:grid-cols-3
      gap-6
      ">


                {
                    videos.map(video => (


                        <div

                            key={video._id}

                            className="
          bg-white
          rounded-2xl
          shadow-md
          overflow-hidden
          hover:shadow-xl
          transition
          "

                        >


                            <div className="
          h-40
          bg-gradient-to-r
          from-blue-500
          to-purple-600
          flex
          items-center
          justify-center
          ">

                                <span className="
            text-white
            text-5xl
            ">
                                    ▶
                                </span>

                            </div>



                            <div className="p-5">


                                <h2 className="
            text-xl
            font-semibold
            text-gray-800
            ">
                                    {video.title}
                                </h2>


                                <p className="
            text-gray-500
            mt-2
            ">
                                    Age: {video.ageLimit}
                                </p>


                                <a

                                    href={video.videoLink}

                                    target="_blank"

                                    className="
            block
            mt-3
            text-blue-600
            break-all
            "

                                >
                                    {video.videoLink}
                                </a>



                                <div className="
            flex
            gap-3
            mt-5
            ">


                                    <button

                                        onClick={() => editVideo(video)}

                                        className="
              flex-1
              bg-yellow-500
              text-white
              py-2
              rounded-lg
              hover:bg-yellow-600
              "
                                    >
                                        Edit
                                    </button>


                                    <button

                                        onClick={() => deleteVideo(video._id)}

                                        className="
              flex-1
              bg-red-500
              text-white
              py-2
              rounded-lg
              hover:bg-red-600
              "
                                    >
                                        Delete
                                    </button>


                                </div>


                            </div>


                        </div>


                    ))
                }


            </div>







            {/* Modal */}


            {
                showModal &&

                <div className="
      fixed
      inset-0
      bg-black/50
      flex
      items-center
      justify-center
      p-4
      ">


                    <div className="
        bg-white
        rounded-2xl
        w-full
        max-w-lg
        p-6
        ">


                        <h2 className="
          text-2xl
          font-bold
          mb-5
          ">
                            {editId ? "Edit Video" : "Add Video"}
                        </h2>



                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4"
                        >


                            <input

                                name="title"

                                value={formData.title}

                                onChange={handleChange}

                                placeholder="Video title"

                                className="
            w-full
            border
            p-3
            rounded-lg
            "

                            />



                            <input

                                name="videoLink"

                                value={formData.videoLink}

                                onChange={handleChange}

                                placeholder="Youtube video link"

                                className="
            w-full
            border
            p-3
            rounded-lg
            "

                            />



                            <input

                                name="ageLimit"

                                value={formData.ageLimit}

                                onChange={handleChange}

                                placeholder="Age limit"

                                className="
            w-full
            border
            p-3
            rounded-lg
            "

                            />



                            <div className="
            flex
            gap-3
            ">


                                <button

                                    type="submit"

                                    className="
            flex-1
            bg-blue-600
            text-white
            py-3
            rounded-lg
            "
                                >
                                    Save
                                </button>


                                <button

                                    type="button"

                                    onClick={() => setShowModal(false)}

                                    className="
            flex-1
            bg-gray-300
            py-3
            rounded-lg
            "
                                >
                                    Cancel
                                </button>


                            </div>



                        </form>


                    </div>


                </div>

            }


        </div>

    );

};


export default HomeSchoolingAdmin;