import { useState } from 'react';
import axios from 'axios';

function Register() {
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('usuario');
  const [mensaje, setMensaje] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    const numeroGenerado = Math.floor(100000 + Math.random() * 900000);

    try {
      const res = await axios.post('https://backendbernyfix.onrender.com/api/usuarios', {
        numeroIdentificacion: numeroGenerado.toString(),
        nombre,
        apellidos,
        contacto: {
          email,
          telefono
        },
        password,
        rol
      });

      setMensaje(`Registrado correctamente como ${res.data.nombre}. Ya puedes iniciar sesión.`);
    } catch (error) {
      if (error.response) {
        setMensaje(error.response.data.message);
      } else {
        setMensaje('Error al conectar con el servidor');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100">
      <div className="bg-white p-10 rounded-lg shadow-lg w-[50%] min-w-[340px]">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">REGISTER</h1>
        <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Name"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="text"
            placeholder="Last name"
            value={apellidos}
            onChange={(e) => setApellidos(e.target.value)}
            className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="tel"
            placeholder="Phone number"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 col-span-2"
            required
          />
          <select
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 col-span-2"
          >
            <option value="usuario">Usuario</option>
            <option value="admin">Admin</option>
          </select>
          <button
            type="submit"
            className="w-full col-span-2 bg-[#003366] text-white py-3 rounded-lg font-semibold hover:bg-[#002244] transition"
          >
            REGISTER & SIGN IN
          </button>
        </form>
        {mensaje && <p className="text-center text-sm text-gray-700 mt-4">{mensaje}</p>}
      </div>
    </div>
  );
}

export default Register;
