const Berkas = require("../model/berkas"); // Sesuaikan path ke model Berkas

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

// Fungsi untuk mendapatkan berkas berdasarkan role
const getBerkasByRole = async (role) => {
  if (role === "Admin") {
    // Admin dapat melihat semua dokumen
    return await Berkas.find();
  } else {
    // Role lain hanya dapat melihat dokumen berdasarkan status terakhir
    const allowedStatuses = roleStatusAccess[role];
    if (!allowedStatuses) {
      throw new Error("Role tidak dikenali.");
    }

    const pipeline = [
      {
        $addFields: {
          lastStatus: {
            $arrayElemAt: ["$status", -1], // Ambil elemen terakhir dari array status
          },
        },
      },
      {
        $match: {
          "lastStatus.name": { $in: allowedStatuses }, // Periksa apakah lastStatus.name sesuai role
        },
      },
    ];

    return await Berkas.aggregate(pipeline);
  }
};

module.exports = { getBerkasByRole };
