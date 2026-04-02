const multer = require("multer");

const {
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE,
  UPLOAD_USER_IMG_DIRECTORY,
} = require("../config");

const userStorage = multer.diskStorage({
  // destination: function (req, file, cb) {
  //   cb(null, UPLOAD_USER_IMG_DIRECTORY);
  // },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// const fileFilter = (req, file, cb) => {
//   if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
//     return cb(new Error("File type is not allowed"), false);
//   }
//   cb(null, true);
// };

// in uploadFile.js
const fileFilter = (req, file, cb) => {
  const mimetype = (file.mimetype || "").toLowerCase();
  if (!ALLOWED_FILE_TYPES.map((t) => t.toLowerCase()).includes(mimetype)) {
    return cb(new Error("File type is not allowed"), false);
  }
  cb(null, true);
};

const uploadUserImage = multer({
  storage: userStorage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: fileFilter,
});

module.exports = uploadUserImage;

/*
// const path = require("path");
const multer = require("multer");
const storage = multer.memoryStorage();

const { ALLOWED_FILE_TYPES, MAX_FILE_SIZE, UPLOAD_USER_IMG_DIRECTORY } =
  require("../config").default;

const userStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_USER_IMG_DIRECTORY),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const fileFilter = (req, file, cb) => {
  const mimetype = (file.mimetype || "").toLowerCase();
  if (!ALLOWED_FILE_TYPES.map((t) => t.toLowerCase()).includes(mimetype)) {
    return cb(new Error("File type is not allowed"), false);
  }
  cb(null, true);
};

const uploadUserImage = multer({
  storage: userStorage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});

module.exports = uploadUserImage;
*/
