import React, { useState } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import { AlertTriangle } from "lucide-react";

const GenerateReport = () => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchReports = async () => {
    if (!selectedClass || !selectedSection || !startDate || !endDate) {
      alert("Please select Class, Section, Start Date, and End Date before generating the report.");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      alert("End Date cannot be earlier than Start Date.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/reports", {
        params: {
          className: selectedClass,
          section: selectedSection,
          startDate,
          endDate,
        },
      });
      setReports(response.data);
    } catch (err) {
      console.error("Failed to fetch reports:", err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadCSV = () => {
    const csv = Papa.unparse(reports, {
      fields: ["rollNumber", "name", "className", "section", "parentPhone", "absentDays", "presentDays", "totalClasses", "attendancePercentage"],
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "attendance_report.csv");
  };

  return (
    <div className="p-4 bg-gray-900 text-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-200">Generate Report</h2>

      {/* Class Dropdown */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Class</label>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="w-full p-2 border rounded bg-gray-800 text-white"
        >
          <option value="">Select Class</option>
          <option value="10">Class 10</option>
          <option value="9">Class 9</option>
        </select>
      </div>

      {/* Section Dropdown */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Section</label>
        <select
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
          className="w-full p-2 border rounded bg-gray-800 text-white"
        >
          <option value="">Select Section</option>
          <option value="A">Section A</option>
          <option value="B">Section B</option>
        </select>
      </div>

      {/* Date Range Pickers */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full p-2 border rounded bg-gray-800 text-white"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">End Date</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full p-2 border rounded bg-gray-800 text-white"
        />
      </div>

      {/* Generate Report Button */}
      <button
        onClick={fetchReports}
        className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded mb-4"
        disabled={isLoading}
      >
        {isLoading ? "Generating..." : "Generate Report"}
      </button>

      {/* Download CSV Button */}
      <button
        onClick={downloadCSV}
        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded ml-2"
        disabled={isLoading || reports.length === 0}
      >
        Download as CSV
      </button>

      {/* Report Table */}
      {reports.length === 0 ? (
        <p className="mt-4 text-gray-400">Please select the above options</p>
      ) : (
        <div className="overflow-auto">
          <table className="w-full border-collapse mt-4 text-gray-200">
            <thead>
              <tr className="bg-gray-700">
                <th className="p-2 border">Roll No.</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Class</th>
                <th className="p-2 border">Section</th>
                <th className="p-2 border">Parent Phone</th>
                <th className="p-2 border">Absent Days</th>
                <th className="p-2 border">Present Days</th>
                <th className="p-2 border">Total Classes</th>
                <th className="p-2 border">Attendance %</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report, index) => (
                <tr key={index} className="border bg-gray-800">
                  <td className="p-2 border">{report.rollNumber}</td>
                  <td className="p-2 border">{report.name}</td>
                  <td className="p-2 border">{report.className}</td>
                  <td className="p-2 border">{report.section}</td>
                  <td className="p-2 border">{report.parentPhone}</td>
                  <td className="p-2 border">{report.absentDays}</td>
                  <td className="p-2 border">{report.presentDays}</td>
                  <td className="p-2 border">{report.totalClasses}</td>
                  <td className="p-2 border">{report.attendancePercentage}%
                    {report.attendancePercentage < 75 && (
                      <span className="text-red-500 flex items-center gap-1 ml-2">
                        <AlertTriangle size={16} /> <span className="text-xs">(Low Attendance)</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GenerateReport;