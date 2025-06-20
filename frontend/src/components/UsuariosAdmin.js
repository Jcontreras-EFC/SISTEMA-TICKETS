import React, { useEffect, useState, useRef } from 'react';

const PERMISOS = [
  { key: 'tickets', label: 'Gestión de tickets' },
  { key: 'base', label: 'Base de datos' },
  { key: 'dashboard', label: 'Dashboards/Reportes' },
  { key: 'usuarios', label: 'Administrar usuarios' },
];

const UsuariosAdmin = ({ usuarioLogueado }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({ usuario: '', clave: '', permisos: [], foto: null });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();
  const [imgKey, setImgKey] = useState(Date.now());
  const [modalEliminar, setModalEliminar] = useState(false);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);
  const [editandoUsuario, setEditandoUsuario] = useState(null);

  const fetchUsuarios = () => {
    fetch('http://localhost:3001/api/usuarios')
      .then(res => res.json())
      .then(data => setUsuarios(data));
  };

  useEffect(() => { fetchUsuarios(); }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePermiso = key => {
    setForm(f => ({
      ...f,
      permisos: f.permisos.includes(key)
        ? f.permisos.filter(p => p !== key)
        : [...f.permisos, key],
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      if (form.foto && typeof form.foto !== 'string') {
        const data = new FormData();
        data.append('foto', form.foto);
        data.append('usuario', form.usuario);
        await fetch('http://localhost:3001/api/usuarios/foto', {
          method: 'POST',
          body: data
        });
      }
      const url = editId
        ? `http://localhost:3001/api/usuarios/${editId}`
        : 'http://localhost:3001/api/usuarios';
      const method = editId ? 'PUT' : 'POST';
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario: form.usuario, clave: form.clave, permisos: form.permisos }),
      });
      setForm({ usuario: '', clave: '', permisos: [], foto: null });
      setEditId(null);
      fetchUsuarios();
      setImgKey(Date.now());
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = u => {
    setForm({ usuario: u.usuario, clave: '', permisos: u.permisos, foto: u.foto });
    setEditId(u.id);
    setEditandoUsuario(u.usuario);
  };

  const handleDelete = id => {
    const usuario = usuarios.find(u => u.id === id);
    setUsuarioAEliminar(usuario);
    setModalEliminar(true);
  };

  const confirmarEliminar = () => {
    if (!usuarioAEliminar) return;
    fetch(`http://localhost:3001/api/usuarios/${usuarioAEliminar.id}`, { method: 'DELETE' })
      .then(() => {
        fetchUsuarios();
        setModalEliminar(false);
        setUsuarioAEliminar(null);
      });
  };

  const cancelarEliminar = () => {
    setModalEliminar(false);
    setUsuarioAEliminar(null);
  };

  // Manejar subida de foto
  const handleFotoChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    setForm(f => ({ ...f, foto: file }));
  };

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '60px',
        overflow: 'hidden',
      }}
    >
      {/* Imagen de fondo con blur y escala de grises */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url("/institucion.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'blur(4px) grayscale(0.18)',
          zIndex: 0,
        }}
      />
      {/* Overlay oscuro con degradado más suave */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(to bottom, rgba(30,40,60,0.18) 0%, rgba(30,40,60,0.28) 100%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
      <div
        className="w-full max-w-5xl mx-auto rounded-3xl shadow-2xl px-8 py-10 border border-green-300"
        style={{
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(22px)',
          WebkitBackdropFilter: 'blur(22px)',
          boxShadow: '0 16px 48px 0 rgba(31, 38, 135, 0.14)',
          position: 'relative',
          zIndex: 2,
          border: '3px solid #16a34a',
        }}
      >
        <h2 className="text-5xl font-black text-green-800 mb-2 text-center tracking-wider drop-shadow-lg uppercase" style={{letterSpacing:'0.12em', textShadow:'0 2px 12px #b6e7c9'}}>Administrar Usuarios</h2>
        <div className="w-32 h-1 mx-auto mb-8 rounded-full" style={{background:'linear-gradient(90deg,#16a34a 0%,#b6e7c9 100%)'}}></div>
        <div className="flex flex-col items-center justify-center mb-8">
          {((editId && editandoUsuario) || usuarioLogueado) ? (
            <FotoUsuarioCorporativo
              usuario={editId && editandoUsuario ? editandoUsuario : usuarioLogueado}
              imgKey={imgKey}
            />
          ) : null}
          <span className="text-2xl font-bold text-green-800 mt-2">{editId && editandoUsuario ? editandoUsuario : usuarioLogueado}</span>
        </div>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10" onSubmit={handleSubmit}>
          <div>
            <label className="block text-green-800 font-bold uppercase tracking-wide mb-2">Usuario</label>
            <input name="usuario" value={form.usuario} onChange={handleChange} className="mt-1 w-full px-4 py-3 border-2 border-green-200 rounded-2xl shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-200 bg-white/80 transition" required />
          </div>
          <div>
            <label className="block text-green-800 font-bold uppercase tracking-wide mb-2">Contraseña {editId && <span className="text-xs text-gray-500 normal-case">(dejar vacío para no cambiar)</span>}</label>
            <input name="clave" type="password" value={form.clave} onChange={handleChange} className="mt-1 w-full px-4 py-3 border-2 border-green-200 rounded-2xl shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-200 bg-white/80 transition" required={!editId} />
          </div>
          <div>
            <label className="block text-green-800 font-bold uppercase tracking-wide mb-2">Foto (opcional)</label>
            <input type="file" accept="image/png" ref={fileInputRef} onChange={handleFotoChange} className="mt-1 w-full px-4 py-3 border-2 border-green-200 rounded-2xl bg-white/80 shadow-sm" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-green-800 font-bold uppercase tracking-wide mb-2">Permisos (secciones):</label>
            <div className="flex flex-wrap gap-3">
              {PERMISOS.map(p => (
                <button
                  type="button"
                  key={p.key}
                  onClick={() => handlePermiso(p.key)}
                  className={`px-4 py-2 rounded-full font-semibold border-2 transition shadow-sm text-sm select-none ${form.permisos.includes(p.key) ? 'bg-green-600 text-white border-green-700 shadow-md' : 'bg-white/80 text-green-800 border-green-300 hover:bg-green-50'}`}
                  style={{outline:'none'}}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <div className="md:col-span-2 flex gap-4 justify-center mt-2">
            <button
              type="submit"
              className="px-7 py-2 rounded-md font-extrabold uppercase tracking-widest text-green-700 border-2 border-green-600 bg-white shadow-md transition-all duration-200 hover:bg-green-600 hover:text-white hover:shadow-lg active:scale-95 focus:outline-none text-base"
              disabled={loading}
              style={{letterSpacing:'0.12em'}}
            >
              {editId ? 'Actualizar usuario' : 'Crear usuario'}
            </button>
            {editId && (
              <button
                type="button"
                className="px-7 py-2 rounded-md font-bold uppercase tracking-widest text-gray-700 border-2 border-gray-400 bg-white shadow-md transition-all duration-200 hover:bg-gray-300 hover:text-gray-900 hover:border-2 hover:border-gray-800 hover:shadow-2xl hover:scale-105 active:scale-95 focus:outline-none text-base"
                onClick={() => { setEditId(null); setForm({ usuario: '', clave: '', permisos: [], foto: null }); }}
                style={{letterSpacing:'0.12em'}}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
        <table className="min-w-full text-base bg-white/90 rounded-2xl shadow-lg border mt-8 overflow-hidden">
          <thead>
            <tr className="bg-gradient-to-r from-green-800 to-green-600 text-white text-base uppercase tracking-wider">
              <th className="px-3 py-3">Foto</th>
              <th className="px-3 py-3">Usuario</th>
              <th className="px-3 py-3">Permisos</th>
              <th className="px-3 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(u => (
              <tr key={u.id} className="border-b hover:bg-green-50/70 transition">
                <td className="px-3 py-2 text-center">
                  <img
                    src={getFoto(u.usuario) + '?v=' + imgKey}
                    alt={u.usuario}
                    className="w-14 h-14 rounded-full object-cover border-2 border-green-400 bg-white mx-auto shadow"
                    onError={e => { e.target.onerror = null; e.target.src = '/Usuarios/default.png'; }}
                  />
                </td>
                <td className="px-3 py-2 text-center font-semibold text-green-900">{u.usuario}</td>
                <td className="px-3 py-2 text-center">
                  {u.permisos.map(p => PERMISOS.find(x => x.key === p)?.label).join(', ')}
                </td>
                <td className="px-3 py-2 text-center flex gap-2 justify-center">
                  <button
                    className="flex items-center gap-2 px-5 py-2 rounded-xl font-medium uppercase text-white bg-gradient-to-br from-blue-600 to-blue-500 border border-blue-700 shadow-md transition-all duration-150 hover:scale-105 hover:brightness-110 hover:shadow-lg active:scale-95 focus:outline-none"
                    style={{fontSize:'1rem', letterSpacing:'0.04em'}}
                    onClick={() => handleEdit(u)}
                  >
                    Editar
                  </button>
                  <button
                    className="flex items-center gap-2 px-5 py-2 rounded-xl font-medium uppercase text-white bg-gradient-to-br from-red-600 to-red-500 border border-red-700 shadow-md transition-all duration-150 hover:scale-105 hover:brightness-110 hover:shadow-lg active:scale-95 focus:outline-none"
                    style={{fontSize:'1rem', letterSpacing:'0.04em'}}
                    onClick={() => handleDelete(u.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal personalizado para eliminar usuario */}
      {modalEliminar && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-10 border-4 border-red-400 max-w-md w-full text-center">
            <h3 className="text-3xl font-extrabold text-red-700 mb-4 tracking-wide uppercase">¿Eliminar usuario?</h3>
            <p className="mb-6 text-gray-700 text-lg">
              ¿Estás seguro de que deseas eliminar al usuario <span className="font-bold text-red-700">{usuarioAEliminar?.usuario}</span>?<br/>
              Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-center gap-6 mt-4">
              <button className="bg-gray-300 text-gray-800 px-8 py-3 rounded-xl font-bold hover:bg-gray-400 transition text-lg border border-gray-400" onClick={cancelarEliminar}>Cancelar</button>
              <button className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-red-700 transition text-lg border border-red-600" onClick={confirmarEliminar}>Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function FotoUsuarioCorporativo({ usuario, imgKey }) {
  const [imgError, setImgError] = useState(false);
  const iniciales = getIniciales(usuario);
  const fotoSrc = getFoto(usuario) + '?v=' + imgKey;
  return imgError || !usuario ? (
    <div
      style={{
        width: '96px',
        height: '96px',
        borderRadius: '50%',
        border: '4px solid #16a34a',
        background: 'linear-gradient(135deg, #e6f4ea 60%, #b6e7c9 100%)',
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        fontSize: '2.5rem',
        fontWeight: 'bold',
        color: '#16a34a',
        marginRight: 16,
        boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.12)'
      }}
    >
      {iniciales}
    </div>
  ) : (
    <img
      src={fotoSrc}
      alt="Foto usuario"
      className="w-24 h-24 rounded-full border-4 border-green-600 shadow-lg object-cover bg-white"
      style={{marginRight:16, background:'#e6f4ea'}}
      onError={() => setImgError(true)}
    />
  );
}

// Función para obtener iniciales (fuera del componente)
function getIniciales(usuario) {
  if (!usuario) return '';
  const partes = usuario.trim().split(/\s+/);
  if (partes.length === 1) return partes[0][0]?.toUpperCase() || '';
  return (partes[0][0] + partes[1][0]).toUpperCase();
}

// Función para obtener la ruta de la foto (fuera del componente)
function getFoto(usuario) {
  if (!usuario) return '/Usuarios/default.png';
  let nombre = String(usuario).trim().toLowerCase();
  nombre = nombre.normalize('NFD').replace(/\u0300-\u036f/g, '').replace(/[^a-z0-9]/g, '');
  return `/Usuarios/${nombre}.png`;
}

export default UsuariosAdmin; 