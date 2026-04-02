const slugify = require("slugify");
const { successResponse } = require("./responseController");
const Category = require("../models/categoryModel");
const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
} = require("../services/categoryServices");

const handelCreateCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    await createCategory(name);

    return successResponse(res, {
      statusCode: 200,
      message: "Category was created successfully",
    });
  } catch (error) {
    next(error);
  }
};
const handelGetCategories = async (req, res, next) => {
  try {
    const categories = await getCategories();
    return successResponse(res, {
      statusCode: 200,
      message: "Category fetched successfully",
      payload: categories,
    });
  } catch (error) {
    next(error);
  }
};

const handelGetCategory = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const categories = await getCategory(slug);
    return successResponse(res, {
      statusCode: 200,
      message: "Category fetched successfully",
      payload: categories,
    });
  } catch (error) {
    next(error);
  }
};

const handelUpdateCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const { slug } = req.params;

    const category = await updateCategory(name, slug);

    return successResponse(res, {
      statusCode: 200,
      message: "Category was created successfully",
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  handelCreateCategory,
  handelGetCategories,
  handelGetCategory,
  handelUpdateCategory,
};
