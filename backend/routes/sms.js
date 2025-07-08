import express from "express";
import twilio from "twilio";
import Student from "../models/Student.js";
import SmsLog from "../models/SmsLog.js";
import "dotenv/config";

const router = express.Router();
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

//Send bulk SMS
router.post("/send-bulk", async(req, res) =>{
    
    const {studentIds, message} = req.body;
    console.log("Received body:", req.body);

    try{
        const students = await Student.find({ _id: { $in: studentIds}}); //find StudentIds in bulk at once
        //I am using Promise.all to send SMS in parallel
        const results = await Promise.all(
            students.map(async(student) => {
                try{
                    const response = await client.messages.create({    //creating each twilio message body with sender and receiver number
                        body:message,
                        from: process.env.TWILIO_PHONE_NUMBER,
                        to: student.parentPhone,
                    });

                    //Log the successful SMS in smslogs database
                    await SmsLog.create({
                        studentId: student._id,
                        message,
                        status: "sent",
                        sid: response.sid,
                    });

                    return { studentId: student._id, status: "success" }; //add the status along with resp. studentId to results
                } 
                catch(err) {
                    //Log the failed SMS
                    await SmsLog.create({
                        studentId: student._id,
                        message,
                        status: "failed",
                        error: err.message,
                    });

                    return { studentId: student._id, status: "failed", error: err.message};
                }
            })
        );

        res.json({ message: "Bulk SMS process completed", results });
    }
    catch(err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }

});

export default router;
