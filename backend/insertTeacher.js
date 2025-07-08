import mongoose from "mongoose";
import Teacher from "./models/Teacher.js";
import "dotenv/config";

async function insertTeacher() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    //NO NEED FOR HASHING HERE, since i already put .pre("save") in Teacher.js, it will automatically hash from it just before teacher.save() is executed
    /*
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash("rajshree123", salt);
    */
  
    const teacher = new Teacher({
      name: "admin1",
      email: "admin1@gmail.com",
      password: "admin123",
    });

    await teacher.save();
    console.log("Sample teacher inserted successfully");
  } catch (err) {
    console.error("Error inserting sample data:", err);
  } finally {
    mongoose.connection.close();
  }
}

insertTeacher();

//*** run "node insertTeacher.js" in terminal if you want to insert/register a teacher  ***