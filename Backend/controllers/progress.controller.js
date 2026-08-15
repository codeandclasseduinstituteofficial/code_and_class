import Progress from "../models/progress.model.js";



// Save watched lesson


export const saveProgress = async (req, res) => {


    try {


        const {

            contentId,

            title,

            course

        } = req.body;



        const exists =
            await Progress.findOne({

                user: req.user.id,

                contentId

            });



        if (exists) {


            return res.json({

                message: "Already saved"

            });


        }





        const progress =
            await Progress.create({

                user: req.user.id,

                contentId,

                title,

                course

            });




        res.status(201).json({

            success: true,

            data: progress

        });


    }
    catch (error) {


        res.status(500).json({

            message: error.message

        });


    }


};







// Student Progress


export const getMyProgress = async (req, res) => {


    try {


        const data =
            await Progress.find({

                user: req.user.id

            })
                .sort({

                    createdAt: -1

                });



        res.json({

            success: true,

            data

        });


    }
    catch (error) {


        res.status(500).json({

            message: error.message

        });


    }


};