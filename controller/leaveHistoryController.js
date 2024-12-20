const LeaveHistory = require("../models/leaveHistory");
const ResponseWrapper = require("../utils/responseWrapper");

// Fungsi untuk mendapatkan history cuti
exports.getLeaveHistory = async (req, res) => {
  try {
    const leaves = await LeaveHistory.find({
      employeeId: req.params.userId,
      leaveCategory: "ANNUAL",
    })
      .sort({ createdAt: -1 })
      .select({
        startDate: 1,
        endDate: 1,
        status: 1,
        leaveReason: 1,
        attachmentFile: 1,
      });

    const formattedLeaves = leaves.map((leave) => {
      return {
        id: leave.id,
        startDate: leave.startDate,
        endDate: leave.endDate,
        status: leave.status,
        leaveReason: leave.leaveReason,
        attachmentFile: leave.attachmentFile,
      };
    });

    return ResponseWrapper.success(
      res,
      "Berhasil mengambil riwayat cuti",
      formattedLeaves
    );
  } catch (error) {
    return ResponseWrapper.internalServerError(
      res,
      "Gagal mengambil riwayat cuti"
    );
  }
};

exports.getPermissionHistory = async (req, res) => {
  try {
    const permissions = await LeaveHistory.find({
      employeeId: req.params.userId,
      leaveCategory: { $in: ["SICK", "OTHER"] },
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
      return {
        id: permission.id,
        leaveDate: permission.leaveDate,
        leaveCategory: permission.leaveCategory,
        status: permission.status,
        leaveReason: permission.leaveReason,
        attachmentFile: permission.attachmentFile,
      };
    });

    return ResponseWrapper.success(
      res,
      "Berhasil mengambil riwayat izin",
      formattedPermissions
    );
  } catch (error) {
    return ResponseWrapper.internalServerError(
      res,
      "Gagal mengambil riwayat izin"
    );
  }
};

exports.getOvertimeHistory = async (req, res) => {
  try {
    const overtimes = await LeaveHistory.find({
      employeeId: req.params.userId,
      overtimeDate: { $exists: true },
    })
      .sort({ createdAt: -1 })
      .select({
        overtimeDate: 1,
        startTime: 1,
        endTime: 1,
        status: 1,
        overtimeReason: 1,
        attachmentFile: 1,
      });

    const formattedOvertimes = overtimes.map((overtime) => {
      return {
        id: overtime.id,
        overtimeDate: overtime.overtimeDate,
        startTime: overtime.startTime,
        endTime: overtime.endTime,
        status: overtime.status,
        overtimeReason: overtime.overtimeReason,
        attachmentFile: overtime.attachmentFile,
      };
    });

    return ResponseWrapper.success(
      res,
      "Berhasil mengambil riwayat lembur",
      formattedOvertimes
    );
  } catch (error) {
    return ResponseWrapper.internalServerError(
      res,
      "Gagal mengambil riwayat lembur"
    );
  }
};
