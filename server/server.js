const express = require("express");
const path = require("path");
const multer = require("multer");
const { v4: uuid } = require("uuid");
const mime = require("mime-types");

const app = express();
const PORT = 5000;

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

app.post("/upload", upload.single("image"), (req, res) => {
  console.log(req.file);
  return res.json(req.file);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
