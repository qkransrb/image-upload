const express = require("express");
const router = express.Router();
const Image = require("../models/Image");
const upload = require("../utils/imageUpload");

router.post("/", upload.single("image"), async (req, res) => {
  console.log("> req file: ", req.file);
  const image = await new Image({
    key: req.file.filename,
    originalFileName: req.file.originalname,
  }).save();
  return res.json(image);
});

router.get("/", async (req, res) => {
  const images = await Image.find();
  return res.status(200).json(images);
});

module.exports = router;
