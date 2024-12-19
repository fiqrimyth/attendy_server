const mongoose = require("mongoose");

const passwordResetSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email wajib diisi"],
    lowercase: true,
    trim: true,
  },
  token: {
    type: String,
    required: [true, "Token wajib diisi"],
    unique: true,
  },
  isUsed: {
    type: Boolean,
    default: false,
  },
  expiresAt: {
    type: Date,
    required: true,
    default: function () {
      // Token berlaku selama 1 jam
      return new Date(Date.now() + 3600000);
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index untuk token yang kedaluwarsa
passwordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Method untuk mengecek apakah token masih valid
passwordResetSchema.methods.isValid = function () {
  return !this.isUsed && this.expiresAt > Date.now();
};

const PasswordReset = mongoose.model("PasswordReset", passwordResetSchema);

module.exports = PasswordReset;
