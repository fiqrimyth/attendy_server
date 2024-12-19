const BlacklistedToken = require("../models/blacklistedToken");
const ResponseWrapper = require("../utils/responseWrapper");

exports.addToBlacklist = async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    // Cek apakah token sudah ada di blacklist
    const existingToken = await BlacklistedToken.findOne({ token });
    if (existingToken) {
      return ResponseWrapper.badRequest(res, "Token sudah ada di blacklist");
    }

    // Simpan token ke blacklist
    const blacklistedToken = new BlacklistedToken({ token });
    await blacklistedToken.save();

    return ResponseWrapper.created(
      res,
      "Token berhasil ditambahkan ke blacklist",
      { token }
    );
  } catch (error) {
    return ResponseWrapper.serverError(
      res,
      "Gagal menambahkan token ke blacklist",
      error.message
    );
  }
};
