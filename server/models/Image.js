const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
    },
    originalFileName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Image", imageSchema);
