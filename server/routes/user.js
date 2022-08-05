const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const authentication = require("../middlewares/authentication");

router.post("/register", async (req, res) => {
  try {
    const { name, username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await new User({
      name,
      username,
      password: hashedPassword,
      sessions: [{ createdAt: new Date() }],
    }).save();

    const sessionId = user.sessions[user.sessions.length - 1]._id;

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      username: user.username,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      sessionId,
    });
  } catch (error) {
    console.error(`register - ${error}`);
    return res.status(500).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: "Invalid user credentials." });
    }

    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword) {
      return res.status(400).json({ message: "Invalid user credentials." });
    }

    user.sessions.push({ createdAt: new Date() });

    await user.save();

    const sessionId = user.sessions[user.sessions.length - 1]._id;

    return res.status(200).json({
      _id: user._id,
      name: user.name,
      username: user.username,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      sessionId,
    });
  } catch (error) {
    console.error(`login - ${error}`);
    return res.status(500).json({ message: error.message });
  }
});

router.post("/logout", authentication, async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Invalid user." });
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      {
        sessions: [],
      },
      { new: true }
    );

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error(`logout - ${error}`);
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
