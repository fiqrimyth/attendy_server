const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Attendance = require("../models/Attendance");
const ResponseWrapper = require("../utils/responseWrapper");
const { getResetPasswordTemplate } = require("../utils/emailTemplates");
const sendEmail = require("../utils/sendEmail");

const shifts = [
  {
    id: 1,
    name: "Shift Pagi",
    startTime: "06:00",
    endTime: "15:00",
  },
  {
    id: 2,
    name: "Shift Siang",
    startTime: "13:00",
    endTime: "22:00",
  },
  {
    id: 3,
    name: "Shift Reguler",
    startTime: "08:00",
    endTime: "17:00",
  },
];

exports.login = async (req, res) => {
  try {
    const { email, password, deviceId } = req.body;

    // Validasi input
    if (!email || !password || !deviceId) {
      return ResponseWrapper.badRequest(
        res,
        "Email, password dan deviceId wajib diisi"
      );
    }

    // Cari user dan pastikan password field diambil
    const user = await User.findOne({ email }).select(
      "+password +activationToken +activationExpires"
    );
    if (!user) {
      return ResponseWrapper.badRequest(res, "Email atau password salah");
    }

    // Debug log
    console.log("User found:", {
      email: user.email,
      hasPassword: !!user.password,
      deviceId: user.deviceId,
    });

    // Pastikan user memiliki password
    if (!user.password) {
      console.error("User tidak memiliki password:", user.email);
      return ResponseWrapper.badRequest(res, "Data user tidak valid");
    }

    // Verifikasi password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return ResponseWrapper.badRequest(res, "Email atau password salah");
    }

    // Update deviceId
    user.deviceId = deviceId;

    console.log("Menyimpan perubahan user...");
    await user.save();
    console.log("Perubahan user berhasil disimpan.");

    // Generate token
    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    // Ambil attendance history
    const attendanceHistory = await Attendance.find({ userId: user.userId })
      .sort({ date: -1 })
      .limit(5);

    // Ambil info shift
    const currentShift = shifts.find(
      (shift) => shift.id === user.shiftSchedule.assignedShift
    );

    const userData = {
      token,
      user: {
        userId: user.userId,
        fullName: user.fullName,
        jobType: user.jobType,
        photo: user.photo,
        shiftSchedule: {
          assignedShift: user.shiftSchedule.assignedShift,
          shifts,
          currentShift: {
            startTime: currentShift.startTime,
            endTime: currentShift.endTime,
          },
        },
        notifications: {
          hasUnread: user.notification.hasUnread,
          count: user.notification.count,
        },
        attendanceHistory,
        isActive: user.isActive,
        ...(user.activationToken && { activationToken: user.activationToken }),
        ...(user.activationExpires && {
          activationExpires: user.activationExpires,
        }),
      },
    };

    console.log("Login berhasil untuk user:", userData);
    return ResponseWrapper.success(res, "Login berhasil", userData);
  } catch (error) {
    console.error("Error in login:", error);
    return ResponseWrapper.badRequest(res, "Gagal login", error.message);
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User dengan email tersebut tidak ditemukan",
      });
    }

    // Generate reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // Kirim email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const emailHtml = getResetPasswordTemplate(resetUrl, user.name);

    await sendEmail({
      to: user.email,
      subject: "Reset Password Attendy",
      html: emailHtml,
    });

    res.status(200).json({
      status: 200,
      message: "Link reset password telah dikirim ke email",
    });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).json({
      status: 500,
      message: "Gagal mengirim email reset password",
    });
  }
};

// Create User
exports.createUser = async (req, res) => {
  try {
    console.log("Request body:", req.body); // Debug log

    const { email, password, fullName, jobType, shiftSchedule } = req.body;

    // Validasi input
    if (!email || !password || !fullName || !jobType) {
      return ResponseWrapper.badRequest(
        res,
        "Data tidak lengkap",
        "Email, password, fullName, dan jobType wajib diisi"
      );
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return ResponseWrapper.badRequest(
        res,
        "Email sudah terdaftar",
        "Silakan gunakan email lain"
      );
    }

    // Validasi shift yang dipilih
    if (
      shiftSchedule &&
      !shifts.some((shift) => shift.id === shiftSchedule.assignedShift)
    ) {
      return ResponseWrapper.badRequest(
        res,
        "Shift tidak valid",
        "Pilih shift dengan id 1, 2, atau 3"
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Buat user baru
    const newUser = new User({
      email,
      password: hashedPassword,
      fullName,
      jobType,
      shiftSchedule: {
        assignedShift: shiftSchedule?.assignedShift || 3,
      },
      userId: `USR${Date.now()}`,
      photo: req.body.photo || "default-avatar.png",
      notification: {
        hasUnread: false,
        count: 0,
      },
      attendanceHistory: [],
    });

    console.log("New user object:", newUser);

    const savedUser = await newUser.save();
    console.log("Saved user:", savedUser);

    // Hapus password dari response
    const userResponse = savedUser.toObject();
    delete userResponse.password;

    return ResponseWrapper.created(res, "User berhasil dibuat", userResponse);
  } catch (error) {
    console.error("Error creating user:", error);
    return ResponseWrapper.badRequest(
      res,
      "Gagal membuat user",
      error.message || "Terjadi kesalahan saat membuat user"
    );
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    // Ambil semua user dari database, kecuali field password
    const users = await User.find({}).select("-password");

    // Tambahkan informasi shift untuk setiap user
    const usersWithShiftInfo = users.map((user) => {
      const currentShift = shifts.find(
        (shift) => shift.id === user.shiftSchedule.assignedShift
      );

      return {
        ...user.toObject(),
        shiftSchedule: {
          assignedShift: user.shiftSchedule.assignedShift,
          currentShift: {
            name: currentShift.name,
            startTime: currentShift.startTime,
            endTime: currentShift.endTime,
          },
        },
      };
    });

    return res.status(200).json({
      status: "success",
      data: {
        users: usersWithShiftInfo,
        total: users.length,
      },
    });
  } catch (error) {
    console.error("Error getting users:", error);
    return res.status(500).json({
      status: "error",
      message: "Gagal mengambil data user",
    });
  }
};
