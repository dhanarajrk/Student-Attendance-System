import mongoose from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import twilio from "twilio";

dotenv.config();

// Validate Environment Variables
const requiredEnvVars = [
  "MONGO_URI",
  "JWT_SECRET",
  "TWILIO_ACCOUNT_SID",
  "TWILIO_AUTH_TOKEN",
  "TWILIO_PHONE_NUMBER",
];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    console.error(`❌ Missing environment variable: ${envVar}`);
    process.exit(1);
  }
});

// Test MongoDB Connection
async function testMongoDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected Successfully!");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

// Test JWT Generation
function testJWT() {
  try {
    const token = jwt.sign({ userId: "testUser" }, process.env.JWT_SECRET, { expiresIn: "1h" });
    if (!token) throw new Error("Token not generated");
    console.log("✅ JWT Token Generated Successfully!");
  } catch (error) {
    console.error("❌ JWT Test Failed:", error.message);
    process.exit(1);
  }
}

// Test Twilio Credentials & Phone Number
async function testTwilio() {
  try {
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    // Validate Twilio Phone Number
    const phoneNumber = process.env.TWILIO_PHONE_NUMBER;
    if (!phoneNumber.startsWith("+")) {
      throw new Error("Invalid Twilio phone number format. It must start with '+' followed by the country code.");
    }

    // Check if Twilio API is accessible (fetch account balance)
    await client.api.v2010.balance.fetch();
    
    console.log("✅ Twilio Credentials and Phone Number Validated Successfully!");
  } catch (error) {
    console.error("❌ Twilio Test Failed:", error.message);
    process.exit(1);
  }
}

// Run All Tests
async function runTests() {
  console.log("🔄 Running Backend Tests...");
  await testMongoDB();
  testJWT();
  await testTwilio();
  console.log("🎉 All Tests Passed!");
}

runTests();
