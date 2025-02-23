import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Teacher from "../models/Teacher.js"
import "dotenv/config";

const router = express.Router();

//Teacher Login Authentication
router.post("/login", async(req,res) => {  //router.post() works same as app.post() except router can be used in different files and export it 
    //console.log("Received login request:", req.body); // Debug log
    const {email, password} = req.body;    //A teacher email and password that client sent is destructed from req.body

    try{
        //Check if teacher exists
        const teacher = await Teacher.findOne({ email });
        if(!teacher){
            return res.status(400).json({ message: "Invalid email"});
        }

        //Check password
        const isMatch = await bcrypt.compare(password, teacher.password);
        if(!isMatch){
            return res.status(400).json({ message: "Incorrect password" });
        }

        //After the above codes authenticate credentials , below code will Generate JWT for authenticated teacher
        const token = jwt.sign( {id: teacher._id}, process.env.JWT_SECRET, {expiresIn: "1h"} );
        res.json({token});
    }
    catch(err) {
        res.status(500).json({ message: "Server error" });
    }
});

export default router;