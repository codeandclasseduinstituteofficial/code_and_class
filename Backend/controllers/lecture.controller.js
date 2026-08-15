import Lecture from '../models/lectures.model.js';
import ChapterPurchase from '../models/chapterPurchase.model.js';
import asyncHandler from 'express-async-handler';

// Strip videoUrl from chapters the user hasn't unlocked yet, and add lock flags.
// Admins always see the full URL — they're managing content, not purchasing it.
const shapeLecturesForViewer = async (lectures, user) => {
    if (user?.role === 'admin') {
        return lectures.map((lecture) => {
            const obj = lecture.toObject();
            obj.chapters = obj.chapters.map((chapter) => ({ ...chapter, unlocked: true }));
            return obj;
        });
    }

    let purchasedChapterIds = [];
    if (user) {
        const purchases = await ChapterPurchase.find({ user: user.id }).select('chapterId');
        purchasedChapterIds = purchases.map((p) => p.chapterId.toString());
    }

    return lectures.map((lecture) => {
        const obj = lecture.toObject();
        obj.chapters = obj.chapters.map((chapter) => {
            const unlocked = !chapter.isPaid || purchasedChapterIds.includes(chapter._id.toString());
            return {
                ...chapter,
                unlocked,
                videoUrl: unlocked ? chapter.videoUrl : null,
            };
        });
        return obj;
    });
};

export const createLecture = asyncHandler(async (req, res) => {
    const newLecture = await Lecture.create(req.body);
    res.status(201).json(newLecture);
});

export const getLectures = asyncHandler(async (req, res) => {
    const lectures = await Lecture.find();
    const shaped = await shapeLecturesForViewer(lectures, req.user);
    res.json(shaped);
});

export const getClassData = asyncHandler(async (req, res) => {
    const lectures = await Lecture.find({ classLevel: req.params.classId });
    const shaped = await shapeLecturesForViewer(lectures, req.user);
    res.json(shaped);
});

// @desc  Check if the logged-in user has unlocked a specific paid chapter
// @route GET /api/lectures/chapter-access/:chapterId
// @access Private
export const checkChapterAccess = asyncHandler(async (req, res) => {
    const purchased = await ChapterPurchase.findOne({
        user: req.user.id,
        chapterId: req.params.chapterId,
    });
    res.json({ unlocked: !!purchased });
});

export const updateLecture = asyncHandler(async (req, res) => {
    const lecture = await Lecture.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(lecture);
});

export const deleteLecture = asyncHandler(async (req, res) => {
    await Lecture.findByIdAndDelete(req.params.id);
    res.json({ message: 'Lecture deleted' });
});
