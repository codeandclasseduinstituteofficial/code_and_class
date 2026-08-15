import React, { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { authAxios } from "../../utils/authAxios";


import {
    Search,
    Plus,
    Pencil,
    Trash2,
    X,
    Users,
    Loader2,
    Image as ImageIcon,
    BadgeCheck,
    AlignLeft,
} from "lucide-react";
import { AuthContext } from "../../context/AuthProvider";

const API = `${import.meta.env.VITE_API_URL || "https://code-and-class.onrender.com/api"}/supporters`;

const Supporter = () => {

    const [supporters, setSupporters] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    const [selectedId, setSelectedId] = useState(null);

    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        imgLink: "",
        name: "",
        designation: "",
        description: "",
    });
    const { accessToken } = useContext(AuthContext);

    const api = authAxios(() => accessToken);



    // =========================
    // Fetch Supporters
    // =========================

    const fetchSupporters = async () => {

        try {

            setLoading(true);

            const res = await axios.get(`${API}/`);

            setSupporters(res.data.data || []);

        } catch (error) {

            console.log(error);
            toast.error("Failed to fetch supporters");

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchSupporters();

    }, []);



    // =========================
    // Handle Input
    // =========================

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };



    // =========================
    // Open Add Modal
    // =========================

    const openAddModal = () => {

        setIsEditing(false);

        setSelectedId(null);

        setFormData({
            imgLink: "",
            name: "",
            designation: "",
            description: ""
        });

        setShowForm(true);

    };



    // =========================
    // Open Edit Modal
    // =========================

    const openEditModal = (supporter) => {

        setIsEditing(true);

        setSelectedId(supporter._id);

        setFormData({
            imgLink: supporter.imgLink,
            name: supporter.name,
            designation: supporter.designation,
            description: supporter.description
        });


        setShowForm(true);

    };



    // =========================
    // Open Delete Modal
    // =========================

    const openDeleteModal = (id) => {

        setSelectedId(id);

        setShowDelete(true);

    };



    // =========================
    // Search
    // =========================

    const filteredSupporters = useMemo(() => {

        return supporters.filter((item) => {

            const keyword = search.toLowerCase();


            return (
                item.name.toLowerCase().includes(keyword) ||
                item.designation.toLowerCase().includes(keyword)
            );

        });


    }, [supporters, search]);



    return (

        <div className="min-h-screen bg-gray-100 mt-16">


            {/* Header */}

            <div className="bg-white shadow-sm border-b">

                <div className="max-w-7xl mx-auto px-5 py-5">


                    <div className="flex flex-col lg:flex-row justify-between gap-5">


                        <div>

                            <h1 className="text-3xl font-bold flex items-center gap-3 text-gray-800">

                                <Users
                                    size={35}
                                    className="text-indigo-600"
                                />

                                Supporters

                            </h1>


                            <p className="text-gray-500 mt-2">

                                Manage all supporters

                            </p>


                        </div>


                        <div className="flex flex-col sm:flex-row gap-3">


                            <div className="relative flex justify-center">


                                <Search
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                />


                                <input

                                    value={search}

                                    onChange={(e) => setSearch(e.target.value)}

                                    placeholder="Search supporter..."

                                    className="pl-11 pr-4 py-3 rounded-xl border bg-gray-50 outline-none focus:ring-2 focus:ring-indigo-500"

                                />


                            </div>


                            <button

                                onClick={openAddModal}

                                className="bg-indigo-600 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-700"

                            >

                                <Plus size={20} />

                                Add Supporter

                            </button>


                        </div>


                    </div>


                </div>


            </div>

            {/* =========================
          Statistics
      ========================= */}

            <div className="max-w-7xl mx-auto px-5 mt-8">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">


                    {/* Total Supporters */}

                    <div className="bg-white rounded-2xl shadow-md border p-6">

                        <div className="flex justify-between items-center">


                            <div>

                                <p className="text-gray-500">
                                    Total Supporters
                                </p>


                                <h2 className="text-4xl font-bold mt-3">
                                    {supporters.length}
                                </h2>


                            </div>


                            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">

                                <Users
                                    size={32}
                                    className="text-indigo-600"
                                />

                            </div>


                        </div>


                    </div>




                    {/* Search Result Count */}

                    <div className="bg-white rounded-2xl shadow-md border p-6">

                        <div className="flex justify-between items-center">


                            <div>

                                <p className="text-gray-500">
                                    Showing
                                </p>


                                <h2 className="text-4xl font-bold mt-3">
                                    {filteredSupporters.length}
                                </h2>


                            </div>


                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">


                                <BadgeCheck
                                    size={32}
                                    className="text-green-600"
                                />


                            </div>


                        </div>


                    </div>




                    {/* Dashboard Card */}

                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-6 text-white">


                        <h2 className="text-xl font-bold">

                            Supporter Dashboard

                        </h2>


                        <p className="mt-3 text-indigo-100">

                            Add, update, search and manage supporters easily.

                        </p>


                    </div>


                </div>


            </div>





            {/* =========================
  Supporters Section
========================= */}


            <div className="max-w-7xl mx-auto px-5 py-10">



                {
                    loading ? (


                        <div className="flex justify-center py-24">


                            <Loader2

                                size={55}

                                className="animate-spin text-indigo-600"

                            />


                        </div>



                    ) : filteredSupporters.length === 0 ? (


                        <div className="bg-white rounded-3xl shadow-lg border p-14 text-center">


                            <div className="w-24 h-24 mx-auto bg-indigo-100 rounded-full flex items-center justify-center">


                                <Users

                                    size={45}

                                    className="text-indigo-600"

                                />


                            </div>



                            <h2 className="text-3xl font-bold mt-6 text-gray-800">

                                No Supporters Found

                            </h2>



                            <p className="text-gray-500 mt-3">

                                Add your first supporter to start managing.

                            </p>



                            <button

                                onClick={openAddModal}

                                className="mt-6 bg-indigo-600 text-white px-7 py-3 rounded-xl"

                            >

                                Add Supporter

                            </button>



                        </div>




                    ) : (



                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">



                            {
                                filteredSupporters.map((supporter) => (


                                    <div

                                        key={supporter._id}

                                        className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition border"

                                    >



                                        {/* Image */}

                                        <div className="relative h-64 bg-gray-100 overflow-hidden">


                                            {
                                                supporter.imgLink ? (


                                                    <img

                                                        src={supporter.imgLink}

                                                        alt={supporter.name}

                                                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"

                                                    />


                                                ) : (


                                                    <div className="h-full flex items-center justify-center">


                                                        <ImageIcon

                                                            size={60}

                                                            className="text-gray-400"

                                                        />


                                                    </div>


                                                )
                                            }





                                            {/* Action Buttons */}

                                            <div className="absolute top-4 right-4 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition">


                                                <button

                                                    onClick={() => openEditModal(supporter)}

                                                    className="w-11 h-11 bg-white rounded-full shadow flex items-center justify-center hover:bg-indigo-600 hover:text-white"

                                                >

                                                    <Pencil size={18} />

                                                </button>



                                                <button

                                                    onClick={() => openDeleteModal(supporter._id)}

                                                    className="w-11 h-11 bg-white rounded-full shadow flex items-center justify-center hover:bg-red-600 hover:text-white"

                                                >

                                                    <Trash2 size={18} />

                                                </button>


                                            </div>



                                        </div>





                                        {/* Content */}

                                        <div className="p-6">


                                            <h2 className="text-2xl font-bold text-gray-800">

                                                {supporter.name}

                                            </h2>



                                            <p className="text-indigo-600 font-semibold mt-2">

                                                {supporter.designation}

                                            </p>



                                            <p className="text-gray-600 text-sm mt-5 line-clamp-4">

                                                {supporter.description}

                                            </p>



                                        </div>




                                        {/* Footer */}

                                        <div className="border-t bg-gray-50 px-6 py-4 flex justify-between">


                                            <button

                                                onClick={() => openEditModal(supporter)}

                                                className="text-indigo-600 flex gap-2 items-center font-semibold"

                                            >

                                                <Pencil size={17} />

                                                Edit

                                            </button>



                                            <button

                                                onClick={() => openDeleteModal(supporter._id)}

                                                className="text-red-600 flex gap-2 items-center font-semibold"

                                            >

                                                <Trash2 size={17} />

                                                Delete

                                            </button>



                                        </div>




                                    </div>


                                ))
                            }



                        </div>


                    )

                }



            </div>

            {/* =========================
          ADD / EDIT MODAL
      ========================= */}

            {showForm && (

                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">


                    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl">


                        {/* Modal Header */}

                        <div className="flex justify-between items-center px-7 py-5 border-b">


                            <div>

                                <h2 className="text-2xl font-bold text-gray-800">

                                    {isEditing ? "Edit Supporter" : "Add Supporter"}

                                </h2>


                                <p className="text-gray-500 mt-1">

                                    Manage supporter information

                                </p>


                            </div>



                            <button

                                onClick={() => setShowForm(false)}

                                className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center"

                            >

                                <X size={22} />

                            </button>


                        </div>





                        {/* Form */}


                        <form

                            className="p-7 space-y-6"

                            onSubmit={async (e) => {

                                e.preventDefault();



                                if (
                                    !formData.imgLink ||
                                    !formData.name ||
                                    !formData.designation ||
                                    !formData.description
                                ) {

                                    toast.error("Please fill all fields");

                                    return;

                                }



                                try {


                                    if (isEditing) {


                                        await api.put(

                                            `${API}/${selectedId}`,

                                            formData

                                        );


                                        toast.success(
                                            "Supporter updated successfully"
                                        );



                                    } else {


                                        await api.post(

                                            API,

                                            formData

                                        );


                                        toast.success(
                                            "Supporter added successfully"
                                        );


                                    }




                                    fetchSupporters();


                                    setShowForm(false);



                                    setFormData({

                                        imgLink: "",
                                        name: "",
                                        designation: "",
                                        description: ""

                                    });



                                } catch (error) {

                                    toast.error(
                                        "Something went wrong"
                                    );


                                }


                            }}

                        >




                            {/* Image URL */}

                            <div>


                                <label className="flex items-center gap-2 font-semibold text-gray-700 mb-2">


                                    <ImageIcon size={18} />

                                    Image URL


                                </label>



                                <input

                                    type="text"

                                    name="imgLink"

                                    value={formData.imgLink}

                                    onChange={handleChange}

                                    placeholder="https://image-url.com/photo.jpg"

                                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"

                                />


                            </div>





                            {/* Image Preview */}


                            {
                                formData.imgLink && (


                                    <div className="rounded-2xl overflow-hidden border">


                                        <img

                                            src={formData.imgLink}

                                            alt="preview"

                                            className="w-full h-56 object-cover"

                                            onError={(e) => {

                                                e.target.src =
                                                    "https://placehold.co/800x500?text=Invalid+Image";

                                            }}

                                        />


                                    </div>


                                )
                            }






                            {/* Name */}


                            <div>


                                <label className="flex items-center gap-2 font-semibold text-gray-700 mb-2">


                                    <Users size={18} />

                                    Name


                                </label>



                                <input

                                    type="text"

                                    name="name"

                                    value={formData.name}

                                    onChange={handleChange}

                                    placeholder="Enter supporter name"

                                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"

                                />


                            </div>






                            {/* Designation */}


                            <div>


                                <label className="flex items-center gap-2 font-semibold text-gray-700 mb-2">


                                    <BadgeCheck size={18} />

                                    Designation


                                </label>



                                <input

                                    type="text"

                                    name="designation"

                                    value={formData.designation}

                                    onChange={handleChange}

                                    placeholder="Enter designation"

                                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"

                                />


                            </div>






                            {/* Description */}


                            <div>


                                <label className="flex items-center gap-2 font-semibold text-gray-700 mb-2">


                                    <AlignLeft size={18} />

                                    Description


                                </label>




                                <textarea

                                    rows="5"

                                    name="description"

                                    value={formData.description}

                                    onChange={handleChange}

                                    placeholder="Write description..."

                                    className="w-full border rounded-xl px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-indigo-500"

                                />



                            </div>








                            {/* Buttons */}


                            <div className="flex flex-col sm:flex-row justify-end gap-4">


                                <button


                                    type="button"


                                    onClick={() => setShowForm(false)}


                                    className="px-6 py-3 rounded-xl border font-semibold hover:bg-gray-100"


                                >

                                    Cancel

                                </button>




                                <button


                                    type="submit"


                                    className="px-7 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"


                                >


                                    {
                                        isEditing
                                            ?
                                            "Update Supporter"
                                            :
                                            "Add Supporter"
                                    }


                                </button>




                            </div>



                        </form>



                    </div>



                </div>


            )}

            {/* =========================
          DELETE MODAL
      ========================= */}


            {showDelete && (

                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">


                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">



                        {/* Header */}

                        <div className="flex justify-between items-center px-6 py-5 border-b">


                            <h2 className="text-2xl font-bold text-gray-800">

                                Delete Supporter

                            </h2>



                            <button

                                onClick={() => setShowDelete(false)}

                                className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center"

                            >

                                <X size={22} />

                            </button>


                        </div>






                        {/* Body */}


                        <div className="p-6 text-center">


                            <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center">


                                <Trash2

                                    size={40}

                                    className="text-red-600"

                                />


                            </div>





                            <h3 className="text-2xl font-bold text-gray-800 mt-6">

                                Are you sure?

                            </h3>



                            <p className="text-gray-500 mt-3">


                                This action will permanently delete this supporter.


                            </p>







                            <div className="flex gap-4 mt-8">



                                <button


                                    onClick={() => setShowDelete(false)}


                                    className="flex-1 py-3 rounded-xl border font-semibold hover:bg-gray-100"


                                >

                                    Cancel

                                </button>





                                <button


                                    onClick={async () => {


                                        try {


                                            await axios.delete(

                                                `${API}/${selectedId}`

                                            );



                                            toast.success(
                                                "Supporter deleted successfully"
                                            );



                                            setShowDelete(false);



                                            fetchSupporters();



                                        } catch (error) {


                                            console.log(error);


                                            toast.error(
                                                "Failed to delete supporter"
                                            );


                                        }


                                    }}



                                    className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold"


                                >

                                    Delete


                                </button>



                            </div>



                        </div>




                    </div>



                </div>



            )}



        </div>

    );

};


export default Supporter;