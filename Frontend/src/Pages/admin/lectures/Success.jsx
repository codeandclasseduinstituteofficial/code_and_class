import React from "react";
import { FaCheckCircle } from "react-icons/fa";


const Success = () => {


    return (

        <div className="
flex
flex-col
items-center
justify-center
py-20
">


            <FaCheckCircle

                className="
text-green-500
text-7xl
"

            />


            <h1 className="
text-4xl
font-bold
mt-6
">

                Course Published

            </h1>


            <p className="
text-gray-500
mt-3
">

                Students can now access this content.

            </p>



        </div>

    )


};


export default Success;