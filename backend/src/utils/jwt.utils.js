import jwt from "jsonwebtoken";

export const generateAccessToken = (userId, role) => {
  try {
    const payload = {
      sub: userId,
      role: role || "user",
      type: "access",
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || "7d",
    });
  } catch (error) {
    throw new Error(`Error generating access token: ${error.message}`);
  }
};

export const generateRefreshToken = (userId) => {
  try {
    const payload = {
      sub: userId,
      type: "refresh",
    };

    return jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      { expiresIn: "30d" },
    );
  } catch (error) {
    throw new Error(`Error generating refresh token: ${error.message}`);
  }
};

export const verifyAccessToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new Error("Token đã hết hạn");
    }
    if (error.name === "JsonWebTokenError") {
      throw new Error("Token không hợp lệ");
    }
    throw new Error(`Error verifying token: ${error.message}`);
  }
};

export const verifyRefreshToken = (token) => {
  try {
    const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new Error("Refresh token đã hết hạn");
    }
    throw new Error("Refresh token không hợp lệ");
  }
};

export const getTokenFromHeader = (authorizationHeader) => {
  if (!authorizationHeader) {
    return null;
  }

  if (!authorizationHeader.startsWith("Bearer ")) {
    return null;
  }

  return authorizationHeader.split(" ")[1];
};
