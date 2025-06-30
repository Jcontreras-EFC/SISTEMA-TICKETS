import React, { useState, createContext } from 'react';
import './index.css';
import MenuPrincipal from './components/MenuPrincipal';
import UsuariosAdmin from './components/UsuariosAdmin';
import Navbar from './components/Navbar';
import { useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';

export const AuthContext = createContext();

function App() {
  const [logueado, setLogueado] = useState(false);
  const [usuario, setUsuario] = useState('');
  const [nombre, setNombre] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [permisos, setPermisos] = useState([]);
  const [seccion, setSeccion] = useState('dashboard');
  const navigate = useNavigate();
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    fetch('http://192.168.12.66:3001/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, clave: contrasena })
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.usuario) {
          setPermisos(data.permisos || []);
          setNombre(data.nombre || data.usuario);
          setLogueado(true);
        } else {
          alert('Usuario o contraseña incorrectos.');
        }
      })
      .catch(() => alert('Usuario o contraseña incorrectos.'));
  };

  // --- FUNCIÓN DE CERRAR SESIÓN ---
  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.clear();
    setLogueado(false);
    setPermisos([]);
    setUsuario('');
    setContrasena('');
    navigate('/login');
  };

  if (!logueado) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: 'url("/fondo.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg flex flex-col items-center w-full max-w-sm">
          {/* Logo de la empresa */}
          <img src="/logo.png" alt="Logo EFC" className="h-12 mr-2" style={{objectFit: 'contain'}} />
          <h2 className="text-2xl font-bold text-green-700 mb-6">Iniciar Sesión</h2>
          <form className="w-full flex flex-col gap-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-gray-700">Usuario</label>
              <input
                type="text"
                className="mt-1 w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="Usuario"
                value={usuario}
                onChange={e => setUsuario(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700">Contraseña</label>
              <input
                type="password"
                className="mt-1 w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="Contraseña"
                value={contrasena}
                onChange={e => setContrasena(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user: { nombre, usuario } }}>
      <div className="bg-gray-100 h-screen w-full font-sans flex flex-row">
        <Sidebar expanded={sidebarExpanded} setExpanded={setSidebarExpanded} setSeccion={setSeccion} seccion={seccion} />
        <div className="flex flex-col flex-1 h-full w-full overflow-hidden">
          <Navbar />
          <main className="flex-1 min-h-screen w-full bg-gray-100 overflow-auto flex flex-col p-0 m-0">
            {/* Aquí van los paneles principales y rutas */}
            {seccion === 'usuarios' && permisos.includes('usuarios') && <UsuariosAdmin usuarioLogueado={usuario} />}
            {seccion !== 'usuarios' && <MenuPrincipal seccion={seccion} setSeccion={setSeccion} permisos={permisos} usuarioLogueado={usuario} />}
          </main>
        </div>
      </div>
    </AuthContext.Provider>
  );
}

export default App;