const jwt = require("jsonwebtoken");
const BlacklistedToken = require("../models/blacklistedToken");
const User = require("../models/User");
const ResponseWrapper = require("../utils/responseWrapper");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    // Tambahkan log untuk debugging
    console.log("Token received:", token);

    // Cek apakah token ada di blacklist
    const isBlacklisted = await BlacklistedToken.findOne({ token });
    if (isBlacklisted) {
      throw new Error("Token tidak valid");
    }

    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded); // Log decoded token

    // Ubah query untuk mencari user
    const user = await User.findOne({
      userId: decoded.userId, // Gunakan userId bukan _id
      isActive: true,
    });

    console.log("User found:", user); // Log user yang ditemukan

    if (!user) {
      throw new Error("User tidak ditemukan");
    }

    req.token = token;
    req.user = user;
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error("Auth error:", error); // Log error
    return ResponseWrapper.unauthorized(
      res,
      "Silakan login terlebih dahulu",
      error.message
    );
  }
};

module.exports = auth;
