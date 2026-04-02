const { body } = require("express-validator");

// Registration validation
const validateCategory = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category Name is required")
    .isLength({ min: 3 })
    .withMessage(" CategoryName should be at least 3 character long"),
];

module.exports = { validateCategory };
