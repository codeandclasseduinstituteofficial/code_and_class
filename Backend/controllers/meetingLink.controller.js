import asyncHandler from "express-async-handler";
import MeetingLink from "../models/meetingLink.model.js";
import Enrollment from "../models/enrollment.model.js";

// @desc  Admin: list the online-mode students enrolled in a course, so the
//        admin can pick who receives a meeting link
// @route GET /api/meeting-links/online-students/:courseId
// @access Private/Admin
export const getOnlineStudentsForCourse = asyncHandler(async (req, res) => {
    const enrollments = await Enrollment.find({
        course: req.params.courseId,
        mode: "online",
    }).populate("user", "name email");

    const students = enrollments
        .filter((e) => e.user)
        .map((e) => ({ _id: e.user._id, name: e.user.name, email: e.user.email }));

    res.json({ success: true, data: students });
});

// @desc  Admin: create a meeting link and send it to selected online students
// @route POST /api/meeting-links
// @access Private/Admin
export const createMeetingLink = asyncHandler(async (req, res) => {
    const { course, title, link, scheduledAt, recipients } = req.body;

    if (!course || !title || !link || !scheduledAt) {
        res.status(400);
        throw new Error("course, title, link and scheduledAt are required");
    }

    if (!Array.isArray(recipients) || recipients.length === 0) {
        res.status(400);
        throw new Error("Select at least one student to send this link to");
    }

    const meeting = await MeetingLink.create({
        course,
        title,
        link,
        scheduledAt,
        recipients,
        createdBy: req.user.id,
    });

    res.status(201).json({ success: true, data: meeting });
});

// @desc  Admin: list all meeting links they've created (optionally by course)
// @route GET /api/meeting-links
// @access Private/Admin
export const getAllMeetingLinks = asyncHandler(async (req, res) => {
    const filter = {};
    if (req.query.course) filter.course = req.query.course;

    const meetings = await MeetingLink.find(filter)
        .populate("course", "title")
        .populate("recipients", "name email")
        .sort({ scheduledAt: -1 });

    res.json({ success: true, data: meetings });
});

// @desc  Admin: update a meeting link (reschedule, change recipients, etc.)
// @route PUT /api/meeting-links/:id
// @access Private/Admin
export const updateMeetingLink = asyncHandler(async (req, res) => {
    const meeting = await MeetingLink.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!meeting) {
        res.status(404);
        throw new Error("Meeting link not found");
    }

    res.json({ success: true, data: meeting });
});

// @desc  Admin: delete a meeting link
// @route DELETE /api/meeting-links/:id
// @access Private/Admin
export const deleteMeetingLink = asyncHandler(async (req, res) => {
    const meeting = await MeetingLink.findByIdAndDelete(req.params.id);

    if (!meeting) {
        res.status(404);
        throw new Error("Meeting link not found");
    }

    res.json({ success: true, message: "Meeting link deleted" });
});

// @desc  Student: get the meeting links sent to me
// @route GET /api/meeting-links/my
// @access Private
export const getMyMeetingLinks = asyncHandler(async (req, res) => {
    const meetings = await MeetingLink.find({ recipients: req.user.id })
        .populate("course", "title")
        .sort({ scheduledAt: 1 });

    res.json({ success: true, data: meetings });
});
