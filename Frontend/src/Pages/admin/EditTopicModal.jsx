import React, { useState } from "react";


const EditTopicModal = ({
    topic,
    onClose,
    onSave
}) => {


    const [form, setForm] = useState({

        topicName: topic.topicName,

        videoLink: topic.videoLink,

        description: topic.description,

        isPaid: topic.isPaid,

        price: topic.price

    });




    const update = (e) => {


        setForm({

            ...form,

            [e.target.name]: e.target.value

        });


    };




    return (

        <div className="
fixed
inset-0
bg-black/50
flex
items-center
justify-center
p-5
">


            <div className="
bg-white
rounded-3xl
p-6
w-full
max-w-xl
">


                <h2 className="
text-2xl
font-bold
">

                    Edit Topic

                </h2>




                <input

                    name="topicName"

                    value={form.topicName}

                    onChange={update}

                    className="
w-full
border
rounded-xl
p-3
mt-5
"

                />





                <input

                    name="videoLink"

                    value={form.videoLink}

                    onChange={update}

                    className="
w-full
border
rounded-xl
p-3
mt-4
"

                />





                <textarea

                    name="description"

                    value={form.description}

                    onChange={update}

                    className="
w-full
border
rounded-xl
p-3
mt-4
"

                />






                <div className="
flex
gap-3
mt-5
">


                    <input

                        type="checkbox"

                        checked={form.isPaid}

                        onChange={(e) =>

                            setForm({

                                ...form,

                                isPaid: e.target.checked

                            })

                        }

                    />


                    Paid Topic


                </div>





                {

                    form.isPaid &&


                    <input

                        type="number"

                        name="price"

                        value={form.price}

                        onChange={update}

                        className="
w-full
border
rounded-xl
p-3
mt-4
"

                    />


                }






                <div className="
flex
gap-4
mt-6
">


                    <button

                        onClick={onClose}

                        className="
bg-gray-200
px-5
py-2
rounded-xl
"

                    >

                        Cancel

                    </button>



                    <button

                        onClick={() => onSave(form)}

                        className="
bg-indigo-600
text-white
px-5
py-2
rounded-xl
"

                    >

                        Update

                    </button>


                </div>



            </div>


        </div>

    )


};


export default EditTopicModal;