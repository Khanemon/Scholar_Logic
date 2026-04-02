const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const createError = require("http-errors");
const seedRouter = require("./routers/seedRouter");
const userRouter = require("./routers/userRouter");
const { errorResponse } = require("./controllers/responseController");
const authRouter = require("./routers/authRouter");
const categoryRouter = require("./routers/categoryRouter");

const app = express();

app.use(morgan("dev"));
app.use(cookieParser());

// Body parsers MUST come before routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register routes after parsers
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/seed", seedRouter);
app.use("/api/categories", categoryRouter);

// Example route
app.put("/test", (req, res) => {
  res.status(200).send({
    message: "API put method working perfectly",
  });
});

const isLoggedIn = (req, res, next) => {
  const login = true;
  if (login == true) {
    next();
  } else {
    return res.status(401).json({ message: "Please login first" });
  }
};

app.get("/", isLoggedIn, (req, res) => {
  res.status(200).send({
    message: "Welcome to the Home Page",
  });
});

app.get("/api/user", isLoggedIn, (req, res) => {
  res.status(200).send({
    message: "User profile get successfully",
  });
});

// client error handling
app.use((req, res, next) => {
  next(createError(404, "route not found"));
});

// server error handling => all the errors
app.use((err, req, res, next) => {
  return errorResponse(res, {
    statusCode: err.status,
    message: err.message,
  });
});

// // server success
// const successResponse = (
//   res,
//   { statusCode = 200, message = "Success", payload = {} },
// ) => {
//   return res.status(statusCode).json({
//     success: true,
//     message: message,
//     payload,
//   });
// };

module.exports = app;
