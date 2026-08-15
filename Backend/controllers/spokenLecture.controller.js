import SpokenLecture from '../models/spokenLecture.model.js';
import asyncHandler from 'express-async-handler';

export const createSpokenLecture = asyncHandler(async (req, res) => {
  const spoken = await SpokenLecture.create(req.body);
  res.status(201).json(spoken);
});

export const getSpokenLectures = asyncHandler(async (req, res) => {
  const list = await SpokenLecture.find();
  res.json(list);
});

export const getSpokenLecturesByLevel = asyncHandler(async (req, res) => {
    const list = await SpokenLecture.find({level: req.params.level});
    res.json(list);
  });

export const updateSpokenLecture = asyncHandler(async (req, res) => {
  const updated = await SpokenLecture.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

export const deleteSpokenLecture = asyncHandler(async (req, res) => {
  await SpokenLecture.findByIdAndDelete(req.params.id);
  res.json({ message: 'Spoken Lecture deleted' });
});