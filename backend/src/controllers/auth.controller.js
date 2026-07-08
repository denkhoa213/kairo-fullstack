import bcrypt from "bcrypt";
import User from "../models/User.model.js";
import jwt from "jsonwebtoken";
import Session from "../models/Session.model.js";
import crypto from "crypto";

const ACCESS_TOKEN_TTL = "15m";
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000;
const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "none",
  maxAge: REFRESH_TOKEN_TTL,
};

const createTokenPair = async (user) => {
  const accessToken = jwt.sign(
    { userId: user._id.toString() },
    process.env.JWT_SECRET,
    {
      expiresIn: ACCESS_TOKEN_TTL,
    },
  );

  const refreshToken = crypto.randomBytes(64).toString("hex");
  await Session.create({
    userId: user._id,
    refreshToken,
    expiresAt: Date.now() + REFRESH_TOKEN_TTL,
  });

  return { accessToken, refreshToken };
};

//register controller
export const registerController = async (req, res) => {
  try {
    const { email, password, name, firstName, lastName } = req.body;
    const displayName =
      name || (firstName && lastName ? `${firstName} ${lastName}` : undefined);

    if (!email || !password || !displayName) {
      return res.status(400).json({
        message: "Vui lòng điền đầy đủ thông tin!",
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        message: "Email đã tồn tại!",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      name: displayName,
    });

    const { accessToken, refreshToken } = await createTokenPair(user);
    res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);

    return res.status(201).json({
      message: "Đăng ký thành công!",
      data: {
        user,
        token: accessToken,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

//Login controller
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Vui lòng nhập email và mật khẩu!",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password",
    );

    if (!user) {
      return res.status(401).json({
        message: "Email hoặc mật khẩu không chính xác!",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Email hoặc mật khẩu không chính xác!",
      });
    }

    const { accessToken, refreshToken } = await createTokenPair(user);
    res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);

    return res.status(200).json({
      message: `Login ${user.name} successfully!`,
      data: {
        user,
        token: accessToken,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

//logout controller
export const logoutController = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({
        message: "Bạn chưa đăng nhập!",
      });
    }
    await Session.deleteOne({ refreshToken: token });
    res.clearCookie("refreshToken", { ...REFRESH_COOKIE_OPTIONS, maxAge: 0 });
    return res.sendStatus(204);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const meController = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({
        message: "Không tìm thấy user!",
      });
    }
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const refreshTokenController = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({
        message: "Refresh token không tồn tại",
      });
    }

    const session = await Session.findOne({ refreshToken: token });
    if (!session || session.expiresAt < Date.now()) {
      if (session) {
        await session.deleteOne();
      }
      return res.status(401).json({
        message: "Refresh token không hợp lệ",
      });
    }

    const user = await User.findById(session.userId);
    if (!user) {
      return res.status(404).json({
        message: "Không tìm thấy user!",
      });
    }

    const accessToken = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET,
      {
        expiresIn: ACCESS_TOKEN_TTL,
      },
    );

    const newRefreshToken = crypto.randomBytes(64).toString("hex");
    session.refreshToken = newRefreshToken;
    session.expiresAt = Date.now() + REFRESH_TOKEN_TTL;
    await session.save();

    res.cookie("refreshToken", newRefreshToken, REFRESH_COOKIE_OPTIONS);
    return res.status(200).json({
      token: accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

//forgot password controller
//(Not Done)
export const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        message: "Vui lòng nhập email!",
      });
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({
        message: "Không tìm thấy user!",
      });
    }
    const resetToken = crypto.randomBytes(64).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000;
    await user.save();
    return res.status(200).json({
      message: "Vui lòng kiểm tra email!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
