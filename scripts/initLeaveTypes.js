const LeaveType = require("../models/LeaveType");

const initializeLeaveTypes = async () => {
  const leaveTypes = [
    {
      name: "Sick Leave",
      daysAllowed: 10,
      description: "Cuti sakit dengan surat dokter",
    },
    {
      name: "Absent",
      daysAllowed: 2,
      description: "Ketidakhadiran dengan pemberitahuan",
    },
    {
      name: "Alpha",
      daysAllowed: 2,
      description: "Ketidakhadiran tanpa pemberitahuan",
    },
    {
      name: "Permission",
      daysAllowed: 2,
      description: "Izin dengan pemberitahuan",
    },
    {
      name: "Leave",
      daysAllowed: 2,
      description: "Cuti regular",
    },
    {
      name: "Overtime",
      daysAllowed: 6,
      description: "Lembur",
    },
  ];

  try {
    await LeaveType.insertMany(leaveTypes);
    console.log("Leave types initialized successfully");
  } catch (error) {
    console.error("Error initializing leave types:", error);
  }
};
