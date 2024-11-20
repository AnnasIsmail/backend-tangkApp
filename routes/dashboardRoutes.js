const Berkas = require("../model/berkas"); // Sesuaikan path ke model Berkas
const router = require("express").Router();
const users = require("../model/users");
const momentTimeZone = require("moment-timezone");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../function/verifyToken");
const Token = require("../model/token");

const SECRET_KEY = process.env.SECRET_KEY || "TangkApp"; // Simpan di environment variable
const SECRET_CODE = process.env.SECRET_CODE || "TangkApp_password"; 

// Daftar status yang diizinkan untuk setiap role
const roleStatusAccess = {
  Admin: [],
  PelaksanaEntri: ["Proses SPJ"],
  PelaksanaSPJ: ["Proses SPJ"],
  PelaksanaInventaris: ["Inventaris dan Distribusi", "Ukur Gambar", "Inventaris Berkas"],
  PelaksanaKoordinator: ["Periksa Hasil PU", "QC Pemeriksa Koordinator"],
  PelaksanaPemetaan: ["QC Bidang/Integrasi"],
  PelaksanaPencetakan: ["Pencetakan/Validasi Sitata"],
  Korsub: ["Approval SPJ Korsub", "Paraf Produk Berkas"],
  Kasi: ["Approval SPJ Kasi", "TTD Produk Berkas", "Penyelesaian 307"],
};

router.post("/", async (req, res) => {
    try {
        const { role } = req.body;
    
        // Validasi role
        if (!role || !roleStatusAccess[role]) {
          return res.status(400).json({
            success: false,
            message: "Role tidak valid atau tidak ditemukan.",
          });
        }
    
        // Daftar status yang bisa diakses oleh role
        const accessibleStatuses = roleStatusAccess[role];
        if (accessibleStatuses.length === 0) {
          return res.status(200).json({
            success: true,
            data: {
              berjalan: 0,
              selesai: 0,
              terhenti: 0,
            },
          });
        }
    
        // Query MongoDB menggunakan model
        const results = await Berkas.aggregate([
          { $match: { "status.name": { $in: accessibleStatuses } } },
          { $unwind: "$status" },
          { $match: { "status.name": { $in: accessibleStatuses } } },
          {
            $group: {
              _id: "$status.subStatus",
              count: { $sum: 1 },
            },
          },
          {
            $project: {
              _id: 0,
              status: "$_id",
              count: 1,
            },
          },
        ]);
    
        // Format hasil menjadi objek dengan status "Berjalan", "Selesai", dan "Terhenti"
        const formattedResult = {
          berjalan: results.find((item) => item.status === "Berjalan")?.count || 0,
          selesai: results.find((item) => item.status === "Selesai")?.count || 0,
          terhenti: results.find((item) => item.status === "Terhenti")?.count || 0,
        };
    
        res.status(200).json({
          success: true,
          data: formattedResult,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({
          success: false,
          message: "Terjadi kesalahan pada server.",
        });
      }
  });

module.exports = router;