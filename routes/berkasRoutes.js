const express = require("express");
const router = express.Router();
const momentTimeZone = require('moment-timezone');
const { verifyToken } = require("../function/verifyToken");
const Berkas = require("../model/berkas");
const Desa = require("../model/desa");
const Kegiatan = require("../model/kegiatan");
const Pemohon = require("../model/pemohon");
const JenisHak = require("../model/jenisHak");
const PetugasUkur = require("../model/petugasUkur");
const PetugasSPS = require("../model/petugasSPS");
const Status = require('../model/status');
const { getBerkasByRole } = require("../function/queryByRole");
const status = require("../model/status");

const dbFormatDate = "DD MMMM YYYY";
const dbFormatDateTime = "YYYY-MM-DDTHH:mm:ss";
const userFormat = "dddd DD MMMM YYYY HH:mm:ss";

const SECRET_KEY = "TangkApp"; 

// Endpoint untuk menyimpan data berkas
router.post("/insert", async (req, res) => {
  try {
    let {
      idBerkas,
      noBerkas,
      tahunBerkas,
      tanggalTerima,
      idKegiatan,
      namaSubsek,
      namaKegiatan,
      idPemohon,
      namaPemohon,
      idJenisHak,
      JenisHak,
      noHak,
      idDesa,
      namaDesa,
      namaKecamatan,
      idPetugasUkur,
      namaPetugasUkur,
      idPetugasSPS,
      namaPetugasSPS,
      tanggalSPS,
      statusAlihMedia,
      statusBayarPNBP,
      idUser,
      PIC,
      pemohonBaru
    } = req.body;

    const existingBerkas = await Berkas.findOne({ idBerkas });
    if (existingBerkas) {
      return res.status(400).json({ error: "Nomor Berkas sudah didaftarkan sebelumnya." });
    }

    // Validasi jumlah PIC
    if (PIC && PIC.length > 2) {
      return res.status(400).json({ error: "Maksimal 2 PIC diperbolehkan." });
    }

    if (pemohonBaru) {
      const newPemohon = new Pemohon({
        namaPemohon,
        dateIn: new Date().toISOString(),
      });
    
      const savedPemohon = await newPemohon.save();
      idPemohon = savedPemohon._id.toString(); // Update idPemohon
    }

    const statusAwal = await status.findOne({indexStatus: 0});
    // Buat instance baru
    const newBerkas = new Berkas({
      idBerkas,
      noBerkas,
      tahunBerkas,
      tanggalTerima,
      idKegiatan,
      namaSubsek,
      namaKegiatan,
      idPemohon,
      namaPemohon,
      idJenisHak,
      JenisHak,
      noHak,
      idDesa,
      namaDesa,
      namaKecamatan,
      idPetugasUkur,
      namaPetugasUkur,
      idPetugasSPS,
      namaPetugasSPS,
      tanggalSPS,
      statusAlihMedia,
      statusBayarPNBP,
      idUser,
      PIC: PIC || [],
      status: [
      {
        name: statusAwal.nama,
        subStatus: "Berjalan",
        dateIn: new Date().toISOString(),
        userIn: idUser,
        statusDetail: [
          {
            nama: "Berjalan",
            dateIn: new Date().toISOString(),
            userIn: idUser
          }
        ],
      }
    ],
      dateIn: new Date().toISOString(),
      dateUp: null,
    });

    // Simpan ke database
    const savedBerkas = await newBerkas.save();
    res.status(200).json({
      message: "Berkas berhasil ditambahkan.",
      data: savedBerkas,
    });
  } catch (error) {
    console.error("Gagal menyimpan data berkas:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
});

router.put("/update/:idBerkas", async (req, res) => {
  try {
    const { idBerkas } = req.params;
    const {
      noBerkas,
      tahunBerkas,
      tanggalTerima,
      idKegiatan,
      namaSubsek,
      namaKegiatan,
      idPemohon,
      namaPemohon,
      idJenisHak,
      JenisHak,
      noHak,
      idDesa,
      namaDesa,
      namaKecamatan,
      idPetugasUkur,
      namaPetugasUkur,
      idPetugasSPS,
      namaPetugasSPS,
      tanggalSPS,
      statusAlihMedia,
      statusBayarPNBP,
      PIC,
      dateUp,
    } = req.body;

    // Validasi keberadaan data
    const existingBerkas = await Berkas.findOne({ idBerkas });
    if (!existingBerkas) {
      return res.status(404).json({ error: "Data berkas tidak ditemukan." });
    }

    // Validasi jumlah PIC
    if (PIC && PIC.length > 2) {
      return res.status(400).json({ error: "Maksimal 2 PIC diperbolehkan." });
    }

    // Perbarui data berkas
    existingBerkas.noBerkas = noBerkas || existingBerkas.noBerkas;
    existingBerkas.tahunBerkas = tahunBerkas || existingBerkas.tahunBerkas;
    existingBerkas.tanggalTerima = tanggalTerima || existingBerkas.tanggalTerima;
    existingBerkas.idKegiatan = idKegiatan || existingBerkas.idKegiatan;
    existingBerkas.namaSubsek = namaSubsek || existingBerkas.namaSubsek;
    existingBerkas.namaKegiatan = namaKegiatan || existingBerkas.namaKegiatan;
    existingBerkas.idPemohon = idPemohon || existingBerkas.idPemohon;
    existingBerkas.namaPemohon = namaPemohon || existingBerkas.namaPemohon;
    existingBerkas.idJenisHak = idJenisHak || existingBerkas.idJenisHak;
    existingBerkas.JenisHak = JenisHak || existingBerkas.JenisHak;
    existingBerkas.noHak = noHak || existingBerkas.noHak;
    existingBerkas.idDesa = idDesa || existingBerkas.idDesa;
    existingBerkas.namaDesa = namaDesa || existingBerkas.namaDesa;
    existingBerkas.namaKecamatan = namaKecamatan || existingBerkas.namaKecamatan;
    existingBerkas.idPetugasSPS = namaPetugasSPS || existingBerkas.idPetugasSPS;
    existingBerkas.namaPetugasSPS = namaPetugasSPS || existingBerkas.namaPetugasSPS;
    existingBerkas.tanggalSPS = tanggalSPS || existingBerkas.tanggalSPS;
    existingBerkas.idPetugasUkur = idPetugasUkur || existingBerkas.idPetugasUkur;
    existingBerkas.namaPetugasUkur = namaPetugasUkur || existingBerkas.namaPetugasUkur;
    existingBerkas.statusAlihMedia =
      typeof statusAlihMedia === "boolean" ? statusAlihMedia : existingBerkas.statusAlihMedia;
    existingBerkas.statusBayarPNBP =
      typeof statusBayarPNBP === "boolean" ? statusBayarPNBP : existingBerkas.statusBayarPNBP;
    existingBerkas.PIC = PIC || existingBerkas.PIC;
    existingBerkas.dateUp = dateUp || new Date().toISOString();

    // Simpan data yang diperbarui
    const updatedBerkas = await existingBerkas.save();

    res.status(200).json({
      message: "Berkas berhasil diperbarui.",
      data: updatedBerkas,
    });
  } catch (error) {
    console.error("Gagal memperbarui data berkas:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
});


router.get("/desa", async (req, res) => {
  try {
    const desaList = await Desa.find();
    res.status(200).json(desaList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/kegiatan", async (req, res) => {
  try {
    const kegiatanList = await Kegiatan.find();
    res.status(200).json(kegiatanList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/pemohon", async (req, res) => {
  try {
    const pemohonList = await Pemohon.find();
    res.status(200).json(pemohonList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/jenisHak", async (req, res) => {
  try {
    const jenisHakList = await JenisHak.find();
    res.status(200).json(jenisHakList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/petugasUkur", async (req, res) => {
  try {
    const petugasUkurList = await PetugasUkur.find();
    res.status(200).json(petugasUkurList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/petugasSPS", async (req, res) => {
  try {
    const PetugasSPSList = await PetugasSPS.find();
    res.status(200).json(PetugasSPSList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const role = req.body.role; // Role dari body

  try {
    // Verifikasi token
    const user = await verifyToken(token);

    // Periksa apakah role user valid
    if (!user.role.includes(role)) {
      return res.status(403).json({ message: "Anda tidak memiliki akses role tersebut" });
    }

    // Dapatkan data berkas sesuai role
    const data = await getBerkasByRole(role);

    // Kirim data ke frontend
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/detail/:_id', async (req, res) => {
  const { _id } = req.params;
  try {
      const berkas = await Berkas.findById(_id);
      if (!berkas) {
          return res.status(404).json({ message: 'Berkas tidak ditemukan.' });
      }
      res.json(berkas);
  } catch (error) {
      res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data.', error });
  }
});

router.post("/filter", async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const { role, tanggalTerimaStart, tanggalTerimaEnd, kegiatan, jenisHak, desa, petugasUkur } =
    req.body;

  try {
    const user = await verifyToken(token);

    // Validasi Role
    if (!user.role.includes(role)) {
      return res.status(403).json({ message: "Anda tidak memiliki akses role tersebut" });
    }

    let pipeline = [];

    // Role Admin (akses semua data)
    if (role === "Admin") {
      pipeline.push({ $match: {} });
    } else {
      const allowedStatuses = roleStatusAccess[role];
      if (!allowedStatuses) {
        return res.status(403).json({ message: "Role tidak dikenali." });
      }

      pipeline.push(
        {
          $addFields: {
            lastStatus: {
              $arrayElemAt: ["$status", -1],
            },
          },
        },
        {
          $match: {
            "lastStatus.name": { $in: allowedStatuses },
          },
        }
      );
    }

    // Tambahkan $addFields untuk konversi `tanggalTerima` ke tipe Date
    pipeline.push({
      $addFields: {
        tanggalTerimaDate: { $toDate: "$tanggalTerima" },
      },
    });

    // Filter berdasarkan parameter
    const filters = {};

    if (tanggalTerimaStart || tanggalTerimaEnd) {
      filters.tanggalTerimaDate = {};
      if (tanggalTerimaStart) filters.tanggalTerimaDate.$gte = new Date(tanggalTerimaStart);
      if (tanggalTerimaEnd) filters.tanggalTerimaDate.$lte = new Date(tanggalTerimaEnd);
    }

    if (kegiatan) filters.idKegiatan = kegiatan;
    if (jenisHak) filters.idJenisHak = jenisHak;
    if (desa) filters.idDesa = desa;
    if (petugasUkur) filters.idPetugasUkur = petugasUkur;

    if (Object.keys(filters).length > 0) {
      pipeline.push({ $match: filters });
    }

    // Debug pipeline
    console.log("Pipeline Debug:", JSON.stringify(pipeline, null, 2));

    const data = await Berkas.aggregate(pipeline);

    // Debug hasil data
    console.log("Data Ditemukan:", JSON.stringify(data, null, 2));

    res.status(200).json({ data });
  } catch (error) {
    console.error("Error fetching filtered data:", error);
    res.status(500).json({ message: "Gagal memfilter data.", error: error.message });
  }
});

// Contoh di Express.js
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Langsung berikan id ke findByIdAndDelete
    const deletedBerkas = await Berkas.findByIdAndDelete(id);

    if (!deletedBerkas) {
      // Jika tidak ditemukan, kirim respons 404
      return res.status(404).json({ message: "Berkas tidak ditemukan." });
    }

    res.status(200).json({ message: "Berkas berhasil dihapus." });
  } catch (error) {
    console.error("Error saat menghapus berkas:", error);
    res.status(500).json({ message: "Terjadi kesalahan saat menghapus berkas." });
  }
});


router.post('/updateStatus/:id/selesai', async (req, res) => {
  const { id } = req.params;
  const { userIn, NIK, namaUser, notes, role, idPetugasUkur, namaPetugasUkur, statusBayarPNBP } = req.body;

  try {
    const berkas = await Berkas.findById(id);
    if (!berkas) {
      return res.status(404).json({ message: "Berkas tidak ditemukan" });
    }

    // Ambil status terakhir
    const currentStatus = berkas.status[berkas.status.length - 1];
    // if (!currentStatus || currentStatus.subStatus !== "Berjalan") {
    //   return res.status(400).json({ message: "Tidak ada status aktif yang berjalan!" });
    // }

    // Tambahkan substatus "Selesai"
    currentStatus.statusDetail.push({
        nama: 'Selesai',
        dateIn: new Date(),
        dateUp: "",
        userIn, NIK, namaUser, notes
    });
    currentStatus.subStatus = "Selesai";

    // Cari status berikutnya dari koleksi Status
    const currentIndex = await Status.findOne({ nama: currentStatus.name });
    if (!currentIndex) {
      return res.status(400).json({ message: "Status tidak valid di koleksi Status!" });
    }

    const nextStatus = await Status.findOne({ indexStatus: currentIndex.indexStatus + 1 });

    // Tambahkan status baru jika ada status berikutnya
    if (nextStatus) {
      berkas.status.push({
        name: nextStatus.nama,
        subStatus: "Berjalan",
        dateIn: new Date(),
        statusDetail: [
          {
            nama: "Berjalan",
            dateIn: new Date(),
          },
        ],
      });
    }

    if(role === "PelaksanaSPJ"){
      berkas.idPetugasUkur = idPetugasUkur;
      berkas.namaPetugasUkur = namaPetugasUkur;
      berkas.statusBayarPNBP =
      typeof statusBayarPNBP === "boolean" ? statusBayarPNBP : berkas.statusBayarPNBP;
    }

    await berkas.save();
    res.status(200).json({ message: "Status berhasil diperbarui ke 'Selesai'!", berkas });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server", error });
  }
});

router.post('/updateStatus/:id/terhenti', async (req, res) => {
  const { id } = req.params;
  const { deskripsiKendala } = req.body;

  if (!deskripsiKendala) {
    return res.status(400).json({ message: "Deskripsi kendala harus diisi!" });
  }

  try {
    const berkas = await Berkas.findById(id);
    if (!berkas) {
      return res.status(404).json({ message: "Berkas tidak ditemukan" });
    }

    // Ambil status terakhir
    const currentStatus = berkas.status[berkas.status.length - 1];
    // if (!currentStatus || currentStatus.subStatus !== "Berjalan") {
    //   return res.status(400).json({ message: "Tidak ada status aktif yang berjalan!" });
    // }

    // Tambahkan substatus "Terhenti" dengan kendala
    currentStatus.statusDetail.push({
      nama: "Terhenti",
      dateIn: new Date(),
      deskripsiKendala,
    });
    currentStatus.subStatus = "Terhenti";

    await berkas.save();
    res.status(200).json({ message: "Status berhasil diperbarui ke 'Terhenti'!", berkas });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server", error });
  }
});


module.exports = router;
