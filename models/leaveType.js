const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const leaveTypeSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: uuidv4,
      required: true,
    },
    name: {
      type: String,
      required: true,
      enum: [
        "Sick Leave",
        "Absent",
        "Alpha",
        "Permission",
        "Leave",
        "Overtime",
      ],
    },
    daysAllowed: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
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
          name: ret.name,
          daysAllowed: ret.daysAllowed,
          description: ret.description,
          isActive: ret.isActive,
        };
      },
    },
  }
);

module.exports = mongoose.model("LeaveType", leaveTypeSchema);
