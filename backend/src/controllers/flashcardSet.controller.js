import FlashcardSet from "../models/FlashcardSet.model.js";
import Flashcard from "../models/Flashcard.model.js";
import { getIo } from "../socket.js";

export const listFlashcardSets = async (req, res, next) => {
  try {
    const { search, category, limit = 24, page = 1 } = req.query;
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

    const pageNumber = Number(page) || 1;
    const pageSize = Number(limit) || 24;

    const sets = await FlashcardSet.find(query)
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .populate("categoryId", "name slug")
      .populate("tags", "name slug")
      .populate("userId", "name avatar");

    const setsWithAuthor = sets.map((set) => {
      const safeSet = set.toObject();
      safeSet.author = safeSet.userId;
      safeSet.category = safeSet.categoryId;
      return safeSet;
    });

    const total = await FlashcardSet.countDocuments(query);

    return res.status(200).json({
      success: true,
      data: {
        items: setsWithAuthor,
        total,
        page: pageNumber,
        limit: pageSize,
      },
    });
  } catch (error) {
    next(error);
  }
};

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

    const setObject = set.toObject();
    setObject.author = setObject.userId;
    setObject.category = setObject.categoryId;

    const flashcards = await Flashcard.find({ setId: id }).sort({ order: 1 });

    return res.status(200).json({
      success: true,
      data: {
        set: setObject,
        flashcards,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createFlashcardSet = async (req, res, next) => {
  try {
    const {
      name,
      description,
      categoryId,
      isPublic = true,
      tags = [],
    } = req.body;
    if (!name || !categoryId) {
      return res
        .status(400)
        .json({ message: "Name and category are required" });
    }

    const set = await FlashcardSet.create({
      name,
      description,
      categoryId,
      userId: req.user._id,
      isPublic,
      tags,
    });

    const io = getIo();
    io.emit("setsUpdated");
    io.to(`set:${set._id}`).emit("setUpdated", { setId: set._id });

    return res.status(201).json({
      success: true,
      data: set,
    });
  } catch (error) {
    next(error);
  }
};

export const updateFlashcardSet = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const set = await FlashcardSet.findById(id);

    if (!set) {
      return res.status(404).json({ message: "Flashcard set not found" });
    }

    if (set.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Không có quyền" });
    }

    const updatedSet = await FlashcardSet.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    const io = getIo();
    io.emit("setsUpdated");
    io.to(`set:${id}`).emit("setUpdated", { setId: id });

    return res.status(200).json({
      success: true,
      data: updatedSet,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteFlashcardSet = async (req, res, next) => {
  try {
    const { id } = req.params;
    const set = await FlashcardSet.findById(id);

    if (!set) {
      return res.status(404).json({ message: "Flashcard set not found" });
    }

    if (set.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Không có quyền" });
    }

    await set.deleteOne();

    const io = getIo();
    io.emit("setsUpdated");
    io.to(`set:${id}`).emit("setUpdated", { setId: id });

    return res.status(204).end();
  } catch (error) {
    next(error);
  }
};
