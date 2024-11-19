const mongoose = require("mongoose");

const pemohonSchema = new mongoose.Schema({
  namaPemohon: {
    type: String,
    required: true,
  },
  dateIn: {
    type: String,
    required: true,
  },
  dateUp: {
    type: String,
  },
});

module.exports = mongoose.model("Pemohon", pemohonSchema);
