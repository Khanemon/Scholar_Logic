const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../models/userModel");
const { successResponse } = require("./responseController");
const { createJSONWebToken } = require("../helper/jsonwebtoken");
const { jwtAccessKey, jwtRefreshKey } = require("../secret");

// For login to the website
const handelLogin = async (req, res, next) => {
  try {
    // email, password req.body
    const { email, password } = req.body;
    // isExist
    const user = await User.findOne({ email });
    if (!user) {
      throw createError(
        404,
        "User does not exist with this email. Please register first",
      );
    }
    // compare the password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw createError(401, "Email/password did not match");
    }
    // user isBanned or not
    if (user.isBanned) {
      throw createError(
        401,
        "You are banned. Please contact with the authority",
      );
    }

    // token, cookie
    // create jwt
    const accessToken = createJSONWebToken({ user }, jwtAccessKey, "15m");
    res.cookie("accessToken", accessToken, {
      maxAge: 5 * 60 * 1000, //5 minutes
      httpOnly: true,
      // secure: true,
      sameSite: "none",
    });

    const refreshToken = createJSONWebToken({ user }, jwtRefreshKey, "7d");
    res.cookie("refreshToken", refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000, //7days minutes
      httpOnly: true,
      // secure: true,
      sameSite: "none",
    });

    const userWithoutPassword = await User.findOne({
      email,
    }).select("-password");

    // Success response
    return successResponse(res, {
      statusCode: 200,
      message: "users was logIn successfully",
      payload: { userWithoutPassword },
    });
  } catch (error) {
    next(error);
  }
};

// For logout from the website
const handelLogout = async (req, res, next) => {
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    // Success response
    return successResponse(res, {
      statusCode: 200,
      message: "Users log out successfully",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};

const handelRefreshToken = async (req, res, next) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;

    // verify the old refresh token
    const decodedToken = jwt.verify(oldRefreshToken, jwtRefreshKey);

    if (!decodedToken) {
      throw createError(401, "Invalid refresh token. Please login again");
    }
    const accessToken = createJSONWebToken(
      decodedToken.user,
      jwtAccessKey,
      "5m",
    );
    res.cookie("accessToken", accessToken, {
      maxAge: 5 * 60 * 1000, //5 minutes
      httpOnly: true,
      sameSite: "none",
    });
    return successResponse(res, {
      statusCode: 200,
      message: "New access token is generated",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};
const handelProtectedRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    // verify the old refresh token
    const decodedToken = jwt.verify(accessToken, jwtAccessKey);

    if (!decodedToken) {
      throw createError(401, "Invalid access token. Please login again");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "Protected resources successfully.",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handelLogin,
  handelLogout,
  handelRefreshToken,
  handelProtectedRoute,
};
