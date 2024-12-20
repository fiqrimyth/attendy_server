const Attendance = require("../models/Attendance");
const ResponseWrapper = require("../utils/responseWrapper");
const User = require("../models/User");

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
        status: "ON_TIME",
        dateClockIn: new Date(),
        photo,
      },
    });

    const savedAttendance = await attendance.save();
    return ResponseWrapper.created(res, savedAttendance);
  } catch (error) {
    return ResponseWrapper.internalServerError(res, "Gagal melakukan clock in");
  }
};

// Update absensi (clock out)
exports.clockOut = async (req, res) => {
  const { attendanceId } = req.params;
  const { location, photo } = req.body;

  try {
    const attendance = await Attendance.findById(attendanceId);
    if (!attendance) {
      return ResponseWrapper.notFound(res, "Data absensi tidak ditemukan");
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
    return ResponseWrapper.internalServerError(
      res,
      "Gagal melakukan clock out"
    );
  }
};

// Mendapatkan riwayat absensi berdasarkan userId
exports.getAttendanceHistory = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Validasi parameter userId
    if (userId === ":userId" || !userId) {
      return ResponseWrapper.badRequest(res, "UserId tidak valid");
    }

    // Cek apakah user exists
    const user = await User.findOne({ userId: userId });
    if (!user) {
      return ResponseWrapper.notFound(res, "User tidak ditemukan");
    }

    const query = { userId: user.userId };
    const { startDate, endDate, page = 1, limit = 10 } = req.query;

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const attendances = await Attendance.find(query)
      .populate("shiftId", "name startTime endTime")
      .sort({ date: -1 });

    // Kelompokkan data berdasarkan bulan
    const groupedAttendances = attendances.reduce((acc, attendance) => {
      const date = new Date(attendance.date);
      const monthYear = new Intl.DateTimeFormat("id-ID", {
        month: "long",
        year: "numeric",
      }).format(date);

      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }

      acc[monthYear].push({
        userId: attendance.userId,
        time: attendance.clockIn?.time || attendance.clockOut?.time,
        type: attendance.clockOut ? "Clock Out" : "Clock In",
        date: new Intl.DateTimeFormat("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }).format(date),
        status: attendance.clockIn?.status || attendance.clockOut?.status,
        shift: attendance.shiftId,
        location: attendance.clockIn?.location || attendance.clockOut?.location,
        photo: attendance.clockIn?.photo || attendance.clockOut?.photo,
      });

      return acc;
    }, {});

    // Konversi ke format yang diinginkan
    const formattedData = Object.entries(groupedAttendances).map(
      ([month, data]) => ({
        month,
        attendances: data,
      })
    );

    return ResponseWrapper.success(
      res,
      "Berhasil mengambil riwayat absensi",
      formattedData
    );
  } catch (error) {
    return ResponseWrapper.internalServerError(res, {
      message: "Gagal mengambil riwayat absensi",
      exception: error.message,
      detail: null,
      status: "500",
      datas: [],
    });
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
      return ResponseWrapper.notFound(res, "Data absensi tidak ditemukan");
    }

    return ResponseWrapper.success(
      res,
      "Berhasil mengambil detail absensi",
      attendance
    );
  } catch (error) {
    return ResponseWrapper.internalServerError(
      res,
      "Gagal mengambil detail absensi"
    );
  }
};
