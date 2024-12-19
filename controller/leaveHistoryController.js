const { Leave } = require("../models/leaveHistory");
const ResponseWrapper = require("../utils/responseWrapper");

// Fungsi untuk mendapatkan history cuti
exports.getLeaveHistory = async (req, res) => {
  try {
    const leaves = await Leave.find({
      employeeId: req.params.employeeId,
      leaveCategory: "ANNUAL",
    })
      .sort({ createdAt: -1 }) // Urutkan dari yang terbaru
      .select({
        startDate: 1,
        endDate: 1,
        status: 1,
        leaveReason: 1,
      });

    // Hitung durasi cuti dalam hari
    const formattedLeaves = leaves.map((leave) => {
      const start = new Date(leave.startDate);
      const end = new Date(leave.endDate);
      const durationInDays =
        Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

      return {
        id: leave._id,
        date: start.toLocaleDateString(), // Format: 22 April 2024
        type: "Cuti Tahunan",
        duration: `${durationInDays} Hari`,
        status: leave.status,
        reason: leave.leaveReason,
      };
    });

    res.json(formattedLeaves);
  } catch (error) {
    return ResponseWrapper.error(res, "Gagal mengambil riwayat cuti");
  }
};

// Fungsi untuk mendapatkan history izin
exports.getPermissionHistory = async (req, res) => {
  try {
    const permissions = await Leave.find({
      employeeId: req.params.employeeId,
      leaveCategory: { $in: ["SICK", "OTHER"] }, // Mengambil izin sakit dan lainnya
    })
      .sort({ createdAt: -1 })
      .select({
        leaveDate: 1,
        leaveCategory: 1,
        status: 1,
        leaveReason: 1,
        attachmentFile: 1,
      });

    const formattedPermissions = permissions.map((permission) => {
      const date = new Date(permission.leaveDate);
      return {
        id: permission._id,
        date: date.toLocaleDateString(),
        type:
          permission.leaveCategory === "SICK" ? "Izin Sakit" : "Izin Lainnya",
        duration: "1 Hari",
        status: permission.status,
        reason: permission.leaveReason,
        attachment: permission.attachmentFile,
      };
    });

    res.json(formattedPermissions);
  } catch (error) {
    return ResponseWrapper.error(res, "Gagal mengambil riwayat izin");
  }
};

// Fungsi untuk mendapatkan history lembur
exports.getOvertimeHistory = async (req, res) => {
  try {
    const overtimes = await Leave.find({
      employeeId: req.params.employeeId,
      overtimeDate: { $exists: true }, // Memastikan ini adalah data lembur
    })
      .sort({ createdAt: -1 })
      .select({
        overtimeDate: 1,
        startTime: 1,
        endTime: 1,
        status: 1,
        overtimeReason: 1,
      });

    const formattedOvertimes = overtimes.map((overtime) => {
      const date = new Date(overtime.overtimeDate);
      return {
        id: overtime._id,
        date: date.toLocaleDateString(),
        type: "Lembur",
        duration: `${overtime.startTime} - ${overtime.endTime}`,
        status: overtime.status,
        reason: overtime.overtimeReason,
      };
    });

    res.json(formattedOvertimes);
  } catch (error) {
    return ResponseWrapper.error(res, "Gagal mengambil riwayat lembur");
  }
};
