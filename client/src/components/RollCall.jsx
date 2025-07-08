import React from "react";
import useStudentStore from "../store/studentStore";
import api from "../api/axios.js"; // I have an axios instance configured in ../api/axios.js
import { motion, AnimatePresence } from "framer-motion";

const RollCall = ({ students, selectedSubject  }) => {    //students represents list of students, selectedSubject as name tells itself are  passed from Dashboard.jsx 
  const {
    currentStudentIndex,
    attendanceRecords,
    markAttendance: markAttendanceInStore,
    nextStudent,
    prevStudent,
  } = useStudentStore();

  const currentStudent = students[currentStudentIndex];

  // Function to mark attendance and send data to the backend
  const markAttendance = async (studentId, status) => {
  
    try {
      await api.post("/attendance", {
        studentId,
        rollNumber: currentStudent.rollNumber,  
        name: currentStudent.name,
        status,
        className: currentStudent.className, 
        section: currentStudent.section, 
        subject: selectedSubject, //prop drilled selectedSubject is assigned
      });
      markAttendanceInStore(studentId, status); 
      nextStudent(); // Move to the next student

    } catch (err) {
      console.error("Failed to save attendance:", err.response?.data?.message || err.message);
    }
  };

  const isRollCallFinished = currentStudentIndex >= students.length;

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg shadow-lg w-full max-w-xl mx-auto mt-8 py-6">
      <h2 className="text-xl font-bold mb-4 text-center text-gray-200">Roll Call</h2>

      {isRollCallFinished ? (
        // 🎯 Roll Call Finished Message
        <div className="text-center py-10">
          <h3 className="text-2xl font-semibold text-green-400">✅ Roll Call Completed!</h3>
        </div>
      ) : (
        // 🎯 Roll Call Slideshow (Only shown if roll call is not finished)
        <div className="relative w-full overflow-hidden">
          <motion.div
            className="flex"
            initial={{ x: 0 }}
            animate={{ x: -currentStudentIndex * 100 + "%" }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
          >
            {students.map((student, index) => (
              <div
                key={student._id}
                className={`w-full flex-shrink-0 px-4 transition-all duration-500 ease-in-out ${
                  index === currentStudentIndex
                    ? "opacity-100 scale-105"
                    : "opacity-30 blur-sm scale-95"
                }`}
              >
                <div className="p-6 border border-gray-700 rounded-lg bg-gray-800 text-center">
                  <h3 className="text-lg font-semibold text-gray-100">{student.name}</h3>
                  {index === currentStudentIndex && (
                    <div className="mt-4">
                      <button
                        onClick={() => markAttendance(student._id, "Present")}
                        className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600 transition duration-200"
                      >
                        Present
                      </button>
                      <button
                        onClick={() => markAttendance(student._id, "Absent")}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
                      >
                        Absent
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      )}

      {/* Navigation Buttons */}
      {!isRollCallFinished && (
        <div className="flex justify-between mt-6">
          <button
            onClick={prevStudent}
            disabled={currentStudentIndex === 0}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition duration-200 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={nextStudent}
            disabled={currentStudentIndex === students.length - 1}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default RollCall;