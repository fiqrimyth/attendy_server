const mongoose = require("mongoose");

const leaveRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["ANNUAL_LEAVE", "ABSENCE_PERMIT", "OVERTIME"],
      required: true,
    },
    leaveCategory: {
      type: String,
      enum: ["SICK", "ANNUAL", "OTHER"],
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
      required: true,
    },
    dates: {
      start: {
        type: Date,
        required: true,
      },
      end: {
        type: Date,
      },
      time: {
        start: String,
        end: String,
      },
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    approvedAt: {
      type: Date,
    },
    attachmentFile: {
      type: String,
    },
    delegatedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reason: {
      type: String,
    },
    overtimeType: {
      type: String,
      enum: ["PAID_OVERTIME", "LEAVED_OVERTIME"],
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
          type: ret.type,
          status: ret.status,
          reason: doc.generateReason(),
          approvedBy: ret.approvedBy,
          approvedAt: ret.approvedAt,
          createdAt: ret.createdAt,
          attachmentFile: ret.attachmentFile,
          delegatedTo: ret.delegatedTo,
          reason: ret.reason,
        };
      },
    },
  }
);

// Method untuk generate reason
leaveRequestSchema.methods.generateReason = function () {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "MMMM",
      year: "numeric",
    });
  };

  switch (this.type) {
    case "ANNUAL_LEAVE":
      return `Pengajuan cuti anda pada tanggal ${formatDate(
        this.dates.start
      )} - ${formatDate(
        this.dates.end
      )} telah di ${this.getStatusText()} oleh atasan anda.`;

    case "ABSENCE_PERMIT":
      return `Pengajuan izin absen anda pada tanggal ${formatDate(
        this.dates.start
      )} telah di ${this.getStatusText()} oleh atasan anda.`;

    case "OVERTIME":
      return `Pengajuan lembur anda pada tanggal ${formatDate(
        this.dates.start
      )} dari jam ${this.dates.time.start} - ${
        this.dates.time.end
      } telah di ${this.getStatusText()} oleh atasan anda.`;
  }
};

leaveRequestSchema.methods.getStatusText = function () {
  switch (this.status) {
    case "PENDING":
      return "diajukan";
    case "APPROVED":
      return "acc";
    case "REJECTED":
      return "ditolak";
  }
};

module.exports = mongoose.model("LeaveRequest", leaveRequestSchema);
