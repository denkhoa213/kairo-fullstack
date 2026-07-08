import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    throw new Error(`Error hashing password: ${error.message}`);
  }
};

export const comparePassword = async (password, hashedPassword) => {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  } catch (error) {
    throw new Error(`Error comparing password: ${error.message}`);
  }
};

export const validatePasswordStrength = (password) => {
  const errors = [];

  if (!password || password.length < 6) {
    errors.push("Mật khẩu phải có ít nhất 6 ký tự");
  }

  if (password.length > 50) {
    errors.push("Mật khẩu không được vượt quá 50 ký tự");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
