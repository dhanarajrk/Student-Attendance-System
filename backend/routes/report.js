import express from "express";
import Attendance from "../models/Attendance.js";
import Student from "../models/Student.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { className, section, startDate, endDate } = req.query;

    // Find all students in the given class & section
    const students = await Student.find({ className, section });

    if (students.length === 0) {
      return res.status(404).json({ message: "No students found" });
    }

    const studentIds = students.map((student) => student._id);

    // Fetch attendance records in bulk for all students
    const attendanceRecords = await Attendance.find({
      studentId: { $in: studentIds },
      date: { $gte: new Date(startDate), $lte: new Date(endDate) },
    });

    // Group attendance records by student ID
    const attendanceMap = attendanceRecords.reduce((acc, record) => {  //acc(accumulator) is like a storage which is initialized as acc = {} and each record will be pushed inside it (grouped by studentID)
      if (!acc[record.studentId]) acc[record.studentId] = [];          //eg. studentId = 1 is unique or isn't exist in acc, then acc will create studentId(as key) : and empty array[] - to group same studentId attendances of different days inside the array
      acc[record.studentId].push(record);
      return acc;
    }, {});

    // Generate reports efficiently
    const reports = students.map((student) => {
      const records = attendanceMap[student._id] || [];    //there is no guarantee that attendanceMap will contain all students._id, so if attendanceMap[student._id] does not exists then just assign attendanceMap[student._id] : [] empty array so that records.length and records.filter will not occur error 
      const totalClasses = records.length;                //I calculate totalClasses for each student becuz if a teacher forgot to mark or student joins in mid year, then his attendance % will be inaccurate/reduced. So to provide fair calculation of attendance, I make inconsistent totalClasses for each students
      const absentDays = records.filter((r) => r.status === "Absent").length;
      const presentDays = totalClasses - absentDays;
      const attendancePercentage = totalClasses
        ? (((totalClasses - absentDays) / totalClasses) * 100).toFixed(2)
        : "0.00";

      return {
        reportStudentId: student._id,
        rollNumber: student.rollNumber,
        name: student.name,
        className: student.className,
        section: student.section,
        parentPhone: student.parentPhone,
        absentDays,
        presentDays,
        totalClasses,
        attendancePercentage,
      };
    });

    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
