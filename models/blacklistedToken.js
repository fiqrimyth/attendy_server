const mongoose = require("mongoose");

const blacklistedTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  deviceId: {
    type: String,
    required: true,
  },
  blacklistedAt: {
    type: Date,
    default: Date.now,
    expires: "7d", // Token akan otomatis dihapus setelah 7 hari
  },
});

module.exports = mongoose.model("BlacklistedToken", blacklistedTokenSchema);
