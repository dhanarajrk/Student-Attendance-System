import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const teacherSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true},
    password: { type: String, required: true},
});

//Bcrypt hash password before saving
teacherSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
      const salt = await bcrypt.genSalt(12); // Stronger hashing
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

const Teacher = mongoose.model("Teacher", teacherSchema);

export default Teacher; //Teacher model is exported to use in other files
