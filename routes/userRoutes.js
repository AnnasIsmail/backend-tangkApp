const router = require("express").Router();
const users = require("../model/users");
const momentTimeZone = require("moment-timezone");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../function/verifyToken");
const Token = require("../model/token");

const SECRET_KEY = process.env.SECRET_KEY || "TangkApp"; // Simpan di environment variable
const SECRET_CODE = process.env.SECRET_CODE || "TangkApp_password"; // Simpan di environment variable

// **POST /login** - Login pengguna
router.post("/login", async (req, res) => {
  const { NIK, password } = req.body;

  if (!NIK || !password) {
    return res.status(400).json({ error: "NIK dan password wajib diisi." });
  }

  try {
    // Cari pengguna berdasarkan NIK
    const user = await users.findOne({ NIK });
    
    if (!user) {
      return res.status(404).json({ error: "User tidak ditemukan." });
    }

    // Gabungkan password dengan secret code
    const combinedPassword = password + SECRET_CODE;

    // Periksa validitas password
    const isPasswordValid = await bcrypt.compare(combinedPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Password salah." });
    }

    // Buat token JWT
    const token = jwt.sign(
      {
        _id: user._id, // Gunakan _id sebagai payload
        role: user.role,
      },
      SECRET_KEY,
      { expiresIn: "12h" } // Kedaluwarsa dalam 12 jam
    );

    // Simpan token ke database
    const expiresAt = new Date(Date.now() + 12 * 3600 * 1000); // 12 jam dari sekarang
    const newToken = new Token({
      token,
      userId: user._id,
      expiresAt,
    });
    await newToken.save();

    res.status(200).json({
      message: "Login berhasil.",
      token,
      user: {
        _id: user._id,
        nama: user.nama,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// **GET /check-token** - Validasi token
router.get("/check-token", async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token tidak ditemukan" });
  }

  try {
    // Verifikasi token
    const decoded = jwt.verify(token, SECRET_KEY);
    const tokenRecord = await Token.findOne({ token });

    if (!tokenRecord) {
      return res.status(403).json({ error: "Token tidak valid atau telah dicabut." });
    }

    if (new Date() > tokenRecord.expiresAt) {
      return res.status(403).json({ error: "Token telah kedaluwarsa." });
    }

    const user = await users.findById(decoded._id).select("_id nama role NIK");
    if (!user) {
      return res.status(404).json({ error: "User tidak ditemukan." });
    }
    
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: "Kesalahan server saat memverifikasi token." });
  }
});

// **GET /protected** - Endpoint yang memerlukan token valid
router.get("/protected", verifyToken, (req, res) => {
  res.status(200).json({ message: "Anda memiliki akses ke endpoint ini.", user: req.user });
});

// **POST /logout** - Logout pengguna
router.post("/logout", async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(400).json({ error: "Token tidak ditemukan." });
  }

  try {
    // Hapus token dari database
    await Token.findOneAndDelete({ token });
    res.status(200).json({ message: "Logout berhasil. Token telah dihapus." });
  } catch (error) {
    res.status(500).json({ error: "Kesalahan server saat menghapus token." });
  }
});

module.exports = router;
