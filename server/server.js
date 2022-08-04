const express = require("express");
const cors = require("cors");
const path = require("path");
const { config } = require("dotenv");
const multer = require("multer");
const { v4: uuid } = require("uuid");
const mime = require("mime-types");
const database = require("./database");
const Image = require("./models/Image");

const app = express();
const PORT = 5000;

config();

app.use(cors());

database();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.resolve(__dirname, "uploads")),
  filename: (req, file, cb) =>
    cb(null, `${uuid()}.${mime.extension(file.mimetype)}`),
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (["image/png", "image/jpeg"].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("invalid file type"), false);
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

app.use("/uploads", express.static(path.resolve(__dirname, "uploads")));

app.post("/upload", upload.single("image"), async (req, res) => {
  const image = await new Image({
    key: req.file.filename,
    originalFileName: req.file.originalname,
  }).save();
  return res.json(image);
});

app.get("/images", async (req, res) => {
  const images = await Image.find();
  return res.status(200).json(images);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
