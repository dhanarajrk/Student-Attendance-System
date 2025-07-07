import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async(e) => {
        e.preventDefault();
        try{
          const response = await axios.post(`${import.meta.env.VITE_AWS_BACKEND_BASE_URL}/api/auth/login`, 
          {
            email,
            password, 
          });                                   //post will send email and password to backend /api/auth/login Route
          const { token } = response.data;      //after auth.js runs router.post("/login") teacher authentication, generate JWT token and will be sent from server to client
          localStorage.setItem("token", token); //this token will be saved in localStorage named "token" to use it whenever client wants to request anything to server
          navigate("/dashboard"); // Redirect to dashboard after login verified
        }

        catch(err){
          console.error("Login failed:", err.response?.data?.message || err.message);
          alert("Invalid email or password");
        }  
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
            <form
                onSubmit={handleLogin}
                className="p-6 bg-gray-800 rounded-lg shadow-lg w-80"
            >
                <h2 className="text-2xl font-bold mb-4 text-gray-200">Teacher Login</h2>
                
                {/* Test Credentials Hint */}
                <div className="mb-4 p-3 bg-blue-900 bg-opacity-50 rounded border border-blue-600">
                    <p className="text-xs text-blue-300 font-semibold mb-1">Test Credentials:</p>
                    <p className="text-xs text-blue-200">Teacher: teacher1@gmail.com / teacher123</p>
                    <p className="text-xs text-blue-200">Admin: admin1@gmail.com / admin123</p>
                </div>
                
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1 text-gray-300">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1 text-gray-300">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-500 transition"
                >
                    Login
                </button>
            </form>
        </div>
    );
}

export default Login