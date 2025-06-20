import React, { useState, useEffect } from 'react';

const agentes = [
  'Jerry Contreras',
  'Jesús Murrugarra',
  'Alonso Quispe',
];

const sedes = ['Surquillo', 'Chorrillos'];
const categorias = ['Software', 'Hardware', 'Redes', 'Otros'];
const prioridades = ['Alta', 'Media', 'Baja'];

const agentePorUsuario = {
  'Jmurrugarra': 'Jesús Murrugarra',
  'Jcontreras': 'Jerry Contreras',
  'Aquispe': 'Alonso Quispe',
};

const FormularioTicket = ({ contador, onRegistrar, fecha: fechaProp, sede: sedeProp, categoria: categoriaProp, usuario: usuarioProp, asunto: asuntoProp, agente: agenteProp, descripcion: descripcionProp, prioridad: prioridadProp, usuarioLogueado }) => {
  const [contadorState, setContadorState] = useState(contador);
  const [fecha, setFecha] = useState(fechaProp || new Date().toISOString().slice(0, 10));
  const [sede, setSede] = useState(sedeProp || sedes[0]);
  const [categoria, setCategoria] = useState(categoriaProp || '');
  const [usuario, setUsuario] = useState(usuarioProp || '');
  const [asunto, setAsunto] = useState(asuntoProp || '');
  const [exito, setExito] = useState(false);
  const [prioridad, setPrioridad] = useState(prioridadProp || prioridades[0]);
  const [hora, setHora] = useState(() => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const [descripcion, setDescripcion] = useState(descripcionProp || '');
  const [showMenu, setShowMenu] = useState(false);
  const [modal, setModal] = useState(null); // { accion: 'agregar'|'eliminar', tipo: null|'sede'|'categoria'|'prioridad'|'agente' }
  const [nuevoValor, setNuevoValor] = useState('');
  const [opcionEliminar, setOpcionEliminar] = useState('');

  // Normalizar usuarioLogueado a minúsculas para comparación
  const usuarioKey = (usuarioLogueado || '').toLowerCase();
  const agentePorUsuarioLower = {
    'jmurrugarra': 'Jesús Murrugarra',
    'jcontreras': 'Jerry Contreras',
    'aquispe': 'Alonso Quispe',
  };

  // Si el usuario logueado es uno de los agentes, forzar el agente correspondiente
  const agenteInicial = agentePorUsuarioLower[usuarioKey] || agenteProp || agentes[0];
  const [agente, setAgente] = useState(agenteInicial);

  useEffect(() => {
    setContadorState(contador);
    setFecha(fechaProp || new Date().toISOString().slice(0, 10));
    setSede(sedeProp || sedes[0]);
    setCategoria(categoriaProp || '');
    setUsuario(usuarioProp || '');
    setAsunto(asuntoProp || '');
    setPrioridad(prioridadProp || prioridades[0]);
  }, [contador, fechaProp, sedeProp, categoriaProp, usuarioProp, asuntoProp, agenteProp, descripcionProp, prioridadProp]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const horaActual = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    // Si el usuario logueado es uno de los agentes, forzar el agente correspondiente SIEMPRE
    const agenteFinal = agentePorUsuarioLower[usuarioKey] || agente;
    onRegistrar({ fecha, hora: horaActual, sede, categoria, usuario, asunto, agente: agenteFinal, descripcion, prioridad });
    setExito(true);
    setCategoria(''); setUsuario(''); setAsunto(''); setDescripcion('');
    setTimeout(() => setExito(false), 2000);
  };

  // Función para abrir el modal de selección de tipo
  const abrirModal = (accion) => {
    setModal({accion, tipo: null});
    setNuevoValor('');
    setOpcionEliminar('');
    setShowMenu(false);
  };

  // Función para agregar nueva opción
  const handleAgregar = () => {
    if (!nuevoValor.trim()) return;
    if (modal.tipo === 'sede' && !sedes.includes(nuevoValor)) {
      sedes.push(nuevoValor);
      setSede(nuevoValor);
    }
    if (modal.tipo === 'categoria' && !categorias.includes(nuevoValor)) {
      categorias.push(nuevoValor);
      setCategoria(nuevoValor);
    }
    if (modal.tipo === 'prioridad' && !prioridades.includes(nuevoValor)) {
      prioridades.push(nuevoValor);
      setPrioridad(nuevoValor);
    }
    if (modal.tipo === 'agente' && !agentes.includes(nuevoValor)) {
      agentes.push(nuevoValor);
      setAgente(nuevoValor);
    }
    setModal(null);
    setNuevoValor('');
  };

  // Función para eliminar opción
  const handleEliminar = () => {
    if (!opcionEliminar) return;
    if (modal.tipo === 'sede' && sedes.length > 1) {
      const idx = sedes.indexOf(opcionEliminar);
      if (idx !== -1) sedes.splice(idx, 1);
      if (sede === opcionEliminar) setSede(sedes[0]);
    }
    if (modal.tipo === 'categoria' && categorias.length > 1) {
      const idx = categorias.indexOf(opcionEliminar);
      if (idx !== -1) categorias.splice(idx, 1);
      if (categoria === opcionEliminar) setCategoria(categorias[0]);
    }
    if (modal.tipo === 'prioridad' && prioridades.length > 1) {
      const idx = prioridades.indexOf(opcionEliminar);
      if (idx !== -1) prioridades.splice(idx, 1);
      if (prioridad === opcionEliminar) setPrioridad(prioridades[0]);
    }
    if (modal.tipo === 'agente' && agentes.length > 1) {
      const idx = agentes.indexOf(opcionEliminar);
      if (idx !== -1) agentes.splice(idx, 1);
      if (agente === opcionEliminar) setAgente(agentes[0]);
    }
    setModal(null);
    setOpcionEliminar('');
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
        paddingTop: '0',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #e0f2f1 0%, #f1f8e9 100%)',
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
          backgroundImage: 'url("/tickets.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'blur(6px) grayscale(0.18)',
          zIndex: 0,
        }}
      />
      {/* Overlay degradado más notorio */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(120deg, rgba(22,163,74,0.10) 0%, rgba(37,99,235,0.10) 100%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
      <div
        className="max-w-3xl w-full rounded-3xl shadow-2xl px-10 py-10 mt-8 border border-green-300"
        style={{
          background: 'rgba(255,255,255,0.88)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          boxShadow: '0 16px 48px 0 rgba(31, 38, 135, 0.18)',
          position: 'relative',
          zIndex: 2,
          border: '2.5px solid #16a34a',
        }}
      >
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-4xl font-extrabold text-green-800 text-center tracking-wide drop-shadow-lg uppercase flex-1" style={{letterSpacing:'0.08em', textShadow:'0 2px 8px #b6e7c9'}}>Registrar Ticket</h2>
          <div className="relative ml-4">
            <img
              src="/formulario.png"
              alt="Agregar o eliminar opciones"
              className="w-14 h-14 cursor-pointer hover:scale-110 transition-transform drop-shadow-lg"
              title="Agregar o eliminar opción"
              onClick={() => setShowMenu(v => !v)}
              style={{borderRadius:'16px', border:'2px solid #16a34a', background:'#fff'}}
            />
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-green-200 z-50 animate-fade-in">
                <button className="block w-full text-left px-5 py-4 hover:bg-green-50 text-green-800 font-bold text-lg" onClick={() => abrirModal('agregar')}>+ Agregar</button>
                <button className="block w-full text-left px-5 py-4 hover:bg-red-50 text-red-700 font-bold text-lg" onClick={() => abrirModal('eliminar')}>- Eliminar</button>
              </div>
            )}
          </div>
        </div>
        {/* Modal para seleccionar tipo y luego agregar/eliminar */}
        {modal && !modal.tipo && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-green-400 max-w-sm w-full text-center animate-fade-in">
              <h3 className="text-2xl font-bold text-green-700 mb-6">¿Qué deseas {modal.accion === 'agregar' ? 'agregar' : 'eliminar'}?</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <button className="bg-green-100 hover:bg-green-200 text-green-900 font-semibold py-3 rounded-lg shadow" onClick={() => setModal(m => ({...m, tipo:'sede'}))}>Sede</button>
                <button className="bg-green-100 hover:bg-green-200 text-green-900 font-semibold py-3 rounded-lg shadow" onClick={() => setModal(m => ({...m, tipo:'categoria'}))}>Categoría</button>
                <button className="bg-green-100 hover:bg-green-200 text-green-900 font-semibold py-3 rounded-lg shadow" onClick={() => setModal(m => ({...m, tipo:'prioridad'}))}>Prioridad</button>
                <button className="bg-green-100 hover:bg-green-200 text-green-900 font-semibold py-3 rounded-lg shadow" onClick={() => setModal(m => ({...m, tipo:'agente'}))}>Agente</button>
              </div>
              <button className="mt-2 px-6 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300" onClick={() => setModal(null)}>Cancelar</button>
            </div>
          </div>
        )}
        {modal && modal.accion === 'agregar' && modal.tipo && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-green-400 max-w-sm w-full text-center animate-fade-in">
              <h3 className="text-2xl font-bold text-green-700 mb-4">Agregar nueva {modal.tipo.charAt(0).toUpperCase() + modal.tipo.slice(1)}</h3>
              <input
                type="text"
                className="w-full px-4 py-3 border-2 border-green-200 rounded-lg mb-6 text-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder={`Ingrese nueva ${modal.tipo}`}
                value={nuevoValor}
                onChange={e => setNuevoValor(e.target.value)}
                autoFocus
              />
              <div className="flex justify-center gap-4 mt-2">
                <button className="bg-green-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-800 transition" onClick={handleAgregar}>Agregar</button>
                <button className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-semibold hover:bg-gray-400 transition" onClick={() => { setModal(null); setNuevoValor(''); }}>Cancelar</button>
              </div>
            </div>
          </div>
        )}
        {modal && modal.accion === 'eliminar' && modal.tipo && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-red-400 max-w-sm w-full text-center animate-fade-in">
              <h3 className="text-2xl font-bold text-red-700 mb-4">Eliminar {modal.tipo.charAt(0).toUpperCase() + modal.tipo.slice(1)}</h3>
              <select
                className="w-full px-4 py-3 border-2 border-red-200 rounded-lg mb-6 text-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                value={opcionEliminar}
                onChange={e => setOpcionEliminar(e.target.value)}
                autoFocus
              >
                {(modal.tipo === 'sede' ? sedes : modal.tipo === 'categoria' ? categorias : modal.tipo === 'prioridad' ? prioridades : agentes).map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <div className="flex justify-center gap-4 mt-2">
                <button className="bg-red-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-800 transition" onClick={handleEliminar} disabled={(modal.tipo === 'sede' && sedes.length <= 1) || (modal.tipo === 'categoria' && categorias.length <= 1) || (modal.tipo === 'prioridad' && prioridades.length <= 1) || (modal.tipo === 'agente' && agentes.length <= 1)}>Eliminar</button>
                <button className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-semibold hover:bg-gray-400 transition" onClick={() => { setModal(null); setOpcionEliminar(''); }}>Cancelar</button>
              </div>
            </div>
          </div>
        )}
        <form className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-green-900 font-semibold mb-1">N° Ticket</label>
            <input type="text" value={contadorState} disabled className="mt-1 w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-700 font-bold shadow-sm" />
          </div>
          <div>
            <label className="block text-green-900 font-semibold mb-1">Fecha</label>
            <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-lg bg-green-50 text-gray-700 shadow-sm" required />
          </div>
          <div>
            <label className="block text-green-900 font-semibold mb-1">Sede</label>
            <select value={sede} onChange={e => setSede(e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-lg bg-green-50 text-gray-700 shadow-sm">
              {sedes.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-green-900 font-semibold mb-1">Categoría</label>
            <select value={categoria} onChange={e => setCategoria(e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-lg bg-green-50 text-gray-700 shadow-sm" required>
              <option value="">Selecciona una categoría</option>
              {categorias.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-green-900 font-semibold mb-1">Prioridad</label>
            <select value={prioridad} onChange={e => setPrioridad(e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-lg bg-green-50 text-gray-700 shadow-sm" required>
              {prioridades.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-green-900 font-semibold mb-1">Usuario</label>
            <input type="text" value={usuario} onChange={e => setUsuario(e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-lg bg-gray-50 text-gray-700 shadow-sm" required placeholder="Nombre del usuario" />
          </div>
          <div>
            <label className="block text-green-900 font-semibold mb-1">Asunto</label>
            <input type="text" value={asunto} onChange={e => setAsunto(e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-lg bg-gray-50 text-gray-700 shadow-sm" required placeholder="Motivo del ticket" />
          </div>
          <div>
            <label className="block text-green-900 font-semibold mb-1">Agente</label>
            {agentePorUsuarioLower[usuarioKey] ? (
              <input
                type="text"
                value={agentePorUsuarioLower[usuarioKey]}
                readOnly
                disabled
                className="mt-1 w-full px-3 py-2 border rounded-lg bg-green-100 font-bold cursor-not-allowed text-green-900 shadow-sm"
                style={{fontWeight:'bold'}}
              />
            ) : (
              <select value={agente} onChange={e => setAgente(e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-lg bg-green-50 text-gray-700 shadow-sm">
                {agentes.map(a => <option key={a}>{a}</option>)}
              </select>
            )}
          </div>
          <div className="md:col-span-3">
            <label className="block text-green-900 font-semibold mb-1">Descripción</label>
            <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-lg bg-gray-50 text-gray-700 shadow-sm" required placeholder="Describe el problema o solicitud..." />
          </div>
          <div className="md:col-span-3 flex justify-center mt-2">
            <button type="submit" className="bg-green-700 text-white py-3 px-10 rounded-xl font-bold shadow-lg hover:bg-green-800 transition text-lg tracking-wide border-2 border-green-800 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400">
              Registrar Ticket
            </button>
          </div>
        </form>
        {exito && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
            <div className="bg-white p-6 rounded shadow text-green-700 text-lg font-bold border border-green-600">
              ¡Ticket registrado con éxito!
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormularioTicket; 