import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import './App.css'
import ProtectedRoute from './pages/ProtectedRoute';

function App() {
  return (
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<Login />} />
          
           {/* Protected Route for Dashboard */}
          <Route element={<ProtectedRoute/>}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

        </Routes>
      </BrowserRouter>
  )
}

export default App
