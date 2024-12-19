const Attendance = require("../models/Attendance");
const ResponseWrapper = require("../utils/responseWrapper");

// Membuat absensi baru (clock in)
exports.clockIn = async (req, res) => {
  const { userId, shiftId, location, photo } = req.body;

  try {
    const attendance = new Attendance({
      userId,
      shiftId,
      date: new Date(),
      clockIn: {
        time: new Date(),
        location: {
          type: "Point",
          coordinates: location,
        },
        status: "ON_TIME", // Logic untuk status bisa disesuaikan
        dateClockIn: new Date(),
        photo,
      },
    });

    const savedAttendance = await attendance.save();
    return ResponseWrapper.success(
      res,
      "Berhasil melakukan clock in",
      savedAttendance
    );
  } catch (error) {
    return ResponseWrapper.error(res, "Gagal melakukan clock in");
  }
};

// Update absensi (clock out)
exports.clockOut = async (req, res) => {
  const { attendanceId } = req.params;
  const { location, photo } = req.body;

  try {
    const attendance = await Attendance.findById(attendanceId);
    if (!attendance) {
      return ResponseWrapper.error(res, "Data absensi tidak ditemukan");
    }

    attendance.clockOut = {
      time: new Date(),
      location: {
        type: "Point",
        coordinates: location,
      },
      status: "ON_TIME", // Logic untuk status bisa disesuaikan
      dateClockOut: new Date(),
      photo,
    };

    const updatedAttendance = await attendance.save();
    return ResponseWrapper.success(
      res,
      "Berhasil melakukan clock out",
      updatedAttendance
    );
  } catch (error) {
    return ResponseWrapper.error(res, "Gagal melakukan clock out");
  }
};

// Mendapatkan riwayat absensi berdasarkan userId
exports.getAttendanceHistory = async (req, res) => {
  const { userId } = req.params;
  const { startDate, endDate } = req.query;

  try {
    const query = { userId };
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const attendances = await Attendance.find(query)
      .populate("shiftId")
      .sort({ date: -1 });

    return ResponseWrapper.success(
      res,
      "Berhasil mengambil riwayat absensi",
      attendances
    );
  } catch (error) {
    return ResponseWrapper.error(res, "Gagal mengambil riwayat absensi");
  }
};

// Mendapatkan detail absensi
exports.getAttendanceDetail = async (req, res) => {
  const { attendanceId } = req.params;

  try {
    const attendance = await Attendance.findById(attendanceId).populate(
      "shiftId"
    );

    if (!attendance) {
      return ResponseWrapper.error(res, "Data absensi tidak ditemukan");
    }

    return ResponseWrapper.success(
      res,
      "Berhasil mengambil detail absensi",
      attendance
    );
  } catch (error) {
    return ResponseWrapper.error(res, "Gagal mengambil detail absensi");
  }
};
