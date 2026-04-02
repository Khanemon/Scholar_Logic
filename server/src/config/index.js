const UPLOAD_USER_IMG_DIRECTORY = "public/images/users";
const MAX_FILE_SIZE = Number(4194304);
const ALLOWED_FILE_TYPES = ["image/jpg", "image/jpeg", "image/png"];

module.exports = {
  UPLOAD_USER_IMG_DIRECTORY,
  MAX_FILE_SIZE,
  ALLOWED_FILE_TYPES,
};

// src/config/index.js
// const path = require("path");
// const fs = require("fs");

// const UPLOAD_USER_IMG_DIRECTORY = path.resolve(
//   __dirname,
//   "..",
//   "..",
//   "public",
//   "images",
//   "users",
// );
// if (!fs.existsSync(UPLOAD_USER_IMG_DIRECTORY)) {
//   fs.mkdirSync(UPLOAD_USER_IMG_DIRECTORY, { recursive: true });
// }

// const MAX_FILE_SIZE = 1024 * 1024 * 2;
// const ALLOWED_FILE_TYPES = ["image/jpg", "image/jpeg", "image/png"];

// module.exports = {
//   UPLOAD_USER_IMG_DIRECTORY,
//   MAX_FILE_SIZE,
//   ALLOWED_FILE_TYPES,
// };
