const Berkas = require("../model/berkas"); // Sesuaikan path ke model Berkas
const Role = require("../model/roles"); // Model untuk mengambil data role

// Fungsi untuk mendapatkan berkas berdasarkan role
const getBerkasByRole = async (role) => {
  // Mendapatkan akses status untuk role
  const roleData = await Role.findOne({ nama: role });
  if (!roleData) {
    throw new Error("Role tidak dikenali.");
  }

  const allowedStatuses = roleData.accessStatus;  // ambil accessStatus dari role
  const allowedValues = allowedStatuses.map(status => status.nama); 
  if (!allowedStatuses || allowedStatuses.length === 0) {
    throw new Error("Role tidak memiliki akses status yang valid.");
  }

  // Agregasi untuk mengambil berkas berdasarkan role dan status terakhir
  const pipeline = [
    {
      $addFields: {
        lastStatus: {
          $arrayElemAt: ["$status", -1], // Ambil status terakhir dari array status
        },
      },
    },
    {
      $match: {
        "lastStatus.name": { $in: allowedValues }, // Filter berdasarkan status yang sesuai dengan role
      },
    },
  ];

  // Menjalankan agregasi pada koleksi Berkas
  return await Berkas.aggregate(pipeline);
};

module.exports = { getBerkasByRole };
