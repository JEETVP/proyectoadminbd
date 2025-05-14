import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import CreateAppointment from "./components/CreateAppointment";
import Tramites from "./components/Tramites";
import AdminDashboard from "./components/AdminDashboard";
import UsuarioPanel from "./components/UsuarioPanel"; 
import UserList from "./components/UserList";
import CreateTipoT from "./components/CreateTipoT";
import TramitesAdmin from "./components/TramitesAdmin";


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
        <Route path="/view" element={<UserList />} /> {/* ✅ Nueva ruta */}
        <Route path="/crear-tipo-tramite" element={<CreateTipoT />} /> {/* ✅ Nueva ruta */}
        <Route path="/ayuda" element={<TramitesAdmin />} /> {/* ✅ Nueva ruta */}
      </Routes>
    </Router>
  );
}

export default App;
