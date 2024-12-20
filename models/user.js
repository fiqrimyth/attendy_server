const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      default: uuidv4,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    jobType: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      default: "default-avatar.png",
    },
    shiftSchedule: {
      type: Object,
      required: true,
      default: {
        assignedShift: 3,
        shifts: [
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
        ],
        currentShift: {
          startTime: "06:00",
          endTime: "15:00",
        },
      },
    },
    notification: {
      type: Object,
      required: true,
      default: {
        hasUnread: false,
        count: 0,
      },
    },
    attendanceHistory: {
      type: Array,
      required: true,
      default: [
        {
          date: String,
          checkIn: String,
          checkOut: String,
          status: String,
        },
      ],
    },
    deviceId: { type: String },
    password: {
      type: String,
      required: true,
      select: false,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    activationToken: {
      type: String,
      select: false,
    },
    activationExpires: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret._id;
        delete ret.__v;
        return {
          id: ret.id,
          email: ret.email,
          fullName: ret.fullName,
          jobType: ret.jobType,
          photo: ret.photo,
          shiftSchedule: ret.shiftSchedule,
          assignedShift: ret.assignedShift,
          currentShift: ret.currentShift,
          notification: ret.notification,
          hasUnread: ret.notification.hasUnread,
          count: ret.notification.count,
          attendanceHistory: ret.attendanceHistory,
          date: ret.date,
          checkIn: ret.checkIn,
          checkOut: ret.checkOut,
          status: ret.status,
          deviceId: ret.deviceId,
          password: ret.password,
          isActive: ret.isActive,
          ...(ret.activationToken && { activationToken: ret.activationToken }),
          ...(ret.activationExpires && {
            activationExpires: ret.activationExpires,
          }),
        };
      },
    },
  }
);

// Middleware untuk hash password sebelum save
userSchema.pre("save", async function (next) {
  // Hanya hash password jika password dimodifikasi atau user baru
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.generateActivationToken = function () {
  this.activationToken = uuidv4();
  // Menggunakan durasi yang sama dengan auth token
  const tokenDuration = process.env.JWT_EXPIRES_IN || "1d"; // default 1 hari jika tidak diset

  // Konversi durasi ke milliseconds
  let expiresIn;
  if (tokenDuration.endsWith("d")) {
    expiresIn = parseInt(tokenDuration) * 24 * 60 * 60 * 1000;
  } else if (tokenDuration.endsWith("h")) {
    expiresIn = parseInt(tokenDuration) * 60 * 60 * 1000;
  } else {
    expiresIn = 24 * 60 * 60 * 1000; // default 24 jam
  }

  this.activationExpires = new Date(Date.now() + expiresIn);
};

userSchema.methods.isActivationTokenValid = function (token) {
  return this.activationToken === token && this.activationExpires > Date.now();
};

module.exports = mongoose.model("User", userSchema);
