const express = require("express");
const router = express.Router();
const attendanceController = require("../controller/attendanceController");
const leaveHistoryController = require("../controller/leaveHistoryController");
const leaveRequestController = require("../controller/leaveRequestController");
const blacklistedTokenController = require("../controller/blacklistedTokenController");
const profileRequestController = require("../controller/profileRequestController");
const passwordResetController = require("../controller/passwordResetController");
const userController = require("../controller/userController");
const ResponseWrapper = require("../utils/responseWrapper");
const auth = require("../middleware/auth");

// User
router.post("/login", userController.login);
router.post("/forgotPassword", userController.forgotPassword);
router.post("/createUser", userController.createUser);
router.get("/users", userController.getAllUsers);

// Password Reset
router.post("/reset-password", passwordResetController.resetPassword);

// Blacklisted Token
router.post("/logout", auth, blacklistedTokenController.addToBlacklist);

// Attendance
router.post("/clock-in", auth, attendanceController.clockIn);
router.put("/clock-out/:attendanceId", auth, attendanceController.clockOut);
router.get("/history/:userId", auth, attendanceController.getAttendanceHistory);
router.get(
  "/detail/:attendanceId",
  auth,
  attendanceController.getAttendanceDetail
);

// Leave History
router.get(
  "/leave-history/:userId",
  auth,
  leaveHistoryController.getLeaveHistory
);
router.get(
  "/permission-history/:userId",
  auth,
  leaveHistoryController.getPermissionHistory
);
router.get(
  "/overtime-history/:userId",
  auth,
  leaveHistoryController.getOvertimeHistory
);

// Leave Request
router.post("/leave-request", auth, leaveRequestController.createLeaveRequest);
router.post(
  "/permit-request",
  auth,
  leaveRequestController.createPermitRequest
);

// Profile Request
router.get("/profile", auth, profileRequestController.getAllProfiles);
router.get("/profile/:id", auth, profileRequestController.getProfileById);
router.post("/profile", auth, profileRequestController.createProfile);
router.put("/profile/:id", auth, profileRequestController.updateProfile);
router.delete("/profile/:id", auth, profileRequestController.deleteProfile);

// Tambahkan endpoint untuk datetime
router.get("/datetime", auth, (req, res) => {
  const now = new Date();

  // Format waktu HH:mm:ss
  const time = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  // Format tanggal dalam bahasa Indonesia
  const date = now.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return ResponseWrapper.success(res, {
    time,
    date,
    timestamp: now.getTime(), // Unix timestamp dalam milliseconds
    iso: now.toISOString(), // Format ISO untuk fleksibilitas di sisi client
  });
});

module.exports = router;
