import express from "express";
import {
    getOnlineStudentsForCourse,
    createMeetingLink,
    getAllMeetingLinks,
    updateMeetingLink,
    deleteMeetingLink,
    getMyMeetingLinks,
} from "../controllers/meetingLink.controller.js";
import { admin, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/my", protect, getMyMeetingLinks);
router.get("/online-students/:courseId", protect, admin, getOnlineStudentsForCourse);

router.route("/")
    .get(protect, admin, getAllMeetingLinks)
    .post(protect, admin, createMeetingLink);

router.route("/:id")
    .put(protect, admin, updateMeetingLink)
    .delete(protect, admin, deleteMeetingLink);

export default router;
