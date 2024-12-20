const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const leaveSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: uuidv4,
      required: true,
    },
    // For Lembur (Overtime)
    overtimeDate: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    overtimeReason: {
      type: String,
      default: "",
    },

    // For Izin (Permission)
    leaveCategory: {
      type: String,
      enum: ["SICK", "ANNUAL", "OTHER"],
      required: true,
    },
    leaveDate: {
      type: Date,
      required: true,
    },
    delegatedTo: {
      type: String,
      required: true,
    },
    attachmentFile: {
      fileName: String,
      filePath: String,
    },
    leaveReason: {
      type: String,
      required: true,
    },

    // For Cuti (Annual Leave)
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },

    // Common fields
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return {
          id: ret.id,
          userId: ret.userId,
          status: ret.status,
          createdAt: ret.createdAt,
          updatedAt: ret.updatedAt,
          overtimeDate: ret.overtimeDate,
          startTime: ret.startTime,
          endTime: ret.endTime,
          overtimeReason: ret.overtimeReason,
          leaveCategory: ret.leaveCategory,
          leaveDate: ret.leaveDate,
          delegatedTo: ret.delegatedTo,
          attachmentFile: ret.attachmentFile,
          leaveReason: ret.leaveReason,
        };
      },
    },
  }
);

module.exports = mongoose.model("LeaveHistory", leaveSchema);
