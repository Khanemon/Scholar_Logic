require("dotenv").config();

const serverPort = process.env.SERVER_PORT || 3002;

// Choose Atlas first, fallback to local
const mongodbURL =
  process.env.MONGODB_ATLAS_URL || process.env.MONGODB_LOCAL_URL;

const defaultImagePath =
  process.env.DEFAULT_USER_IMAGE_PATH || "../public/images/users/EmonPic.jpg";

// JWT activation key.
const jwtActivationKey = process.env.JWT_ACTIVATION_KEY || "dghosghgkn_28$%";
const jwtAccessKey = process.env.JWT_ACCESS_KEY;

const jwtResetPasswordKey =
  process.env.JWT_RESET_PASSWORD_KEY || "ahjspgjobipb_28y36275";
const jwtRefreshKey =
  process.env.JWT_ACCESS_PASSWORD_KEY || "jokdebghoi_sjvbhv";

// SMTP access.
const smtpUsername = process.env.SMTP_Username || "";

const smtpPassword = process.env.SMTP_Password || "";

const clientURL = process.env.CLIENT_URL || "";

module.exports = {
  serverPort,
  mongodbURL,
  defaultImagePath,
  jwtActivationKey,
  jwtAccessKey,
  jwtRefreshKey,
  smtpUsername,
  smtpPassword,
  clientURL,
  jwtResetPasswordKey,
};
