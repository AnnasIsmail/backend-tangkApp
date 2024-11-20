const PetugasUkur = require("../model/petugasUkur");
const express = require("express");
const router = express.Router();
const momentTimeZone = require('moment-timezone');
const { verifyToken } = require("../function/verifyToken");

const dbFormatDate = "DD MMMM YYYY";
const dbFormatDateTime = "YYYY-MM-DDTHH:mm:ss";
const userFormat = "dddd DD MMMM YYYY HH:mm:ss";

const SECRET_KEY = "TangkApp"; 

// Tambah PetugasUkur baru
router.post("/", async (req, res) => {
    const { NIK, nama } = req.body;
  
    try {
      const newPetugasUkur = new PetugasUkur({
        NIK,
        nama,
    });
  
      const savedPetugasUkur = await newPetugasUkur.save();
      res.status(201).json({ message: "Petugas ukur berhasil ditambahkan", savedPetugasUkur });
    } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan saat menambahkan petugas ukur", error });
    }
  });

  // Ambil semua data PetugasUkur
router.get("/", async (req, res) => {
  try {
    const petugasUkur = await PetugasUkur.find();
    res.status(200).json(petugasUkur);
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan saat mengambil data petugas ukur", error });
  }
});

// Ambil data berdasarkan idPetugasUkur
router.get("/:idPetugasUkur", async (req, res) => {
  const { idPetugasUkur } = req.params;
  
  try {
    const petugasUkur = await PetugasUkur.findOne({ _id: idPetugasUkur });
    if (!petugasUkur) {
      return res.status(404).json({ message: "Petugas ukur tidak ditemukan" });
    }
    res.status(200).json(petugasUkur);
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan saat mengambil data petugas ukur", error });
  }
});

// Update data PetugasUkur
router.put("/:idPetugasUkur", async (req, res) => {
    const { idPetugasUkur } = req.params;
    const { NIK, nama } = req.body;
  
    try {
      const updatedPetugasUkur = await PetugasUkur.findOneAndUpdate(
        { _id: idPetugasUkur },
        {
          NIK,
          nama,
          dateUp: new Date(), // Update dateUp setiap kali dokumen diperbarui
        },
        { new: true } // Mengembalikan dokumen yang sudah diperbarui
      );
  
      if (!updatedPetugasUkur) {
        return res.status(404).json({ message: "Petugas ukur tidak ditemukan" });
      }
  
      res.status(200).json({ message: "Petugas ukur berhasil diperbarui", updatedPetugasUkur });
    } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan saat memperbarui petugas ukur", error });
    }
  });
  
  // Hapus PetugasUkur berdasarkan idPetugasUkur
router.delete("/:idPetugasUkur", async (req, res) => {
    const { idPetugasUkur } = req.params;
  
    try {
      const deletedPetugasUkur = await PetugasUkur.findOneAndDelete({ _id: idPetugasUkur });
      if (!deletedPetugasUkur) {
        return res.status(404).json({ message: "Petugas ukur tidak ditemukan" });
      }
  
      res.status(200).json({ message: "Petugas ukur berhasil dihapus", deletedPetugasUkur });
    } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan saat menghapus petugas ukur", error });
    }
  });
  
  module.exports = router;
