const express = require("express");
const router = express.Router();
const PetugasSPS = require("../model/petugasSPS");

// CREATE
router.post("/", async (req, res) => {
  try {
    const { namaPetugas } = req.body;

    if (!namaPetugas) {
      return res.status(400).json({ error: "Nama petugas harus diisi." });
    }

    const newPetugas = new PetugasSPS({ namaPetugas });
    const savedPetugas = await newPetugas.save();
    res.status(201).json(savedPetugas);
  } catch (error) {
    console.error("Gagal membuat petugas SPS:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
});

// READ ALL
router.get("/", async (req, res) => {
  try {
    const petugasList = await PetugasSPS.find();
    res.status(200).json(petugasList);
  } catch (error) {
    console.error("Gagal mengambil data petugas SPS:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
});

// READ BY ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const petugas = await PetugasSPS.findById(id);

    if (!petugas) {
      return res.status(404).json({ error: "Petugas tidak ditemukan." });
    }

    res.status(200).json(petugas);
  } catch (error) {
    console.error("Gagal mengambil data petugas SPS:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { namaPetugas } = req.body;

    if (!namaPetugas) {
      return res.status(400).json({ error: "Nama petugas harus diisi." });
    }

    const updatedPetugas = await PetugasSPS.findByIdAndUpdate(
      id,
      { namaPetugas },
      { new: true }
    );

    if (!updatedPetugas) {
      return res.status(404).json({ error: "Petugas tidak ditemukan." });
    }

    res.status(200).json(updatedPetugas);
  } catch (error) {
    console.error("Gagal memperbarui petugas SPS:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPetugas = await PetugasSPS.findByIdAndDelete(id);

    if (!deletedPetugas) {
      return res.status(404).json({ error: "Petugas tidak ditemukan." });
    }

    res.status(200).json({ message: "Petugas berhasil dihapus." });
  } catch (error) {
    console.error("Gagal menghapus petugas SPS:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
});

module.exports = router;
