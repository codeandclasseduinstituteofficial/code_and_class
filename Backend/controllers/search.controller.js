import ClassTen from "../models/classTenth.model.js";
import Intermediate from "../models/Intermediate.model.js";



export const searchLectures = async (req, res) => {


    try {


        const { q } = req.query;


        if (!q) {

            return res.json({

                success: true,

                data: []

            });

        }




        const regex = new RegExp(q, "i");



        let results = [];



        // CLASS 10 SEARCH


        const classTen = await ClassTen.find({

            $or: [

                {
                    subject: regex
                },

                {
                    "chapters.chapterName": regex
                },

                {
                    "chapters.problems.name": regex
                }

            ]

        });





        classTen.forEach(subject => {


            subject.chapters.forEach(chapter => {


                chapter.problems.forEach(problem => {


                    if (

                        regex.test(problem.name)

                        ||

                        regex.test(chapter.chapterName)

                    ) {


                        results.push({

                            _id: problem._id,

                            title: problem.name,

                            subject: subject.subject,

                            chapter: chapter.chapterName,

                            course: "Class 10"

                        });


                    }


                });


            });


        });








        // INTERMEDIATE SEARCH


        const intermediate =
            await Intermediate.find({

                $or: [

                    {
                        subject: regex
                    },

                    {
                        "chapters.chapterName": regex
                    },

                    {
                        "chapters.topics.topicName": regex
                    }

                ]

            });





        intermediate.forEach(subject => {


            subject.chapters.forEach(chapter => {


                chapter.topics.forEach(topic => {


                    if (

                        regex.test(topic.topicName)

                        ||

                        regex.test(chapter.chapterName)

                    ) {


                        results.push({

                            _id: topic._id,

                            title: topic.topicName,

                            subject: subject.subject,

                            chapter: chapter.chapterName,

                            course:
                                `${subject.year} ${subject.group}`

                        });


                    }


                });


            });


        });







        res.json({

            success: true,

            data: results

        });



    }
    catch (error) {


        res.status(500).json({

            message: error.message

        });


    }


};