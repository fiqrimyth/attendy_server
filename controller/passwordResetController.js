const User = require("../models/User");
const bcrypt = require("bcryptjs");
const ResponseWrapper = require("../utils/responseWrapper");

exports.resetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("Attempting to reset password for:", email);

    // Cari user
    const user = await User.findOne({ email });
    if (!user) {
      return ResponseWrapper.badRequest(res, "User tidak ditemukan");
    }

    console.log("User found:", user.email);

    // Set password baru
    const newPassword = "Password@123"; // Password default
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedPassword;
    await user.save();

    console.log("Password reset successful for:", email);

    return ResponseWrapper.success(res, "Password berhasil direset", {
      email: user.email,
      message: "Password telah direset ke default: Password@123",
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    return ResponseWrapper.badRequest(
      res,
      "Gagal reset password",
      error.message
    );
  }
};
