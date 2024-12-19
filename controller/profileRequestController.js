const Profile = require("../models/profileRequest");
const ResponseWrapper = require("../utils/responseWrapper");
const User = require("../models/User");

// Membuat profile baru
exports.createProfile = async (req, res) => {
  try {
    const newProfile = new Profile(req.body);
    const savedProfile = await newProfile.save();
    return ResponseWrapper.created(
      res,
      "Profile berhasil dibuat",
      savedProfile
    );
  } catch (error) {
    return ResponseWrapper.badRequest(
      res,
      "Gagal membuat profile",
      error.message
    );
  }
};

// Mendapatkan semua profile
exports.getAllProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find();
    return ResponseWrapper.success(
      res,
      "Berhasil mendapatkan semua profile",
      profiles
    );
  } catch (error) {
    return ResponseWrapper.badRequest(
      res,
      "Gagal mendapatkan semua profile",
      error.message
    );
  }
};

// Mendapatkan profile berdasarkan ID
exports.getProfileById = async (req, res) => {
  try {
    // Cek profile yang sudah dimodifikasi
    let profile = await Profile.findOne({ userId: req.params.id });

    if (!profile) {
      // Jika tidak ada profile yang dimodifikasi, ambil data dari User
      const user = await User.findOne({ userId: req.params.id });
      if (!user) {
        return ResponseWrapper.notFound(res, "User tidak ditemukan");
      }

      // Kembalikan data user sebagai profile
      return ResponseWrapper.success(res, "Profile berhasil ditemukan", {
        userId: user.userId,
        fullName: user.fullName,
        jobType: user.jobType,
        photo: user.photo,
        shiftSchedule: user.shiftSchedule,
        email: user.email,
        phoneNumber: user.phoneNumber,
        identityNumber: user.identityNumber,
        employeeNumber: user.employeeNumber,
        address: user.address,
        subDistrict: user.subDistrict,
        district: user.district,
        city: user.city,
        isActive: user.isActive,
      });
    }

    // Jika ada profile yang sudah dimodifikasi, kembalikan itu
    return ResponseWrapper.success(res, "Profile berhasil ditemukan", profile);
  } catch (error) {
    return ResponseWrapper.error(
      res,
      "Gagal mendapatkan profile",
      error.message
    );
  }
};

// Mengupdate profile
exports.updateProfile = async (req, res) => {
  try {
    const updatedProfile = await Profile.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProfile) {
      return res.status(404).json({ message: "Profile tidak ditemukan" });
    }
    res.status(200).json(updatedProfile);
  } catch (error) {
    return ResponseWrapper.badRequest(
      res,
      "Gagal mengupdate profile",
      error.message
    );
  }
};

// Menghapus profile
exports.deleteProfile = async (req, res) => {
  try {
    const deletedProfile = await Profile.findByIdAndDelete(req.params.id);
    if (!deletedProfile) {
      return res.status(404).json({ message: "Profile tidak ditemukan" });
    }
    res.status(200).json({ message: "Profile berhasil dihapus" });
  } catch (error) {
    return ResponseWrapper.badRequest(
      res,
      "Gagal menghapus profile",
      error.message
    );
  }
};
