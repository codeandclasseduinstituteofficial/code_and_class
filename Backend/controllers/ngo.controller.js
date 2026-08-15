import Ngo from '../models/ngo.models.js';

// Get all NGOs
export const getAllNgos = async (req, res) => {
  try {
    const ngos = await Ngo.find();
    res.status(200).json(ngos);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching NGOs', error });
  }
};

// Add a new NGO (Optional)
export const addNgo = async (req, res) => {
  const { name, shortDescription, description, image } = req.body;
  try {
    const newNgo = new Ngo({ name, shortDescription, description, image });
    await newNgo.save();
    res.status(201).json(newNgo);
  } catch (error) {
    res.status(500).json({ message: 'Error adding NGO', error });
  }
};

// Update an NGO by ID
export const updateNgo = async (req, res) => {
  const { id } = req.params;
  const { name, shortDescription, description, image } = req.body;

  try {
    const updatedNgo = await Ngo.findByIdAndUpdate(id, {
      name,
      shortDescription,
      description,
      image
    }, { new: true }); // `new: true` ensures the updated document is returned

    if (!updatedNgo) {
      return res.status(404).json({ message: 'NGO not found' });
    }

    res.status(200).json(updatedNgo);
  } catch (error) {
    res.status(500).json({ message: 'Error updating NGO', error });
  }
};

// Delete an NGO by ID
export const deleteNgo = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedNgo = await Ngo.findByIdAndDelete(id);

    if (!deletedNgo) {
      return res.status(404).json({ message: 'NGO not found' });
    }

    res.status(200).json({ message: 'NGO deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting NGO', error });
  }
};