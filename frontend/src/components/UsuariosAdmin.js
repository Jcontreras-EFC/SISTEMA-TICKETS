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
    fetch('http://192.168.12.66:3001/api/usuarios')
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
        await fetch('http://192.168.12.66:3001/api/usuarios/foto', {
          method: 'POST',
          body: data
        });
      }
      const url = editId
        ? `http://192.168.12.66:3001/api/usuarios/${editId}`
        : 'http://192.168.12.66:3001/api/usuarios';
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
    fetch(`http://192.168.12.66:3001/api/usuarios/${usuarioAEliminar.id}`, { method: 'DELETE' })
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
    <div className="pl-8">
      <h1 className="text-2xl font-bold mb-4">Usuarios</h1>
      <div className="overflow-x-auto">
        <table className="w-full max-w-2xl">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-4 py-2">Columna 1</th>
              <th className="px-4 py-2">Columna 2</th>
              <th className="px-4 py-2">Columna 3</th>
            </tr>
          </thead>
          <tbody>
            <tr className="odd:bg-white even:bg-blue-50">
              <td className="px-4 py-2">Dato 1</td>
              <td className="px-4 py-2">Dato 2</td>
              <td className="px-4 py-2">Dato 3</td>
            </tr>
            <tr className="odd:bg-white even:bg-blue-50">
              <td className="px-4 py-2">Dato 4</td>
              <td className="px-4 py-2">Dato 5</td>
              <td className="px-4 py-2">Dato 6</td>
            </tr>
          </tbody>
        </table>
      </div>
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