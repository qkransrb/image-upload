const express = require("express");
const cors = require("cors");
const path = require("path");
const { config } = require("dotenv");
const database = require("./database");

config();

const app = express();
const PORT = process.env.PORT;

database();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.resolve(__dirname, "uploads")));
app.use("/images", require("./routes/image"));
app.use("/users", require("./routes/user"));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
