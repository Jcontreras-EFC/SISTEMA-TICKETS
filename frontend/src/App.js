import React, { useState } from 'react';
import './index.css';
import MenuPrincipal from './components/MenuPrincipal';
import UsuariosAdmin from './components/UsuariosAdmin';
import Navbar from './components/Navbar';

function App() {
  const [logueado, setLogueado] = useState(false);
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [permisos, setPermisos] = useState([]);
  const [seccion, setSeccion] = useState('dashboard');

  const handleLogin = (e) => {
    e.preventDefault();
    fetch('http://localhost:3001/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, clave: contrasena })
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.usuario) {
          setPermisos(data.permisos || []);
          setLogueado(true);
        } else {
          alert('Usuario o contraseña incorrectos.');
        }
      })
      .catch(() => alert('Usuario o contraseña incorrectos.'));
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
    <>
      <Navbar onSelect={setSeccion} seccion={seccion} permisos={permisos} />
      {seccion === 'usuarios' && permisos.includes('usuarios') && <UsuariosAdmin />}
      {seccion !== 'usuarios' && <MenuPrincipal seccion={seccion} setSeccion={setSeccion} permisos={permisos} usuarioLogueado={usuario} />}
    </>
  );
}

export default App;