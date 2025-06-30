import React, { useState, useEffect } from 'react';

const agentes = [
  'Jerry Contreras',
  'Jesús Murrugarra',
  'Alonso Quispe',
];

const sedes = ['Surquillo', 'Chorrillos'];
const categorias = ['Software', 'Hardware', 'Redes', 'Otros'];
const prioridades = ['Alta', 'Media', 'Baja'];
const areas = ['Soporte', 'Redes', 'Sistemas', 'Administración'];

const agentePorUsuario = {
  'Jmurrugarra': 'Jesús Murrugarra',
  'Jcontreras': 'Jerry Contreras',
  'Aquispe': 'Alonso Quispe',
};

const FormularioTicket = ({ contador, onRegistrar, fecha: fechaProp, sede: sedeProp, categoria: categoriaProp, usuario: usuarioProp, asunto: asuntoProp, agente: agenteProp, descripcion: descripcionProp, prioridad: prioridadProp, usuarioLogueado, area: areaProp }) => {
  const [contadorState, setContadorState] = useState(contador);
  const [fecha, setFecha] = useState(fechaProp || new Date().toISOString().slice(0, 10));
  const [sede, setSede] = useState(sedeProp || sedes[0]);
  const [categoria, setCategoria] = useState(categoriaProp || 'Software');
  const [usuario, setUsuario] = useState(usuarioProp || '');
  const [asunto, setAsunto] = useState(asuntoProp || '');
  const [exito, setExito] = useState(false);
  const [prioridad, setPrioridad] = useState(prioridadProp || 'Media');
  const [hora, setHora] = useState(() => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const [descripcion, setDescripcion] = useState(descripcionProp || '');
  const [showMenu, setShowMenu] = useState(false);
  const [modal, setModal] = useState(null); // { accion: 'agregar'|'eliminar', tipo: null|'sede'|'categoria'|'prioridad'|'agente' }
  const [nuevoValor, setNuevoValor] = useState('');
  const [opcionEliminar, setOpcionEliminar] = useState('');
  const [area, setArea] = useState(areaProp || areas[0]);

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
    setCategoria(categoriaProp || 'Software');
    setUsuario(usuarioProp || '');
    setAsunto(asuntoProp || '');
    setPrioridad(prioridadProp || 'Media');
    setArea(areaProp || areas[0]);
  }, [contador, fechaProp, sedeProp, categoriaProp, usuarioProp, asuntoProp, agenteProp, descripcionProp, prioridadProp, areaProp]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const horaActual = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const agenteFinal = agentePorUsuarioLower[usuarioKey] || agente;
    onRegistrar({ fecha, hora: horaActual, sede, area, categoria, usuario, asunto, agente: agenteFinal, descripcion, prioridad });
    setExito(true);
    setCategoria('Software'); setUsuario(''); setAsunto(''); setDescripcion(''); setArea(areas[0]); setPrioridad('Media');
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
    <>
      <form className="w-full flex flex-col pt-0 pb-8 px-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-left">Registrar Ticket</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {/* Nº Ticket */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nº Ticket</label>
            <input
              type="text"
              value={contadorState}
              readOnly
              disabled
              className="w-full p-2 rounded-md border border-gray-300 bg-white text-base font-semibold text-gray-700 shadow-sm focus:outline-none"
            />
          </div>
          {/* Fecha */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Fecha</label>
            <input
              type="date"
              value={fecha}
              readOnly
              disabled
              className="w-full p-2 rounded-md border border-gray-300 bg-white text-base text-gray-700 shadow-sm focus:outline-none"
            />
          </div>
          {/* Sede */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Sede</label>
            <select
              value={sede}
              onChange={e => setSede(e.target.value)}
              className="w-full p-2 rounded-md border border-gray-300 bg-white text-base text-gray-700 shadow-sm focus:outline-none"
            >
              <option>Surquillo</option>
              <option>Chorrillos</option>
            </select>
          </div>
          {/* Área */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Área</label>
            <input
              type="text"
              value={area}
              onChange={e => setArea(e.target.value)}
              className="w-full p-2 rounded-md border border-gray-300 bg-white text-base text-gray-700 shadow-sm focus:outline-none"
            />
          </div>
          {/* Categoría */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Categoría</label>
            <select
              value={categoria}
              onChange={e => setCategoria(e.target.value)}
              className="w-full p-2 rounded-md border border-gray-300 bg-white text-base text-gray-700 shadow-sm focus:outline-none"
            >
              <option>Software</option>
              <option>Hardware</option>
              <option>Redes</option>
              <option>Otros</option>
            </select>
          </div>
          {/* Prioridad */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Prioridad</label>
            <select
              value={prioridad}
              onChange={e => setPrioridad(e.target.value)}
              className="w-full p-2 rounded-md border border-gray-300 bg-white text-base text-gray-700 shadow-sm focus:outline-none"
            >
              <option>Alta</option>
              <option>Media</option>
              <option>Baja</option>
            </select>
          </div>
          {/* Usuario */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Usuario</label>
            <input
              type="text"
              value={usuario}
              onChange={e => setUsuario(e.target.value)}
              className="w-full p-2 rounded-md border border-gray-300 bg-white text-base text-gray-700 shadow-sm focus:outline-none"
            />
          </div>
          {/* Agente */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Agente</label>
            <input
              type="text"
              value={agente}
              readOnly
              disabled
              className="w-full p-2.5 rounded-md border border-gray-300 bg-white text-base font-semibold text-gray-700 focus:outline-none"
            />
          </div>
          {/* Asunto */}
          <div className="md:col-span-2 lg:col-span-3">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Asunto</label>
            <input
              type="text"
              value={asunto}
              onChange={e => setAsunto(e.target.value)}
              className="w-full p-2 rounded-md border border-gray-300 bg-white text-base text-gray-700 shadow-sm focus:outline-none"
            />
          </div>
        </div>
        {/* Cuarta fila: Descripción del problema */}
        <div className="grid grid-cols-1 gap-6 w-full mt-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción del problema</label>
            <textarea
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              className="w-full min-h-[60px] p-2 rounded-md border border-gray-300 bg-white text-base text-gray-700 shadow-sm focus:outline-none resize-y"
            />
          </div>
        </div>
        {/* Botones */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-end space-x-4 mt-8 w-full">
          <button
            type="button"
            className="bg-white text-gray-700 px-5 py-2 rounded-md font-semibold border border-gray-300 shadow-sm hover:bg-gray-100 transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold shadow-sm hover:bg-blue-700 transition"
          >
            Enviar
          </button>
        </div>
      </form>
    </>
  );
};

export default FormularioTicket; 