const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const fs = require("fs");

const User = require("../models/userModel");
const { successResponse } = require("./responseController");
const { findWithId } = require("../services/findItem");
const { deleteImage } = require("../helper/deleteUser");
const { createJSONWebToken } = require("../helper/jsonwebtoken");
const {
  jwtActivationKey,
  clientURL,
  jwtResetPasswordKey,
} = require("../secret");
const { emailWithNodeMail } = require("../helper/email");
const runValidation = require("../validators");
const {
  handelUserAction,
  findUsers,
  findUserById,
  deleteUserById,
  updateUserById,
  updateUserPasswordById,
  forgetUserPasswordByEmail,
  resetPassword,
} = require("../services/userService");
const { Context } = require("express-validator/lib/context");
const { decode } = require("punycode");
const checkUserExists = require("../helper/checkUserExist");
const sendEmail = require("../helper/sendEmail");
const cloudinary = require("../config/cloudinary");

// Get user by ID
const getUsers = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const { users, pagination } = await findUsers(search, limit, page);

    return successResponse(res, {
      statusCode: 200,
      message: "users were returned successfully",
      payload: {
        users: users,
        pagination: pagination,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get a single user by ID
const getUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    const user = await findUserById(id, options); //findWithId
    return successResponse(res, {
      statusCode: 200,
      message: "Users were returned successfully",
      payload: { user },
    });
  } catch (error) {
    next(error);
  }
};

// Delete a single user by ID
const handelDeleteUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    // await deleteUserById(id, options);
    const deletedUser = await deleteUserById(id, options);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found or cannot be deleted (maybe admin).",
      });
    }

    return successResponse(res, {
      statusCode: 200,
      message: "Users was deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

// Creating processRegister for register new user
const processRegister = async (req, res, next) => {
  try {
    const { name, email, password, phone, address } = req.body;

    const image = req.file?.path;
    if (!image) {
      throw createError(400, "Image file is required");
    }

    if (image && image.size > 1024 * 1024 * 2) {
      throw createError(400, "Image size is less then 2 mb");
    }

    // const imageBufferString = image.buffer.toString("base64");
    // const imageBufferString = fs.readFileSync(image.path).toString("base64");

    // check existing user...
    const userExists = await checkUserExists(email);
    if (userExists) {
      throw createError(
        409,
        "User with this email already exists. Please sign in.",
      );
    }
    // create jwt
    // const token = createJSONWebToken(
    //   {
    //     name,
    //     email,
    //     password,
    //     phone,
    //     address,
    //     image: req.file.filename,
    //   },
    //   jwtActivationKey,
    //   "10m",
    // );

    const tokenPayload = {
      name,
      email,
      password,
      phone,
      address,
    };
    if (image) {
      tokenPayload.image = image;
    }
    console.log(tokenPayload);
    const token = createJSONWebToken(tokenPayload, jwtActivationKey, "15m");

    // prepare emailData
    const emailData = {
      email,
      subject: "Account activation Email",
      html: `
        <h2>Hello ${name}!</h2>
        <p>Please click here to activate your account:</p>
        <a href="${clientURL}/api/users/activation/${token}">Activate account</a>
      `,
    };

    // send email with nodemailer
    sendEmail(emailData);

    return successResponse(res, {
      statusCode: 200,
      message: `Please check ${email} to complete registration.`,
      payload: token,
    });
  } catch (error) {
    next(error);
  }
};

/*
// CODE FROM AI
const processRegister = async (req, res, next) => {
  try {
    const { name, email, password, phone, address } = req.body;
    const image = req.file;

    // Basic presence checks
    if (!name || !email || !password) {
      // remove uploaded file if present to avoid orphan files
      if (image && image.path) fs.unlink(image.path, () => {});
      throw createError(400, "Name, email and password are required");
    }

    // Ensure file was uploaded
    if (!image) {
      throw createError(400, "Image file is required");
    }

    // Enforce size limit (use same MAX_FILE_SIZE as multer config)
    if (typeof MAX_FILE_SIZE === "number" && image.size > MAX_FILE_SIZE) {
      // remove uploaded file
      if (image.path) fs.unlink(image.path, () => {});
      throw createError(
        400,
        `Image must be less than ${Math.round(MAX_FILE_SIZE / 1024 / 1024)} MB`,
      );
    }

    // Check if user already exists
    const userExists = await User.exists({ email });
    if (userExists) {
      // remove uploaded file
      if (image.path) fs.unlink(image.path, () => {});
      throw createError(
        409,
        "User with this email already exists. Please sign in.",
      );
    }

    // Hash password (do not store raw password in token)
    const passwordHash = await bcrypt.hash(password, 10);

    // Create a small activation token (only include minimal info)
    const tokenPayload = { email };
    const token = createJSONWebToken(tokenPayload, jwtActivationKey, "10m");

    // Save pending registration in memory (or DB/Redis in production)
    // Store the uploaded filename so you can finalize the user on activation
    pendingRegistrations.set(token, {
      name,
      email,
      passwordHash,
      phone,
      address,
      imageFilename: image.filename, // multer.diskStorage filename
      imagePath: image.path,
      createdAt: Date.now(),
    });

    // Prepare activation email
    const activationLink = `${clientURL}/api/users/activation/${token}`;
    const emailData = {
      email,
      subject: "Account activation Email",
      html: `
        <h2>Hello ${name}!</h2>
        <p>Please click the link below to activate your account (link expires in 10 minutes):</p>
        <a href="${activationLink}">Activate account</a>
      `,
    };

    // Send email (optional). If email fails, we still keep pending registration for retry.
    try {
      // Uncomment or implement your email sender
      // await emailWithNodeMail(emailData);
    } catch (emailError) {
      console.error("Email send failed:", emailError);
      // You may choose to remove pending registration and uploaded file here,
      // or keep it and allow retry. We'll keep it and inform the client.
      return next(createError(500, "Failed to send verification email"));
    }

    return successResponse(res, {
      statusCode: 200,
      message: `Please check ${email} to complete registration.`,
      payload: { token }, // return token for testing; in production you may omit
    });
  } catch (error) {
    next(error);
  }
};
*/
// Activate User Account

const activateUserAccount = async (req, res, next) => {
  try {
    const token = req.body.token;
    if (!token) throw createError(404, "token not found");

    try {
      const decoded = jwt.verify(token, jwtActivationKey);
      if (!decoded) throw createError(401, "User was not able to verify");

      // Just check the usee was  already exist
      const userExists = await User.exists({ email: decoded.email });
      if (userExists) {
        return next(
          createError(
            409,
            "User with this email already exists. Please sign in.",
          ),
        );
      }
      const image = decoded.image;
      if (image) {
        const response = await cloudinary.uploader.upload(image, {
          folder: "RPMS/userProfile",
        });
        decoded.image = response.secure_url;
      }

      await User.create(decoded);

      return successResponse(res, {
        statusCode: 201,
        message: "User was registration successfully",
      });
    } catch (error) {
      if (error.name == "TokenExpiredError") {
        throw createError(401, "Token has expired");
      } else if (error.name == "JsonWebTokenError") {
        throw createError(401, "Invalid Token");
      } else {
        throw error;
      }
    }
  } catch (error) {
    next(error);
  }
};

/*
// Code from AI
// Activate User Account
const activateUserAccount = async (req, res, next) => {
  try {
    const token = req.body.token;
    if (!token) return next(createError(404, "token not found"));

    let decoded;
    try {
      decoded = jwt.verify(token, jwtActivationKey);
      if (!decoded)
        return next(createError(401, "User was not able to verify"));
    } catch (err) {
      if (err.name === "TokenExpiredError")
        return next(createError(401, "Token has expired"));
      if (err.name === "JsonWebTokenError")
        return next(createError(401, "Invalid Token"));
      return next(err);
    }

    // Check if user already exists
    const userExists = await User.exists({ email: decoded.email });
    if (userExists) {
      return next(
        createError(
          409,
          "User with this email already exists. Please sign in.",
        ),
      );
    }

    // Handle image if present
    if (decoded.image) {
      try {
        // Normalize possible shapes
        let imageSource = decoded.image;

        // Case: MongoDB Binary wrapper { $binary: { base64: "...", subType: "00" } }
        if (imageSource && imageSource.$binary && imageSource.$binary.base64) {
          const base64Payload = imageSource.$binary.base64;
          // Try to decode to check whether payload is a URL string or raw image bytes
          const maybeString = Buffer.from(base64Payload, "base64").toString(
            "utf8",
          );

          if (/^https?:\/\//i.test(maybeString)) {
            // It's a URL encoded as base64
            imageSource = maybeString;
          } else {
            // It's raw image bytes encoded as base64 -> convert to data URI
            // You may want to detect mime type; assume jpeg/png fallback
            // If you know the original mime type, use it here
            imageSource = `data:image/jpeg;base64,${base64Payload}`;
          }
        }

        // Case: plain base64 string (no wrapper) — detect if it's a URL or raw bytes
        if (
          typeof imageSource === "string" &&
          !imageSource.startsWith("data:")
        ) {
          // If it's plain base64 (no data: prefix) but not a URL, treat as image bytes
          if (
            !/^https?:\/\//i.test(imageSource) &&
            /^[A-Za-z0-9+/=]+$/.test(imageSource)
          ) {
            imageSource = `data:image/jpeg;base64,${imageSource}`;
          }
        }

        // If imageSource is already a remote URL, upload can accept it (Cloudinary will fetch it)
        // If imageSource is a data URI, Cloudinary will accept it too.
        const response = await cloudinary.uploader.upload(imageSource, {
          folder: "RPMS/userProfile",
        });

        decoded.image = response.secure_url;
      } catch (uploadErr) {
        console.error("Cloudinary upload error:", uploadErr);
        // Decide whether to fail activation or continue without image
        // Here we continue but log the issue and set image to null
        decoded.image = null;
      }
    }

    // Create user in DB (example)
    const newUser = await User.create({
      name: decoded.name,
      email: decoded.email,
      password: decoded.passwordHash || undefined, // ensure you handle password properly
      image: decoded.image || null,
      role: decoded.role || "Student",
      // other fields...
    });

    return successResponse(res, {
      statusCode: 201,
      message: "User was registered successfully",
      data: { userId: newUser._id, image: newUser.image },
    });
  } catch (error) {
    next(error);
  }
};
*/

// Update user by ID
const handelUpdateUserByID = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const updatedUser = await updateUserById(userId, req);

    return successResponse(res, {
      statusCode: 200,
      message: "Users was updated successfully.",
      payload: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

const handelManageUserStatusById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const action = req.body.action;

    const successMessage = await handelUserAction(action, userId);

    return successResponse(res, {
      statusCode: 200,
      message: successMessage,
    });
  } catch (error) {
    next(error);
  }
};
const handelUpdatePassword = async (req, res, next) => {
  try {
    const { email, oldPassword, newPassword, confirmedPassword } = req.body;
    const userId = req.params.id;

    const updatedUser = await updateUserPasswordById(
      userId,
      email,
      oldPassword,
      newPassword,
      confirmedPassword,
    );
    return successResponse(res, {
      statusCode: 200,
      message: "Password update successful.",
      payload: { updatedUser },
    });
  } catch (error) {
    next(error);
  }
};

const handelForgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const token = await forgetUserPasswordByEmail(email);

    return successResponse(res, {
      statusCode: 200,
      message: `Please go to your ${email} to reset your password.`,
      payload: token,
    });
  } catch (error) {
    next(error);
  }
};
const handelResetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    await resetPassword(token, password);
    return successResponse(res, {
      statusCode: 200,
      message: "Reset password successfully",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  handelDeleteUserById,
  processRegister,
  activateUserAccount,
  handelUpdateUserByID,
  handelManageUserStatusById,
  handelUpdatePassword,
  handelForgetPassword,
  handelResetPassword,
};
