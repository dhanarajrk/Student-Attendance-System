import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";


const app = express();

//Middleware 
app.use(cors());
app.use(express.json());

//Import Routes and Use the Routes
import authRoutes from "./routes/auth.js"
app.use("/api/auth", authRoutes);          //whenever enpoint starts with "/api/auth" then use authRoutes  (Teacher authentication route)

import studentRoutes from "./routes/students.js"  
app.use("/api/students", studentRoutes);   //Student related route.

import attendanceRoutes from "./routes/attendance.js"
app.use("/api/attendance", attendanceRoutes);   //Attendance Saving route

import reportRoutes from "./routes/report.js"
app.use("/api/reports", reportRoutes);   //Report fetching route

import smsRoutes from "./routes/sms.js"
app.use("/api/sms", smsRoutes);   //SMS Route

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Routes
app.get("/", (req, res) => {
    res.send("Backend is running");
  });

// Start the server only if this file is run directly
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// ✅ Export app & server for testing
export { app, mongoose, server };