import React, { useState } from 'react'
import useStudentStore from '../store/studentStore.js';
import RollCall from '../components/RollCall.jsx';
import ManageStudents from '../components/ManageStudents.jsx';
import { useNavigate } from "react-router-dom";
import GenerateReport from '../components/GenerateReport.jsx';
import api from "../api/axios.js";

//extra animation design imports:
import { motion } from 'framer-motion';
import { FaClipboardList, FaUserCog, FaFileAlt, FaSignOutAlt } from "react-icons/fa";

function Dashboard() {
  const { students, setStudents, resetRollCall } = useStudentStore();  //Global state/store from Zustand (+resetRollCall)

  const [selectedClass, setSelectedClass] = useState("");          //Selected Class from dropdown
  const [selectedSection, setSelectedSection] = useState("");      //Selected Section from dropdown
  const [selectedSubject, setSelectedSubject] = useState("");      //Selected Subject from dropdown
  const [showRollCall, setShowRollCall] = useState(false);         //controls whether RollCall component should show

  const [activeMenu, setActiveMenu] = useState("rollCall");        // Default active menu: Roll Call
  const navigate = useNavigate();

  const handleConfirm = async () => {
    try {
      const response = await api.get("/students", {
        params: { className: selectedClass, section: selectedSection }  //get sends without body but sends as params directly in URL eg. http://localhost:5000/api/students?className=10&section=A%26B
      });
      console.log("Students:", response.data);
      if (response.data) {
        resetRollCall();              // Reset index & records so Roll Call starts fresh for new class/section
        setStudents(response.data);   // Store/Set students in Zustand global store so that it will be used for listing, or generating reports
        setShowRollCall(false);       // Reset Start Roll Call button
      }
    }
    catch (err) {
      console.error("Failed to fetch students:", err.response?.data?.message || err.message);
    }
    //console.log("Class:", selectedClass, "Section:", selectedSection, "Subject:", selectedSubject); //frontend debug check
  }

  return (
    <div className="flex h-screen bg-gray-900 text-gray-200">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-64 bg-gray-800 p-6 shadow-lg flex flex-col justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold mb-6 text-blue-400">Dashboard</h2>
          <ul>
            {[
              { key: 'rollCall', label: 'Roll Call', icon: <FaClipboardList /> },
              { key: 'manageStudents', label: 'Manage Students', icon: <FaUserCog /> },
              { key: 'generateReport', label: 'Generate Report', icon: <FaFileAlt /> }
            ].map(({ key, label, icon }, index) => (
              <li key={index} className="mb-4">
                <button
                  onClick={() => setActiveMenu(key)}    // Set active menu on click
                  className={`w-full text-left flex items-center p-3 rounded-lg transition duration-300 ${activeMenu === key ? 'bg-blue-500' : 'hover:bg-gray-700'}`}
                >
                  <span className="mr-3 text-lg">{icon}</span>
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem('token');  // Clear JWT token
            navigate('/');                     // Redirect to login
          }}
          className="w-full flex items-center justify-center p-3 bg-red-500 hover:bg-red-600 rounded-lg transition duration-300"
        >
          <FaSignOutAlt className="mr-2" /> Logout
        </button>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-3xl font-bold mb-6 text-blue-400"
        >
          Student Attendance Management
        </motion.h1>

        {activeMenu === 'rollCall' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800 p-6 rounded-lg shadow-lg"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[['Class', selectedClass, setSelectedClass, ['10', '9', '8', '7', '6']],
              ['Section', selectedSection, setSelectedSection, ['A', 'B', 'C']],
              ['Subject', selectedSubject, setSelectedSubject, ['Maths', 'Science', 'English', 'Hindi', 'Political Science']]
              ].map(([label, state, setter, options], index) => (
                <div key={index}>
                  <label className="block text-sm font-medium mb-2">{label}</label>
                  <select
                    value={state}
                    onChange={(e) => {
                      resetRollCall();              //Reset Roll Call state immediately on dropdown change
                      setShowRollCall(false);      //Hide Start Roll Call button if user changes dropdown
                      setStudents([]);             // Clear students so Start Roll Call button disappears
                      setter(e.target.value);      // Update selectedClass, selectedSection, or selectedSubject
                    }}
                    className="w-full p-3 bg-gray-700 border-none rounded focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select {label}</option>
                    {options.map((option, i) => (
                      <option key={i} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            {/* Confirm Button */}
            <button
              onClick={handleConfirm}
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Confirm
            </button>

            {/* Show Start Roll Call Button after Confirm */}
            {students.length > 0 && !showRollCall && (
              <div className="flex justify-center mt-6"> {/* Center it horizontally and add margin top */}
                <button
                  onClick={() => setShowRollCall(true)}  // Set to true to show RollCall
                  className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
                >
                  Start Roll Call
                </button>
              </div>
            )}

            {/* Show RollCall component only after Start Roll Call */}
            {students.length > 0 && showRollCall && (
              <RollCall students={students} selectedSubject={selectedSubject} />
            )}
          </motion.div>
        )}

        {activeMenu === 'manageStudents' && <ManageStudents />}
        {activeMenu === 'generateReport' && <GenerateReport />}
      </div>
    </div>
  );
};

export default Dashboard;
