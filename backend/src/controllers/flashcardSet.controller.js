import FlashcardSet from "../models/FlashcardSet.model.js";
import FlashCard from "../models/Flashcard.model.js";

// @desc    List flashcard sets (public, searchable, paginated)
// @route   GET /api/sets
// @access  Public
export const listFlashcardSets = async (req, res, next) => {
  try {
    const { search, category, sort = "newest", limit = 24, page = 1 } = req.query;
    const query = { isPublic: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      query.categoryId = category;
    }

    const pageNumber = Math.max(Number(page), 1);
    const pageSize = Math.min(Number(limit), 100);

    const sortOptions = {
      newest: { createdAt: -1 },
      popular: { favoriteCount: -1 },
      rating: { rating: -1 },
    };

    const sets = await FlashcardSet.find(query)
      .sort(sortOptions[sort] || sortOptions.newest)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .populate("categoryId", "name slug")
      .populate("tags", "name slug")
      .populate("userId", "name avatar");

    const total = await FlashcardSet.countDocuments(query);

    return res.status(200).json({
      success: true,
      data: {
        items: sets,
        total,
        page: pageNumber,
        limit: pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single flashcard set with its cards
// @route   GET /api/sets/:id
// @access  Public (if public set) or Private
export const getFlashcardSet = async (req, res, next) => {
  try {
    const { id } = req.params;
    const set = await FlashcardSet.findById(id)
      .populate("categoryId", "name slug")
      .populate("tags", "name slug")
      .populate("userId", "name avatar");

    if (!set) {
      return res.status(404).json({ message: "Flashcard set not found" });
    }

    if (!set.isPublic) {
      // Check ownership — req.user might not exist on public routes
      if (!req.user || set.userId._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "This set is private" });
      }
    }

    const flashcards = await FlashCard.find({ setId: id }).sort({ order: 1 });

    return res.status(200).json({
      success: true,
      data: { set, flashcards },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new flashcard set
// @route   POST /api/sets
// @access  Private
export const createFlashcardSet = async (req, res, next) => {
  try {
    const { name, description, categoryId, isPublic = true, tags = [], cards = [] } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const set = await FlashcardSet.create({
      name,
      description,
      categoryId,
      userId: req.user._id,
      isPublic,
      tags,
      totalCards: cards.length,
    });

    // Bulk insert flashcards if provided
    if (cards.length > 0) {
      const cardsToInsert = cards.map((card, idx) => ({
        ...card,
        setId: set._id,
        order: idx,
      }));
      await FlashCard.insertMany(cardsToInsert);
    }

    return res.status(201).json({ success: true, data: set });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a flashcard set
// @route   PUT /api/sets/:id
// @access  Private (Owner only)
export const updateFlashcardSet = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, categoryId, isPublic, tags, image } = req.body;

    const set = await FlashcardSet.findById(id);
    if (!set) {
      return res.status(404).json({ message: "Flashcard set not found" });
    }

    if (set.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this set" });
    }

    const updatedSet = await FlashcardSet.findByIdAndUpdate(
      id,
      { name, description, categoryId, isPublic, tags, image },
      { new: true, runValidators: true }
    );

    return res.status(200).json({ success: true, data: updatedSet });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a flashcard set
// @route   DELETE /api/sets/:id
// @access  Private (Owner only)
export const deleteFlashcardSet = async (req, res, next) => {
  try {
    const { id } = req.params;
    const set = await FlashcardSet.findById(id);

    if (!set) {
      return res.status(404).json({ message: "Flashcard set not found" });
    }

    if (set.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this set" });
    }

    // Cascade delete all flashcards in the set
    await FlashCard.deleteMany({ setId: id });
    await set.deleteOne();

    return res.status(200).json({ success: true, message: "Set deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle like on a flashcard set
// @route   POST /api/sets/:id/like
// @access  Private
export const toggleLikeSet = async (req, res, next) => {
  try {
    const { id } = req.params;
    const set = await FlashcardSet.findById(id);

    if (!set) {
      return res.status(404).json({ message: "Flashcard set not found" });
    }

    // Simple increment/decrement — for full implementation, track user IDs in a Set
    const alreadyLiked = req.body.liked;
    const newCount = alreadyLiked
      ? Math.max(set.favoriteCount - 1, 0)
      : set.favoriteCount + 1;

    await FlashcardSet.findByIdAndUpdate(id, { favoriteCount: newCount });
    return res.status(200).json({ success: true, favoriteCount: newCount });
  } catch (error) {
    next(error);
  }
};

// @desc    Get sets created by the authenticated user
// @route   GET /api/sets/my
// @access  Private
export const getMySets = async (req, res, next) => {
  try {
    const sets = await FlashcardSet.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate("categoryId", "name slug");

    return res.status(200).json({ success: true, data: sets });
  } catch (error) {
    next(error);
  }
};
