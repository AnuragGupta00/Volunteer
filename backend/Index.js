
require("dotenv").config({ path: "./.env" });
console.log("MONGO_URI:", process.env.MONGO_URI);
const express = require("express");
const connectDB = require("./config/connectDB");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

connectDB(); // Connecting to MongoDB

app.get("/", (req, res) => {
    res.send("API is running...");
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});