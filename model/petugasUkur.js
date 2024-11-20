const mongoose = require("mongoose");

const petugasUkurSchema = new mongoose.Schema({
  NIK: {
    type: Number,
    required: true,
    unique: true,
  },
  nama: {
    type: String,
    required: true,
  },
  dateIn: {
    type: Date,
    default: Date.now, 
  },
  dateUp: {
    type: Date,
    default: null, 
  },
});

module.exports = mongoose.model("PetugasUkur", petugasUkurSchema);
