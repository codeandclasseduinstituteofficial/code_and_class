import mongoose from "mongoose";

const meetingLinkSchema = new mongoose.Schema(
    {
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        link: {
            type: String,
            required: true,
            trim: true,
        },

        scheduledAt: {
            type: Date,
            required: true,
        },

        // Only the online-mode students the admin picked can see/join this
        recipients: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

export default mongoose.model("MeetingLink", meetingLinkSchema);
