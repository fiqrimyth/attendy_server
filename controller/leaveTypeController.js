const LeaveType = require("../models/leaveType");
const ResponseWrapper = require("../utils/responseWrapper");

// Membuat tipe cuti baru
exports.createLeaveType = async (req, res) => {
  try {
    const newLeaveType = new LeaveType(req.body);
    const savedLeaveType = await newLeaveType.save();
    return ResponseWrapper.created(res, savedLeaveType);
  } catch (error) {
    return ResponseWrapper.internalServerError(
      res,
      "Gagal membuat tipe cuti baru"
    );
  }
};

// Mendapatkan semua tipe cuti
exports.getAllLeaveTypes = async (req, res) => {
  try {
    const leaveTypes = await LeaveType.find({ isActive: true });
    return ResponseWrapper.success(
      res,
      "Berhasil mendapatkan semua tipe cuti",
      leaveTypes
    );
  } catch (error) {
    return ResponseWrapper.internalServerError(
      res,
      "Gagal mendapatkan semua tipe cuti"
    );
  }
};

// Mendapatkan tipe cuti berdasarkan ID
exports.getLeaveTypeById = async (req, res) => {
  try {
    const leaveType = await LeaveType.findOne({ userId: req.params.userId });
    if (!leaveType) {
      return ResponseWrapper.notFound(res, "Tipe cuti tidak ditemukan");
    }
    return ResponseWrapper.success(
      res,
      "Berhasil mendapatkan tipe cuti",
      leaveType
    );
  } catch (error) {
    return ResponseWrapper.internalServerError(
      res,
      "Gagal mendapatkan tipe cuti"
    );
  }
};

// Mengupdate tipe cuti
exports.updateLeaveType = async (req, res) => {
  try {
    const updatedLeaveType = await LeaveType.findByIdAndUpdate(
      req.params.userId,
      req.body,
      { new: true }
    );
    if (!updatedLeaveType) {
      return ResponseWrapper.notFound(res, "Tipe cuti tidak ditemukan");
    }
    return ResponseWrapper.success(
      res,
      "Berhasil mengupdate tipe cuti",
      updatedLeaveType
    );
  } catch (error) {
    return ResponseWrapper.internalServerError(
      res,
      "Gagal mengupdate tipe cuti"
    );
  }
};

// Menghapus tipe cuti (soft delete)
exports.deleteLeaveType = async (req, res) => {
  try {
    const leaveType = await LeaveType.findByIdAndUpdate(
      req.params.userId,
      { isActive: false },
      { new: true }
    );
    if (!leaveType) {
      return ResponseWrapper.notFound(res, "Tipe cuti tidak ditemukan");
    }
    return ResponseWrapper.success(
      res,
      "Berhasil menghapus tipe cuti",
      leaveType
    );
  } catch (error) {
    return ResponseWrapper.internalServerError(
      res,
      "Gagal menghapus tipe cuti"
    );
  }
};

// Mendapatkan tipe cuti berdasarkan user ID
exports.getLeaveTypeByUserId = async (req, res) => {
  try {
    // Cek dulu apakah ada leave type untuk user ini
    const leaveTypes = await LeaveType.find({ userId: req.params.userId });

    // Jika belum ada data, buat data default
    if (!leaveTypes || leaveTypes.length === 0) {
      // Data default untuk tipe cuti
      const defaultLeaveTypes = [
        {
          userId: req.params.userId,
          name: "Sick Leave",
          daysAllowed: 1,
          description: "Cuti sakit",
          isActive: true,
        },
        {
          userId: req.params.userId,
          name: "Absent",
          daysAllowed: 1,
          description: "Absen",
          isActive: true,
        },
        {
          userId: req.params.userId,
          name: "Alpha",
          daysAllowed: 1,
          description: "Alpha",
          isActive: true,
        },
        {
          userId: req.params.userId,
          name: "Permission",
          daysAllowed: 0,
          description: "Izin",
          isActive: true,
        },
        {
          userId: req.params.userId,
          name: "Leave",
          daysAllowed: 12,
          description: "Cuti",
          isActive: true,
        },
        {
          userId: req.params.userId,
          name: "Overtime",
          daysAllowed: 2,
          description: "Lembur",
          isActive: true,
        },
      ];

      // Simpan data default
      const savedLeaveTypes = await LeaveType.insertMany(defaultLeaveTypes);
      return ResponseWrapper.success(
        res,
        "Berhasil membuat tipe cuti default",
        savedLeaveTypes
      );
    }

    return ResponseWrapper.success(
      res,
      "Berhasil mendapatkan tipe cuti",
      leaveTypes
    );
  } catch (error) {
    console.error("Error:", error);
    return ResponseWrapper.internalServerError(
      res,
      "Gagal mendapatkan tipe cuti"
    );
  }
};
