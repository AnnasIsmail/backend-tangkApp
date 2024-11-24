const mongoose = require("mongoose");

// Skema untuk accessStatus
const accessStatusSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId, // ObjectId dari MongoDB
    required: true,
  },
  indexStatus: {
    type: Number, // Index status unik
    required: true,
  },
  nama: {
    type: String, // Nama status
    required: true,
  },
});

// Skema untuk roles
const roleSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId, // ObjectId dari MongoDB
    required: true,
  },
  nama: {
    type: String, // Nama role
    required: true,
  },
  accessStatus: {
    type: [accessStatusSchema], // Array objek accessStatus
    default: [], // Defaultnya adalah array kosong
  },
});

const Roles = mongoose.model("roles", roleSchema);

module.exports = Roles;
