import bcrypt from "bcrypt";
import User from "../models/User.model.js";
import jwt from "jsonwebtoken";
import Session from "../models/Session.model.js";
import crypto from "crypto";
import { ErrorsConstants } from "../constants/errors.constants.js";
import { AUTH_MESSAGES } from "../constants/messages.constants.js";

const ACCESS_TOKEN_TTL = "15m";
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000;
const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
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
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        message: AUTH_MESSAGES.REGISTER_FAILED,
        code: ErrorsConstants.ERROR_CODES.VALIDATION_ERROR,
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        message: AUTH_MESSAGES.EMAIL_EXISTS,
        code: ErrorsConstants.ERROR_CODES.EMAIL_EXISTS,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email: email.toLowerCase(),
      hashedPassword,
      displayName: `${firstName} ${lastName}`,
    });

    const { accessToken, refreshToken } = await createTokenPair(user);
    res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);

    return res.status(201).json({
      message: AUTH_MESSAGES.REGISTER_SUCCESS,
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
        message: AUTH_MESSAGES.LOGIN_FAILED,
        code: ErrorsConstants.ERROR_CODES.VALIDATION_ERROR,
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+hashedPassword",
    );

    if (!user) {
      return res.status(401).json({
        message: AUTH_MESSAGES.INVALID_CREDENTIALS,
        code: ErrorsConstants.ERROR_CODES.INVALID_CREDENTIALS,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: AUTH_MESSAGES.INVALID_CREDENTIALS,
        code: ErrorsConstants.ERROR_CODES.INVALID_CREDENTIALS,
      });
    }

    const { accessToken, refreshToken } = await createTokenPair(user);
    res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);

    return res.status(200).json({
      message: AUTH_MESSAGES.LOGIN_SUCCESS,
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
    if (token) {
      await Session.deleteOne({ refreshToken: token });
      res.clearCookie("refreshToken", REFRESH_COOKIE_OPTIONS);
    }
    return res.sendStatus(204);
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
        message: AUTH_MESSAGES.INVALID_EMAIL,
      });
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({
        message: AUTH_MESSAGES.USER_NOT_FOUND,
      });
    }
    const resetToken = crypto.randomBytes(64).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000;
    await user.save();
    return res.status(200).json({
      message: AUTH_MESSAGES.PASSWORD_RESET_EMAIL_SENT,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
