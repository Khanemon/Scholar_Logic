const { Schema, model } = require("mongoose");

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      unique: true,
      min_length: [3, "The length of user name can be minimum 3 characters"],
      max_length: [31, "The length of user name can be maximum 31 characters"],
    },
    slug: {
      type: String,
      required: [true, "Slug name is required"],
      lowercase: true,
      unique: true,
    },
  },
  { timestamps: true },
);

const Category = model("Category", categorySchema);

module.exports = Category;
