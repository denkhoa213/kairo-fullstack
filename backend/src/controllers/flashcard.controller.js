import FlashCard from "../models/Flashcard.model.js";
import FlashcardSet from "../models/FlashcardSet.model.js";

// @desc    Get all flashcards for a set
// @route   GET /api/sets/:setId/cards
// @access  Public
export const getFlashcards = async (req, res, next) => {
  try {
    const { setId } = req.params;
    const set = await FlashcardSet.findById(setId);
    if (!set) {
      return res.status(404).json({ message: "Flashcard set not found" });
    }

    const flashcards = await FlashCard.find({ setId }).sort({ order: 1 });
    res.status(200).json({ success: true, data: flashcards });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk create flashcards for a set
// @route   POST /api/sets/:setId/cards
// @access  Private (Owner)
export const createFlashcards = async (req, res, next) => {
  try {
    const { setId } = req.params;
    const { cards } = req.body; // [{ front, back, imageFront, imageBack, order }]

    const set = await FlashcardSet.findById(setId);
    if (!set) {
      return res.status(404).json({ message: "Flashcard set not found" });
    }
    if (set.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const cardsToInsert = cards.map((card, idx) => ({
      ...card,
      setId,
      order: card.order ?? idx,
    }));

    const inserted = await FlashCard.insertMany(cardsToInsert);

    // Update totalCards counter on the set
    const totalCards = await FlashCard.countDocuments({ setId });
    await FlashcardSet.findByIdAndUpdate(setId, { totalCards });

    res.status(201).json({ success: true, data: inserted });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a single flashcard
// @route   PUT /api/cards/:id
// @access  Private (Owner)
export const updateFlashcard = async (req, res, next) => {
  try {
    const { id } = req.params;
    const flashcard = await FlashCard.findById(id);
    if (!flashcard) {
      return res.status(404).json({ message: "Flashcard not found" });
    }

    const set = await FlashcardSet.findById(flashcard.setId);
    if (!set || set.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updated = await FlashCard.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a flashcard
// @route   DELETE /api/cards/:id
// @access  Private (Owner)
export const deleteFlashcard = async (req, res, next) => {
  try {
    const { id } = req.params;
    const flashcard = await FlashCard.findById(id);
    if (!flashcard) {
      return res.status(404).json({ message: "Flashcard not found" });
    }

    const set = await FlashcardSet.findById(flashcard.setId);
    if (!set || set.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await FlashCard.findByIdAndDelete(id);

    const totalCards = await FlashCard.countDocuments({ setId: flashcard.setId });
    await FlashcardSet.findByIdAndUpdate(flashcard.setId, { totalCards });

    res.status(200).json({ success: true, message: "Flashcard deleted" });
  } catch (error) {
    next(error);
  }
};
