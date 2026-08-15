import React, { useState } from "react";

import {
    useNavigate
} from "react-router-dom";


import {
    FaSearch
} from "react-icons/fa";



const SearchBar = () => {


    const navigate = useNavigate();


    const [query, setQuery] = useState("");

    const [results, setResults] = useState([]);






    const search = async (value) => {


        setQuery(value);



        if (!value) {

            setResults([]);

            return;

        }



        const res =
            await fetch(

                `${import.meta.env.VITE_API_URL || "https://codeandclass.onrender.com/api"}/search?q=${value}`

            );



        const data =
            await res.json();


        setResults(data.data);


    };





    return (

        <div className="
relative
w-full
max-w-xl
mx-auto
">



            <div className="
flex
items-center
bg-white
rounded-full
shadow
px-5
">


                <FaSearch
                    className="
text-gray-400
"
                />



                <input

                    value={query}

                    onChange={(e) => search(e.target.value)}

                    placeholder="
Search lessons...
"

                    className="
w-full
p-4
outline-none
"

                />


            </div>





            {

                results.length > 0 &&


                <div className="
absolute
top-16
left-0
right-0
bg-white
rounded-2xl
shadow-xl
z-50
overflow-hidden
">


                    {

                        results.map(item => (


                            <button

                                key={item._id}

                                onClick={() => navigate(

                                    `/topic-video/${item._id}`

                                )}

                                className="
w-full
text-left
p-5
border-b
hover:bg-blue-50
"


                            >


                                <h3 className="
font-bold
">

                                    {item.title}

                                </h3>



                                <p className="
text-sm
text-gray-500
">

                                    {item.course}

                                    -
                                    {item.subject}

                                </p>



                            </button>


                        ))


                    }



                </div>


            }



        </div>

    )

};


export default SearchBar;