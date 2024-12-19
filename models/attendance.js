const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const attendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: uuidv4,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    shiftId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shift",
      required: true,
    },
    clockIn: {
      time: Date,
      photo: String,
      location: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        coordinates: {
          type: [Number],
          required: true,
        },
      },
      status: {
        type: String,
        enum: ["ON_TIME", "LATE", "LOCATION_ERROR"],
        required: true,
      },
      dateClockIn: {
        type: Date,
        required: true,
      },
      photo: {
        type: String,
        required: true,
      },
    },
    clockOut: {
      time: Date,
      photo: String,
      location: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        coordinates: {
          type: [Number],
          required: true,
        },
      },
      status: {
        type: String,
        enum: ["ON_TIME", "EARLY", "OVERTIME", "LOCATION_ERROR"],
      },
      dateClockOut: {
        type: Date,
        required: true,
      },
      photo: {
        type: String,
        required: true,
      },
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        return {
          id: ret.id,
          userId: ret.userId,
          date: ret.date,
          shiftId: ret.shiftId,
          clockIn: {
            ...ret.clockIn,
            location: ret.clockIn?.location,
            dateClockIn: ret.clockIn?.dateClockIn,
            status: ret.clockIn?.status,
            photo: ret.clockIn?.photo,
          },
          clockOut: {
            ...ret.clockOut,
            location: ret.clockOut?.location,
            dateClockOut: ret.clockOut?.dateClockOut,
            status: ret.clockOut?.status,
            photo: ret.clockOut?.photo,
          },
        };
      },
    },
  }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
