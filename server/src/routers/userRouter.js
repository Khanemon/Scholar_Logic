const express = require("express");

const {
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
} = require("../controllers/userController");
const {
  validateUserRegistration,
  validateUserPasswordUpdate,
  validateUserForgetPassword,
  validateUserResetPassword,
} = require("../validators/auth");
const runValidation = require("../validators");

const uploadUserImage = require("../middlewares/uploadFile");
const { isLoggedIn, isLoggedOut, isAdmin } = require("../middlewares/auth");

const userRouter = express.Router();

// GET: api/users
userRouter.post(
  "/process_register",
  uploadUserImage.single("image"),
  isLoggedOut,
  validateUserRegistration,
  runValidation,
  processRegister,
);
userRouter.post("/activate", isLoggedOut, activateUserAccount);
userRouter.get("/", isLoggedIn, isAdmin, getUsers);
userRouter.get("/:id", isLoggedIn, getUserById);
userRouter.delete("/:id", isLoggedIn, isAdmin, handelDeleteUserById);
userRouter.put(
  "/reset-password",
  validateUserResetPassword,
  runValidation,
  handelResetPassword,
);
userRouter.put(
  "/:id",
  uploadUserImage.single("image"),
  isLoggedIn,
  handelUpdateUserByID,
);
userRouter.put(
  "/manage-user/:id",
  isLoggedIn,
  isAdmin,
  handelManageUserStatusById,
);
userRouter.put(
  "/update-password/:id",
  validateUserPasswordUpdate,
  runValidation,
  isLoggedIn,
  handelUpdatePassword,
);

userRouter.post(
  "/forget-password",
  validateUserForgetPassword,
  runValidation,
  handelForgetPassword,
);
// userRouter.put("/unBan-user/:id", isLoggedIn, isAdmin, handelUnBanUserById);

module.exports = userRouter;
