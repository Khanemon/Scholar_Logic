const User = require("../models/userModel");
const data = require("../data"); // or wherever your dummy data is

const seedUser = async (req, res, next) => {
  try {
    // deleting all users
    await User.deleteMany({});

    // inserting new users
    const users = await User.insertMany(data.users);

    // successful response
    return res.status(201).json(users);
  } catch (error) {
    next(error);
  }
};

module.exports = { seedUser };
