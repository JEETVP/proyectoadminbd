// src/App.jsx

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import CreateAppointment from "./components/CreateAppointment";
import Tramites from "./components/Tramites";
import AdminDashboard from "./components/AdminDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} /> {/* Inicio */}
        <Route path="/register" element={<Register />} />
        <Route path="/create-appointment" element={<CreateAppointment />} />
        <Route path="/tramites" element={<Tramites />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;