import { useState } from 'react';
import axios from 'axios';

function Login() {
  const [numeroIdentificacion, setNumeroIdentificacion] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://backendbernyfix.onrender.com/api/login', {
        numeroIdentificacion,
        password,
      });
      setMensaje(`Bienvenido, ${res.data.usuario.nombre}`);
    } catch (error) {
      if (error.response) {
        setMensaje(error.response.data.mensaje);
      } else {
        setMensaje('Error al conectar con el servidor');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-200">
      <div className="bg-white p-10 rounded-lg shadow-lg w-[40%] min-w-[320px] h-[550px] flex flex-col justify-center">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">LOG-IN</h1>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={numeroIdentificacion}
            onChange={(e) => setNumeroIdentificacion(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-6 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <button
            type="submit"
            className="w-full bg-[#6699CC] text-white py-3 rounded-lg font-semibold hover:bg-[#5588bb] transition"
          >
            SIGN IN
          </button>
        </form>

        {/* Línea divisora con OR */}
        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="px-3 text-gray-500 text-sm">OR</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        {/* Botón de registro */}
        <button
          type="button"
          className="w-full bg-[#003366] text-white py-3 rounded-lg font-semibold hover:bg-[#002244] transition"
        >
          REGISTER
        </button>

        {mensaje && <p className="text-center text-sm text-gray-700 mt-4">{mensaje}</p>}
      </div>
    </div>
  );
}

export default Login;
