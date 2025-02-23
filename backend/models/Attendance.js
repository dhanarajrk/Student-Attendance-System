import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  rollNumber: { type: String, required: true, trim: true },  
  date: { type: Date, default: Date.now },
  name: { type: String, required: true, trim: true},
  status: { type: String, enum: ["Present", "Absent"], required: true },
  className: { type: String, required: true, trim: true },
  section: { type: String, required: true, trim: true },
  subject: { type: String, required: true, trim: true },
});

// Add a unique compound index to prevent duplicate records
attendanceSchema.index({ studentId: 1, date: 1, subject: 1 }, { unique: true });

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;
