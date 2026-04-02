const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
const { defaultImagePath } = require("../secret");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "User name is required"],
      trim: true,
      min_length: [3, "The length of user name can be minimum 3 characters"],
      max_length: [31, "The length of user name can be maximum 31 characters"],
    },

    // For check the email validation
    email: {
      type: String,
      required: [true, "Email name is required"],
      trim: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: "Please enter a valid email",
      },
    },

    // For check the password validation
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      validate: {
        validator: (v) => v.length >= 4,
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      },
      set: (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(10)),
    },

    image: {
      type: Buffer,
      contentType: String,
      required: [true, "Image is required"],
    },

    address: {
      type: String,
      required: [true, "Address is required"],
      minlength: [3, "Address must be at least 3 characters long"],
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      minlength: [11, "Address must be at least 11 characters long"],
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },

    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const User = model("Users", userSchema);

module.exports = User;
