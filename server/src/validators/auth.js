const { body } = require("express-validator");

// Registration validation
const validateUserRegistration = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3, max: 31 })
    .withMessage("Name should be at least 3-31 character long"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address"),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8, max: 32 })
    .withMessage("Name should be at least 8-32 character long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    )
    .withMessage(
      "Password should contain at least one uppercase letter, one lowercase letter, one number and one special character",
    ),

  body("address")
    .trim()
    .notEmpty()
    .withMessage("Address is required")
    .isLength({ min: 3, max: 31 })
    .withMessage("Address should be at least 3-31 character long"),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone is required")
    .isLength({ min: 11 })
    .withMessage("Phone should be at least 11 character long"),

  // body("image")
  //   .custom((value, { req }) => {
  //     if (!req.file) {
  //       throw new Error("User image is required");
  //     }
  //     // if using diskStorage, check filename or path
  //     if (!req.file.filename && !req.file.path) {
  //       throw new Error("Uploaded file is invalid");
  //     }
  //     return true;
  //   })
  //   .withMessage("User image is required"),

  // validators/auth.js
  body("image").custom((_, { req }) => {
    if (!req.file) throw new Error("User image is required");
    return true;
  }),
];

const validateUserLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address"),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8, max: 32 })
    .withMessage("Password should be at least 8-32 character long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    )
    .withMessage(
      "Password should contain at least one uppercase letter, one lowercase letter, one number and one special character",
    ),
];

const validateUserPasswordUpdate = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address"),

  body("oldPassword")
    .trim()
    .notEmpty()
    .withMessage("Old Password is required")
    .isLength({ min: 8, max: 32 })
    .withMessage("Name should be at least 8-32 character long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    )
    .withMessage(
      "Password should contain at least one uppercase letter, one lowercase letter, one number and one special character",
    ),
  body("newPassword")
    .trim()
    .notEmpty()
    .withMessage("New Password is required")
    .isLength({ min: 8, max: 32 })
    .withMessage("Password should be at least 8-32 character long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    )
    .withMessage(
      "New Password should contain at least one uppercase letter, one lowercase letter, one number and one special character",
    ),
  body("confirmedPassword").custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error("New & Confirm Password did not match");
    }
    return true;
  }),
];

const validateUserForgetPassword = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required. Enter your email address")
    .isEmail()
    .withMessage("Invalid email address"),
];

const validateUserResetPassword = [
  body("token").trim().notEmpty().withMessage("Token is missing"),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8, max: 32 })
    .withMessage("Password should be at least 8-32 character long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    )
    .withMessage(
      "Password should contain at least one uppercase letter, one lowercase letter, one number and one special character",
    ),
];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateUserPasswordUpdate,
  validateUserForgetPassword,
  validateUserResetPassword,
};
