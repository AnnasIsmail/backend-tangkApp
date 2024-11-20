
const db = process.env.DB;
const mongoose = require("mongoose");

mongoose.connect(
    // "mongodb://127.0.0.1:27017/tangkApp",
    "mongodb+srv://annas:annas123@cluster0.ey2dmu0.mongodb.net/tangkApp"
);
