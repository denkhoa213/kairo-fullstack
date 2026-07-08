import Flashcard from "../models/Flashcard.model.js";
import FlashcardSet from "../models/FlashcardSet.model.js";
import { getIo } from "../socket.js";

// @desc    Get all flashcards for a set
// @route   GET /api/sets/:setId/cards
// @access  Public (if set is public) or Private
export const getFlashcards = async (req, res, next) => {
  try {
    const { setId } = req.params;

    // Optional: Check if set exists and user has access
    const set = await FlashcardSet.findById(setId);
    if (!set) {
      return res.status(404).json({ message: "Flashcard set not found" });
    }

    // For now, assuming anyone can read if it's public.
    // In production, add privacy checks.

    const flashcards = await Flashcard.find({ setId }).sort({
      order: 1,
      createdAt: 1,
    });
    res.status(200).json(flashcards);
  } catch (error) {
    next(error);
  }
};

// @desc    Create multiple flashcards for a set
// @route   POST /api/sets/:setId/cards
// @access  Private (Owner only)
export const createFlashcards = async (req, res, next) => {
  try {
    const { setId } = req.params;
    const { cards } = req.body; // Array of { front, back, frontImage, backImage, position }

    const set = await FlashcardSet.findById(setId);
    if (!set) {
      return res.status(404).json({ message: "Flashcard set not found" });
    }

    if (set.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to modify this set" });
    }

    // Add setId to all cards
    const cardsToInsert = cards.map((card) => ({
      ...card,
      setId,
    }));

    const insertedCards = await Flashcard.insertMany(cardsToInsert);

    // Update the set's card count
    const totalCards = await Flashcard.countDocuments({ setId });
    await FlashcardSet.findByIdAndUpdate(setId, { totalCards });

    const io = getIo();
    io.to(`set:${setId}`).emit("cardsUpdated", { setId });
    io.emit("setsUpdated");

    res.status(201).json(insertedCards);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a flashcard
// @route   PUT /api/cards/:id
// @access  Private (Owner only)
export const updateFlashcard = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const flashcard = await Flashcard.findById(id);
    if (!flashcard) {
      return res.status(404).json({ message: "Flashcard not found" });
    }

    const set = await FlashcardSet.findById(flashcard.setId);
    if (set.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to modify this card" });
    }

    const updatedCard = await Flashcard.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    const io = getIo();
    io.to(`set:${flashcard.setId}`).emit("cardsUpdated", {
      setId: flashcard.setId,
    });
    io.to(`set:${flashcard.setId}`).emit("setUpdated", {
      setId: flashcard.setId,
    });

    res.status(200).json(updatedCard);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a flashcard
// @route   DELETE /api/cards/:id
// @access  Private (Owner only)
export const deleteFlashcard = async (req, res, next) => {
  try {
    const { id } = req.params;

    const flashcard = await Flashcard.findById(id);
    if (!flashcard) {
      return res.status(404).json({ message: "Flashcard not found" });
    }

    const set = await FlashcardSet.findById(flashcard.setId);
    if (set.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this card" });
    }

    await Flashcard.findByIdAndDelete(id);

    // Update the set's card count
    const totalCards = await Flashcard.countDocuments({
      setId: flashcard.setId,
    });
    await FlashcardSet.findByIdAndUpdate(flashcard.setId, { totalCards });

    const io = getIo();
    io.to(`set:${flashcard.setId}`).emit("cardsUpdated", {
      setId: flashcard.setId,
    });
    io.to(`set:${flashcard.setId}`).emit("setUpdated", {
      setId: flashcard.setId,
    });

    res.status(200).json({ message: "Flashcard deleted successfully" });
  } catch (error) {
    next(error);
  }
};
