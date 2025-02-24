import mongoose from "mongoose";

const smsLogSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ["sent", "failed"], required: true },
  error: { type: String },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("SmsLog", smsLogSchema);