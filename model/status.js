const mongoose = require("mongoose");

const statusSchema = mongoose.Schema({
  indexStatus: {
    type: Number,
    unique: true,
  },
  nama: {
    type: String,
    
  }
});

const status = mongoose.model("status", statusSchema);

module.exports = status;
