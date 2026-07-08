import User from "../models/User.model.js";

export const findByEmail = async (email) => {
  try {
    const user = await User.findOne({ email }).select(
      "+password +refreshToken",
    );
    return user;
  } catch (error) {
    logger.error(`Error finding user by email ${email}: ${error.message}`);
    throw error;
  }
};

export const findById = async (userId, includeSensitive = false) => {
  try {
    let query = User.findById(userId);
    if (includeSensitive) {
      query = query.select("+password +refreshToken");
    }
    const user = await query;
    return user;
  } catch (error) {
    logger.error(`Error finding user by ID ${userId}: ${error.message}`);
    throw error;
  }
};

export const create = async (userData) => {
  try {
    const user = new User(userData);
    await user.save();
    return user;
  } catch (error) {
    logger.error(`Error creating user: ${error.message}`);
    throw error;
  }
};

export const update = async (userId, updateData) => {
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true },
    );
    return user;
  } catch (error) {
    logger.error(`Error updating user ${userId}: ${error.message}`);
    throw error;
  }
};

export const emailExists = async (email) => {
  try {
    const user = await User.findOne({ email }).select("_id");
    return !!user;
  } catch (error) {
    logger.error(`Error checking email existence: ${error.message}`);
    throw error;
  }
};

export const updateLoginAttempts = async (
  userId,
  attempts,
  lockUntil = null,
) => {
  try {
    const updateData = { loginAttempts: attempts };
    if (lockUntil) {
      updateData.lockUntil = lockUntil;
    }
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true },
    );
    return user;
  } catch (error) {
    logger.error(
      `Error updating login attempts for user ${userId}: ${error.message}`,
    );
    throw error;
  }
};

export const updateLastLogin = async (userId) => {
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { lastLoginAt: new Date() } },
      { new: true },
    );
    return user;
  } catch (error) {
    logger.error(
      `Error updating last login for user ${userId}: ${error.message}`,
    );
    throw error;
  }
};

const UserRepository = {
  findByEmail,
  findById,
  create,
  update,
  emailExists,
  updateLoginAttempts,
  updateLastLogin,
};

export default UserRepository;
