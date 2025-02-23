import express from "express";
import Student from "../models/Student.js";
import Attendance from "../models/Attendance.js";

const router = express.Router();

//Fetch students lists by class and section
router.get("/", async(req, res) =>{
    const { className, section } = req.query; //get destructs from req.query while post destructs from req.body

    try{
        const students = await Student.find({ className, section });  //fetch all students in same class and section from the database
        res.json(students);
    }
    catch(err){
        res.status(500).json({ message: "Server error" });
    }
});

// Add a new student
router.post("/", async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();
        //console.log("Student added successfully"); //debug 
        res.json(student);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Update an existing student
router.put("/:id", async (req, res) => {
    try {
        const { rollNumber, name, className, section, parentPhone } = req.body;

        // Find and update student record
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            { rollNumber, name, className, section, parentPhone },
            { new: true, runValidators: true }  // Ensures validation is applied
        );

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Update attendance records only if values have changed
        await Attendance.updateMany(
            { studentId: req.params.id },
            { $set: { rollNumber, name, className, section } }
        );

        res.json(student);
    } catch (err) {
        console.error("Error updating student:", err);
        res.status(500).json({ message: "Server error" });
    }
});


// Delete a student
router.delete("/:id", async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.json({ message: "Student deleted" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

export default router;