import React, { useState } from "react";
import axios from "axios";
import useStudentStore from "../store/studentStore";

const ManageStudents = () => {
    const { students, setStudents } = useStudentStore();
    const [editStudentId, setEditStudentId] = useState(null);
    const [editedStudent, setEditedStudent] = useState({});
    const [showForm, setShowForm] = useState(false);
    const [newStudent, setNewStudent] = useState({
        rollNumber: "",
        name: "",
        className: "",
        section: "",
        parentPhone: "",
    });
    const [isLoading, setIsLoading] = useState(false); // Loading state

    const toggleForm = () => setShowForm(!showForm);

    const handleNewStudentChange = (e) => {
        setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
    };

    const handleEditChange = (e) => {
        setEditedStudent({ ...editedStudent, [e.target.name]: e.target.value });
    };

    const startEditing = (student) => {
        setEditStudentId(student._id);
        setEditedStudent({ ...student });
    };

    const cancelEditing = () => {
        setEditStudentId(null);
        setEditedStudent({});
    };

    const saveEdit = async () => {
        setIsLoading(true);
        try {
            const response = await axios.put(`${import.meta.env.VITE_AWS_BACKEND_BASE_URL}/api/students/${editStudentId}`, editedStudent);
            setStudents(students.map((s) => (s._id === editStudentId ? response.data : s)));
            setEditStudentId(null);
            setEditedStudent({});
        } catch (err) {
            console.error("Failed to update student:", err.response?.data?.message || err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteStudent = async (id) => {
        if (window.confirm("Are you sure you want to delete this student?")) {
            setIsLoading(true);
            try {
                await axios.delete(`${import.meta.env.VITE_AWS_BACKEND_BASE_URL}/api/students/${id}`);
                setStudents(students.filter((s) => s._id !== id));
            } catch (err) {
                console.error("Failed to delete student:", err.response?.data?.message || err.message);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const addStudent = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_AWS_BACKEND_BASE_URL}api/students`, newStudent);
            setStudents([...students, response.data]);
            setNewStudent({ rollNumber: "", name: "", className: "", section: "", parentPhone: "" });
            setShowForm(false);
        } catch (err) {
            console.error("Failed to add student:", err.response?.data?.message || err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 bg-gray-900 text-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Manage Students</h2>

            <button onClick={toggleForm} className="bg-blue-600 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700">
                {showForm ? "Cancel" : "Add Student"}
            </button>

            {showForm && (
                <form onSubmit={addStudent} className="mb-4 p-4 border border-gray-700 rounded bg-gray-800">
                    {Object.keys(newStudent).map((field) => (
                        <input
                            key={field}
                            type="text"
                            name={field}
                            placeholder={field.replace(/([A-Z])/g, " $1").trim()}
                            value={newStudent[field]}
                            onChange={handleNewStudentChange}
                            className="w-full p-2 mb-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    ))}
                    <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" disabled={isLoading}>
                        {isLoading ? "Adding..." : "Add Student"}
                    </button>
                </form>
            )}

            <h3 className="text-lg font-semibold mb-2">Student List</h3>
            <table className="w-full border border-gray-700 text-white">
                <thead>
                    <tr className="bg-gray-800">
                        {Object.keys(newStudent).map((field) => (
                            <th key={field} className="p-2 border border-gray-700">{field.replace(/([A-Z])/g, " $1").trim()}</th>
                        ))}
                        <th className="p-2 border border-gray-700">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student) => (
                        <tr key={student._id} className="border border-gray-700">
                            {Object.keys(newStudent).map((field) => (
                                <td key={field} className="p-2 border border-gray-700">
                                    {editStudentId === student._id ? (
                                        <input
                                            type="text"
                                            name={field}
                                            value={editedStudent[field] || ""}
                                            onChange={handleEditChange}
                                            className="w-full p-1 bg-gray-700 text-white border border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    ) : (
                                        student[field]
                                    )}
                                </td>
                            ))}
                            <td className="p-2 flex justify-center items-center space-x-2">
                                {editStudentId === student._id ? (
                                    <>
                                        <button className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700" onClick={saveEdit} disabled={isLoading}>
                                            {isLoading ? "Saving..." : "Save"}
                                        </button>
                                        <button className="bg-gray-600 text-white px-2 py-1 rounded hover:bg-gray-700" onClick={cancelEditing} disabled={isLoading}>
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button className="bg-yellow-600 text-white px-2 py-1 rounded hover:bg-yellow-700" onClick={() => startEditing(student)} disabled={isLoading}>
                                            Edit
                                        </button>
                                        <button className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700" onClick={() => deleteStudent(student._id)} disabled={isLoading}>
                                            Delete
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageStudents;