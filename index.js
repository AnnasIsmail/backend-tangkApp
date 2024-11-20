const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;
var bodyParser = require("body-parser");
const axios = require("axios");
require('dotenv').config();

require("./connectDB");

const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const berkasRoutes = require("./routes/berkasRoutes");
const petugasUkurRoutes = require("./routes/petugasUkurRoutes");
const petugasSPSRoutes = require("./routes/petugasSPSRoutes");
// const VPSRoutes = require("./routes/VPS");
// const lambdaRoutes = require("./routes/lambda");

const users = require("./model/users");
// const listUpdateId = require("./model/listUpdateId");
// const logUpdateId = require("./model/logUpdateId");
// const requestDay = require("./model/requestPerDay");
// const queueVPS = require("./model/queueVPS");
// const VPS = require("./model/VPS");
// const errorMessage = require("./model/errorMessage");
// const admin = require("./model/admin");

const moment = require('moment');
const momentTimeZone = require('moment-timezone');
const dbFormatDate = "DD MMMM YYYY";
const dbFormatDateTime = "YYYY-MM-DDTHH:mm:ss";

// ----------------------------------------------------------------------

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

const server = require("http").createServer(app);
app.listen(PORT, () => {
    console.log("Server running on Port: "+ PORT);
  });

app.get("/", async (req, res) => {
    res.status(500).send("Error Internal Server.");
});


// app.post("/test", async (req, res) => {
//     const today = momentTimeZone().tz("Asia/Jakarta");
    
//     const dataToInsert = [
//         {
//             NIK: "12345",
//             nama: "Annas-Dev",
//             role: ["Admin"],
//             dateIn: today.format(dbFormatDateTime),
//         },
//         {
//             NIK: "67890",
//             nama: "Riza-Dev",
//             role: ["Orang Biasa"],
//             dateIn: today.format(dbFormatDateTime),
//         },
//     ];

//     try {
//         const admins = await users.insertMany(dataToInsert);
//         res.status(200).json({ data: admins });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });


async function ensureMongoConnection() {
  if (mongoose.connection.readyState !== 1) {
    console.log('Reconnecting to MongoDB...');
    try {
      await mongoose.connect('mongodb+srv://chegg-permission:chegg123@serverlessinstance0.jc8bmep.mongodb.net/test');
      console.log('MongoDB reconnected successfully');
    } catch (err) {
      console.error('Failed to reconnect to MongoDB:', err);
    }
  }
}

mongoose.connection.on('disconnected', async () => {
  if (mongoose.connection.readyState !== 1) {
    console.error('MongoDB connection is not ready, attempting to reconnect...');
    const ready = await ensureMongoConnection();
    console.log(ready);
  }
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

app.use("/user", userRoutes);
app.use("/berkas", berkasRoutes);
app.use("/petugas-ukur", petugasUkurRoutes);
app.use("/petugas-sps", petugasSPSRoutes);