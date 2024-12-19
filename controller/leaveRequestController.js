const { LeaveRequest } = require("../models/leaveRequest");
const ResponseWrapper = require("../utils/responseWrapper");

// Contoh create permit request
const createPermitRequest = async (req, res) => {
  try {
    const leaveRequest = new LeaveRequest({
      userId: req.user.id,
      type: req.body.type,
      leaveCategory: req.body.leaveCategory,
      dates: req.body.dates,
      delegatedTo: req.body.delegatedTo,
      attachmentFile: req.body.attachmentFile,
      reason: req.body.reason,
    });

    await leaveRequest.save();
    return ResponseWrapper.success(
      res,
      "Berhasil membuat permintaan izin",
      leaveRequest
    );
  } catch (error) {
    return ResponseWrapper.error(res, "Gagal membuat permintaan izin");
  }
};

// Contoh create request
const createLeaveRequest = async (req, res) => {
  try {
    const leaveRequest = new LeaveRequest({
      userId: req.user.id,
      type: req.body.type,
      leaveCategory: req.body.leaveCategory,
      dates: req.body.dates,
      start: req.body.start,
      end: req.body.end,
      delegatedTo: req.body.delegatedTo,
      attachmentFile: req.body.attachmentFile,
      reason: req.body.reason,
    });

    await leaveRequest.save();
    return ResponseWrapper.success(
      res,
      "Berhasil membuat permintaan izin",
      leaveRequest
    );
  } catch (error) {
    return ResponseWrapper.error(res, "Gagal membuat permintaan izin");
  }
};

// Contoh create overtime request
const createOvertimeRequest = async (req, res) => {
  try {
    const { type, date, dates, time, reason, overtimeType, compensationType } =
      req.body;

    // Base overtime request object
    const overtimeRequest = {
      userId: req.user.id,
      type: "OVERTIME",
      reason: reason,
    };

    // Jika overtime tipe jam (hourly)
    if (overtimeType === "hourly") {
      overtimeRequest.dates = {
        start: new Date(date), // Single date untuk overtime harian
        time: {
          start: time.start,
          end: time.end,
        },
      };
    }
    // Jika overtime tipe harian (daily)
    else if (overtimeType === "daily") {
      overtimeRequest.dates = {
        start: new Date(dates.start),
        end: new Date(dates.end),
      };
      overtimeRequest.overtimeType = compensationType;
    }

    const leaveRequest = new LeaveRequest(overtimeRequest);
    await leaveRequest.save();
    return ResponseWrapper.success(
      res,
      "Berhasil membuat permintaan izin",
      leaveRequest
    );
  } catch (error) {
    return ResponseWrapper.error(res, "Gagal membuat permintaan izin");
  }
};

module.exports = {
  createPermitRequest,
  createLeaveRequest,
  createOvertimeRequest,
};
