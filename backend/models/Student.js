import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    rollNumber: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true},
    className: { type: String, required: true, trim: true},
    section: { type: String, required: true, trim: true},
    parentPhone: { type: String, required: true, trim: true }, // Basic phone validation
})

const Student = mongoose.model("Student", studentSchema);

export default Student;