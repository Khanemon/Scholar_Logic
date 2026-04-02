const createError = require("http-errors");
const User = require("../models/userModel");
const { successResponse } = require("../controllers/responseController");
const { isAdmin } = require("../middlewares/auth");
const { deleteImage } = require("../helper/deleteUser");
const bcrypt = require("bcryptjs");
const { createJSONWebToken } = require("../helper/jsonwebtoken");
const { jwtResetPasswordKey, clientURL } = require("../secret");
const { emailWithNodeMail } = require("../helper/email");
const jwt = require("jsonwebtoken");
const sendEmail = require("../helper/sendEmail");
// const { UPLOAD_USER_IMG_DIRECTORY } = require("../config").default;

const findUsers = async (search, limit, page) => {
  try {
    const searchRegExp = new RegExp(".*" + search + ".*", "i");
    const filter = {
      isAdmin: { $ne: true },
      $or: [
        { name: { $regex: searchRegExp } },
        { email: { $regex: searchRegExp } },
        { phone: { $regex: searchRegExp } },
      ],
    };
    const options = { password: 0 };

    const users = await User.find(filter, options)
      .limit(limit)
      .skip((page - 1) * limit);

    const count = await User.find(filter).countDocuments();

    if (!users) throw createError(404, "no user found");

    return {
      users,
      pagination: {
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        previousPage: page - 1 > 0 ? page - 1 : null,
        nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
      },
    };
  } catch (error) {
    throw error;
  }
};

const findUserById = async (id, options = {}) => {
  try {
    const user = await User.findById(id, options);
    if (!user) throw createError(404, "User not found");
    return user;
  } catch (error) {
    throw error;
  }
};

const deleteUserById = async (id, options = {}) => {
  try {
    const user = await User.findByIdAndDelete({
      _id: id,
      isAdmin: false,
    });

    if (user && user.image) {
      await deleteImage(user.image);
    }
  } catch (error) {
    throw error;
  }
};

/*
const deleteUserById = async (id, options = {}) => {
  try {
    // findOneAndDelete accepts a filter object
    const user = await User.findOneAndDelete({ _id: id, isAdmin: false });

    if (!user) {
      return null; // caller will handle 404 / not found / not allowed
    }

    // If user.image stores only filename, build full path
    if (user.image) {
      const imagePath = path.isAbsolute(user.image)
        ? user.image
        : path.join(UPLOAD_USER_IMG_DIRECTORY, user.image);
      await deleteImage(imagePath);
    }

    return user;
  } catch (error) {
    throw error;
  }
};
*/
const updateUserById = async (userId, req) => {
  try {
    const options = { password: 0 };
    const user = await findUserById(userId, options);

    const updateOption = { new: true, runValidation: true, context: "query" };
    let updates = {};

    const allowedFields = ["name", "password", "phone", "address"];
    for (const key in req.body) {
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key];
      } else if (key == "email") {
        throw createError(400, "Email can not be updated");
      }
    }

    const image = req.file?.path;
    if (image) {
      if (image.size > 1024 * 1024 * 2) {
        throw createError(400, "File too large. It must be less then 2 mb");
      }
      updates.image = image;
      user.image !== "default.jpeg" && deleteImage(user.image);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      updateOption,
    ).select("-password");

    if (!updatedUser) {
      throw createError(404, "User with this ID does not exist");
    }
    return updatedUser;
  } catch (error) {
    throw error;
  }
};

const handelUserAction = async (userId, action) => {
  try {
    let update;
    let successMessage;

    if (action == "ban") {
      update = { isBanned: true };
      successMessage = "User was banned successfully";
    } else if (action == "unban") {
      update = { isBanned: false };
      successMessage = "User was Un banned successfully";
    } else {
      throw createError(404, 'Invalid action. Use "ban" or "unBan"');
    }
    const updateOption = { new: true, runValidation: true, context: "query" };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      update,
      updateOption,
    ).select("-password");

    if (!updatedUser) {
      throw createError(404, "User was not manage successfully");
    }
    return successMessage;
  } catch (error) {
    throw error;
  }
};

const updateUserPasswordById = async (
  userId,
  email,
  oldPassword,
  newPassword,
  confirmedPassword,
) => {
  try {
    const user = await User.findOne({ email: email });

    if (newPassword !== confirmedPassword) {
      throw createError(400, "New and confirmed password not match");
    }
    if (!user) {
      throw createError(400, "User not found");
    }
    // compare the password
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatch) {
      throw createError(400, "Old password is not correct");
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { password: newPassword },
      { new: true },
    ).select("-password");

    if (!updatedUser) {
      throw createError(400, "User was not update successfully.");
    }
    return updatedUser;
  } catch (error) {
    throw error;
  }
};
const forgetUserPasswordByEmail = async (email) => {
  try {
    const userData = await User.findOne({ email: email });
    if (!userData) {
      throw createError(
        404,
        "Email is incorrect or you have not verified your email address. Please register yourself first.",
      );
    }
    // create jwt
    const token = createJSONWebToken({ email }, jwtResetPasswordKey, "10m");

    // prepare emailData
    const emailData = {
      email,
      subject: "Reset password email",
      html: `
        <h2>Hello ${userData.name}!</h2>
        <p>Please click here to activate your account:</p>
        <a href="${clientURL}/api/users/reset-password/${token}">Reset your password</a>
      `,
    };

    // send email with nodemailer
    sendEmail(emailData);

    return token;
  } catch (error) {
    throw error;
  }
};

const resetPassword = async (token, password) => {
  try {
    const decoded = jwt.verify(token, jwtResetPasswordKey);

    if (!decoded) {
      throw createError(400, "Invalid or expired token");
    }

    const filter = { email: decoded.email };
    const update = { password: password };
    const options = { new: true };
    const updateUser = await User.findOneAndUpdate(
      filter,
      update,
      options,
    ).select("-password");

    if (!updateUser) {
      throw createError(400, "Password reset failed.");
    }
  } catch (error) {
    throw error;
  }
};
module.exports = {
  findUsers,
  deleteUserById,
  handelUserAction,
  updateUserById,
  findUserById,
  updateUserPasswordById,
  forgetUserPasswordByEmail,
  resetPassword,
};
