const mongoose = require("mongoose");

// Sub-schema untuk Status Detail
const subStatusSchema = mongoose.Schema({
  nama: {
    type: String,
    
  },
  userIn: {
    type: String,
    default: "",
  },
  NIK: {
    type: String,
    default: "",
  },
  namaUser: {
    type: String,
    default: "",
  },
  dateIn: {
    type: String,
    default: "",
  },
  dateUp: {
    type: String,
    default: "",
  },
  notes: {
    type: String,
    default: "",
  },
  deskripsiKendala: {
    type: String,
    default: "",
  },
});

// Sub-schema untuk Status
const statusSchema = mongoose.Schema({
  name: {
    type: String,
    
  },
  subStatus: {
    type: String,
    default: "",
  },
  dateIn: {
    type: String,
    default: "",
  },
  dateUp: {
    type: String,
    default: "",
  },
  statusDetail: [subStatusSchema],
});

// Sub-schema untuk PIC
const picSchema = mongoose.Schema({
  namaPIC: {
    type: String,
    default: "",
  },
  kontakPIC: {
    type: String,
    default: "",
  },
});

// Schema utama untuk Berkas
const berkasSchema = mongoose.Schema({
  idBerkas: {
    type: Number,
    
    unique: true,
  },
  noBerkas: {
    type: Number,
    
  },
  tahunBerkas: {
    type: Number,
    
  },
  tanggalTerima: {
    type: String,
    
  },
  idKegiatan: {
    type: String,
    
  },
  namaSubsek: {
    type: String,
  },
  namaKegiatan: {
    type: String,
    
  },
  idPemohon: {
    type: String,
    
  },
  namaPemohon: {
    type: String,
    
  },
  idJenisHak: {
    type: String,
    
  },
  JenisHak: {
    type: String,
    
  },
  noHak: {
    type: Number,
    
  },
  idDesa: {
    type: String,
    
  },
  namaDesa: {
    type: String,
    
  },
  namaKecamatan: {
    type: String,
    
  },
  idPetugasUkur: {
    type: String,
    default: null, 
  },
  namaPetugasUkur: {
    type: String,
    default: null, 
  },
  idPetugasSPS: {
    type: String,
    
  },
  namaPetugasSPS: {
    type: String,
    
  },
  tanggalSPS: {
    type: String,
    
  },
  statusAlihMedia: {
    type: Boolean,
    
  },
  statusBayarPNBP: {
    type: Boolean,
    
  },
  idUser: {
    type: String,
    
  },
  PIC: [picSchema], // Array PIC tidak wajib diisi
  status: [statusSchema],
  dateIn: {
    type: String,
  },
  dateUp: {
    type: String,
    default: null, // Tidak wajib diisi
  },
});

const berkas = mongoose.model("Berkas", berkasSchema);

module.exports = berkas;
