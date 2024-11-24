const express = require("express");
const router = express.Router();
const Role = require("../model/roles");

// Endpoint untuk mendapatkan semua roles
router.get("/", async (req, res) => {
  try {
    const roles = await Role.find(); // Ambil semua roles dari database
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ error: "Gagal mendapatkan roles", details: error.message });
  }
});

// Endpoint untuk mendapatkan role berdasarkan ID
router.get("/:id", async (req, res) => {
  try {
    const role = await Role.findById(req.params.id); // Cari role berdasarkan ID
    if (!role) return res.status(404).json({ error: "Role tidak ditemukan" });

    res.status(200).json(role);
  } catch (error) {
    res.status(500).json({ error: "Gagal mendapatkan role", details: error.message });
  }
});

// Endpoint untuk membuat role baru
router.post("/", async (req, res) => {
  try {
    const { nama, accessStatus } = req.body; // Ambil data dari request body
    const newRole = new Role({ nama, accessStatus }); // Buat dokumen baru
    await newRole.save(); // Simpan ke database

    res.status(201).json(newRole);
  } catch (error) {
    res.status(500).json({ error: "Gagal membuat role", details: error.message });
  }
});

// Endpoint untuk memperbarui role berdasarkan ID
router.put("/:id", async (req, res) => {
  try {
    const { nama, accessStatus } = req.body; // Ambil data dari request body
    const updatedRole = await Role.findByIdAndUpdate(
      req.params.id,
      { nama, accessStatus },
      { new: true, runValidators: true } // Kembalikan dokumen yang diperbarui
    );

    if (!updatedRole) return res.status(404).json({ error: "Role tidak ditemukan" });

    res.status(200).json(updatedRole);
  } catch (error) {
    res.status(500).json({ error: "Gagal memperbarui role", details: error.message });
  }
});

// Endpoint untuk menghapus role berdasarkan ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedRole = await Role.findByIdAndDelete(req.params.id); // Hapus role berdasarkan ID
    if (!deletedRole) return res.status(404).json({ error: "Role tidak ditemukan" });

    res.status(200).json({ message: "Role berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ error: "Gagal menghapus role", details: error.message });
  }
});

module.exports = router;
