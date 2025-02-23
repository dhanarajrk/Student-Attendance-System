import React from 'react'
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {

  const token = localStorage.getItem("token");  //getting the validated token from localStorage

  return (
    token ? <Outlet /> : <Navigate to="/" replace/> //if token exists redirect to child component(Dashboard)(Outlet) and if no token redirect to login page. And replace attribute disables the browser's back button so that they can't enter /dashboard
  )
}

export default ProtectedRoute

//we must wrap the Child Component Route with this ProtectedRoute in App.jsx