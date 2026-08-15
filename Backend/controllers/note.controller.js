import asyncHandler from 'express-async-handler';
import Note from '../models/note.model.js';
import NotePurchase from '../models/notePurchase.model.js';

// @desc    Get all notes — driveLink is hidden for paid notes the user hasn't unlocked
// @route   GET /api/notes
export const getNotes = asyncHandler(async (req, res) => {
    const notes = await Note.find().sort({ createdAt: -1 });

    if (req.user?.role === 'admin') {
        return res.json(
            notes.map((note) => ({ ...note.toObject(), unlocked: true }))
        );
    }

    let purchasedNoteIds = [];
    if (req.user) {
        const purchases = await NotePurchase.find({ user: req.user.id }).select('note');
        purchasedNoteIds = purchases.map((p) => p.note.toString());
    }

    const shaped = notes.map((note) => {
        const unlocked = !note.isPaid || purchasedNoteIds.includes(note._id.toString());
        return {
            _id: note._id,
            image: note.image,
            title: note.title,
            isPaid: note.isPaid,
            price: note.price,
            unlocked,
            driveLink: unlocked ? note.driveLink : null,
        };
    });

    res.json(shaped);
});

// @desc    Create a note
// @route   POST /api/notes
export const createNote = asyncHandler(async (req, res) => {
    const { image, title, driveLink, isPaid, price } = req.body;

    if (!image || !title || !driveLink) {
        res.status(400);
        throw new Error('Please provide all required fields');
    }

    if (isPaid && (!price || Number(price) <= 0)) {
        res.status(400);
        throw new Error('Please set a valid price for a paid note');
    }

    const note = await Note.create({
        image,
        title,
        driveLink,
        isPaid: !!isPaid,
        price: isPaid ? Number(price) : 0,
    });
    res.status(201).json(note);
});

// @desc    Update a note
// @route   PUT /api/notes/:id
export const updateNote = asyncHandler(async (req, res) => {
    const note = await Note.findById(req.params.id);

    if (!note) {
        res.status(404);
        throw new Error('Note not found');
    }

    if (req.body.isPaid && (!req.body.price || Number(req.body.price) <= 0)) {
        res.status(400);
        throw new Error('Please set a valid price for a paid note');
    }

    const updated = await Note.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });

    res.json(updated);
});

// @desc    Delete a note
// @route   DELETE /api/notes/:id
export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    await NotePurchase.deleteMany({ note: req.params.id });

    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (err) {
    console.error('Delete Error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
