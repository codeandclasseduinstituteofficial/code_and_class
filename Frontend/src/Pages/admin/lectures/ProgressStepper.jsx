import React from "react";

const steps = [

    "Class",

    "Subject",

    "Chapters",

    "Review"

];

const ProgressStepper = ({ step }) => {

    return (

        <div className="flex justify-between items-center">

            {

                steps.map((item, index) => (

                    <div

                        key={index}

                        className="flex-1 flex flex-col items-center relative"

                    >

                        <div

                            className={`

                            w-12

                            h-12

                            rounded-full

                            flex

                            items-center

                            justify-center

                            font-bold

                            text-lg

                            transition-all

                            ${step >= index + 1

                                    ?

                                    "bg-blue-600 text-white"

                                    :

                                    "bg-gray-200 text-gray-600"

                                }

                            `}

                        >

                            {index + 1}

                        </div>

                        <p className="mt-3 font-medium">

                            {item}

                        </p>

                        {

                            index !== steps.length - 1 && (

                                <div

                                    className={`

                                    absolute

                                    top-6

                                    left-1/2

                                    w-full

                                    h-1

                                    ${step > index + 1

                                            ?

                                            "bg-blue-600"

                                            :

                                            "bg-gray-300"

                                        }

                                    `}

                                />

                            )

                        }

                    </div>

                ))

            }

        </div>

    );

};

export default ProgressStepper;