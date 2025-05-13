import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import CreateAppointment from "./components/CreateAppointment";
import Tramites from "./components/Tramites";
import AdminDashboard from "./components/AdminDashboard";
import UsuarioPanel from "./components/UsuarioPanel"; 


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/tramites" />} /> {/* ← Redirección actualizada */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-appointment" element={<CreateAppointment />} />
        <Route path="/tramites" element={<Tramites />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/usuario" element={<UsuarioPanel />} /> {/* ✅ Nueva ruta */}
        <Route path="*" element={<h1>Página no encontrada</h1>} />
        
      </Routes>
    </Router>
  );
}

export default App;
