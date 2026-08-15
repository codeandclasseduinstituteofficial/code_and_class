import React, { useState } from "react";


const EditProblemModal = ({

    problem,

    onClose,

    onSave

}) => {


    const [form, setForm] = useState({

        name: problem.name,

        videoLink: problem.videoLink,

        description: problem.description,

        isPaid: problem.isPaid,

        price: problem.price

    });





    const change = (e) => {


        setForm({

            ...form,

            [e.target.name]:

                e.target.value

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

                    Edit Problem

                </h2>





                <input

                    name="name"

                    value={form.name}

                    onChange={change}

                    className="
border
w-full
p-3
rounded-xl
mt-5
"

                />




                <input

                    name="videoLink"

                    value={form.videoLink}

                    onChange={change}

                    className="
border
w-full
p-3
rounded-xl
mt-4
"

                />




                <textarea

                    name="description"

                    value={form.description}

                    onChange={change}

                    className="
border
w-full
p-3
rounded-xl
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

                        onChange={
                            e =>

                                setForm({

                                    ...form,

                                    isPaid: e.target.checked

                                })

                        }

                    />


                    Paid Content


                </div>






                {

                    form.isPaid &&


                    <input

                        type="number"

                        name="price"

                        value={form.price}

                        onChange={change}

                        className="
border
w-full
p-3
rounded-xl
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
px-5
py-2
bg-gray-200
rounded-xl
"

                    >

                        Cancel

                    </button>



                    <button

                        onClick={() => onSave(form)}

                        className="
px-5
py-2
bg-blue-600
text-white
rounded-xl
"

                    >

                        Save

                    </button>


                </div>




            </div>


        </div>


    )

};


export default EditProblemModal;