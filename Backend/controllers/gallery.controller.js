import Gallery from '../models/gallery.model.js';

// GET all gallery items
export const getGallery = async (req, res) => {
    try {
        const items = await Gallery.find().sort({ createdAt: -1 });
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching gallery' });
    }
};

// POST a new image
export const createImage = async (req, res) => {
    const { imageUrl } = req.body;
    try {
        const newImage = new Gallery({ imageUrl });
        await newImage.save();
        res.status(201).json(newImage);
    } catch (err) {
        res.status(400).json({ message: 'Error creating image' });
    }
};

// PUT (update) image by ID
export const updateImage = async (req, res) => {
    const { id } = req.params;
    const { imageUrl } = req.body;
    try {
        const updated = await Gallery.findByIdAndUpdate(
            id,
            { imageUrl },
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: 'Image not found' });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: 'Error updating image' });
    }
};

// DELETE image by ID
export const deleteImage = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await Gallery.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: 'Image not found' });
        res.json({ message: 'Image deleted' });
    } catch (err) {
        res.status(400).json({ message: 'Error deleting image' });
    }
};