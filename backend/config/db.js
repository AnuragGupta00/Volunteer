const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected: ${conn.connection.host}");
  } catch (error) {
    console.log("MongoDB Connection Error HERE --->");
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;