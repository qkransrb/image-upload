const { isValidObjectId } = require("mongoose");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    const { sessionid } = req.headers;

    if (!sessionid || !isValidObjectId(sessionid)) {
      return res.status(401).json({ message: "Not authenticated." });
    }

    const user = await User.findOne({
      "sessions._id": sessionid,
    });

    if (!user) {
      return res.status(401).json({ message: "Not authenticated." });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error(`authentication - ${error}`);
    return res.status(401).json({ message: error.message });
  }
};
