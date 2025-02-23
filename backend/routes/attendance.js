import express from "express";
import Attendance from "../models/Attendance.js";

const router = express.Router();

// Save attendance record
router.post("/", async (req, res) => {
    const { studentId, rollNumber, name, status, className, section, subject } = req.body;
    const date = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
  
    try {
      // Find and update the existing record, or create a new one if it doesn't exist
      const attendance = await Attendance.findOneAndUpdate(
        { studentId, date, subject },                      //This finds the document that needs to be updated. (FILTER)
        { $set: { rollNumber, name, status, className, section } },    //This specifies what to update                      (UPDATE)
        { upsert: true, new: true }                        // upsert: true creates a new record if it doesn't exist (NOT EXIST = TRUE THEN CREATE)
      );
      res.json(attendance);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

export default router;