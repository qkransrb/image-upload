const mongoose = require("mongoose");

module.exports = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.MONGO_URI);
    console.log(`database connected - ${connection.host}`);
  } catch (error) {
    console.error(`database connection failed - ${error}`);
    process.exit(1);
  }
};
