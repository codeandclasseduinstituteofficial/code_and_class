import mongoose from "mongoose";


const progressSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },


    contentId: {
        type: String,
        required: true
    },


    title: {
        type: String,
        required: true
    },


    course: {
        type: String,
        required: true
        // Class10 / Intermediate
    },


    completed: {
        type: Boolean,
        default: false
    },


    watchedAt: {
        type: Date,
        default: Date.now
    }


},
    {
        timestamps: true
    });



export default mongoose.model(
    "progress",
    progressSchema
);