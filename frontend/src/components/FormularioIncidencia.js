import React, { useState } from 'react';

const FormularioIncidencia = ({ onCancelar }) => {
  const [fechaInicio, setFechaInicio] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [ampmInicio, setAmpmInicio] = useState('a.m.');
  const [fechaFin, setFechaFin] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [ampmFin, setAmpmFin] = useState('a.m.');
  const [descripcion, setDescripcion] = useState('');
  const [cargando, setCargando] = useState(false);
  const [exito, setExito] = useState(false);
  const [error, setError] = useState('');

  const ampmOptions = ['a.m.', 'p.m.'];

  // Iconos para botones
  const IconoGuardar = () => (
    <span className="inline-flex items-center justify-center w-10 h-10 min-w-[40px] min-h-[40px] bg-blue-600 rounded-lg group hover:bg-blue-700 hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer" style={{boxSizing:'border-box'}}>
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-label="Guardar" title="Guardar">
        <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" fill="none"/>
        <polyline points="17,21 17,13 7,13 7,21" stroke="currentColor" strokeWidth="2" fill="none"/>
        <polyline points="7,3 7,8 15,8" stroke="currentColor" strokeWidth="2" fill="none"/>
      </svg>
    </span>
  );

  const IconoCancelar = () => (
    <span className="inline-flex items-center justify-center w-10 h-10 min-w-[40px] min-h-[40px] bg-white border-2 border-gray-300 rounded-lg group hover:bg-gray-50 hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer" style={{boxSizing:'border-box'}}>
      <svg className="w-6 h-6 text-gray-700 group-hover:text-gray-800" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-label="Cancelar" title="Cancelar">
        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
  );

  return (
    <form className="w-full max-w-lg md:max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-4 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Fecha de Inicio</label>
        <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} className="w-full p-2 rounded-md border border-gray-300 bg-white text-base text-gray-700 shadow-sm focus:outline-none" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Hora de Inicio</label>
        <input type="text" placeholder="Ejemplo: 09:00" value={horaInicio} onChange={e => setHoraInicio(e.target.value)} className="w-full p-2 rounded-md border border-gray-300 bg-white text-base text-gray-700 shadow-sm focus:outline-none" maxLength={5} pattern="^(0[1-9]|1[0-2]):[0-5][0-9]$" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">AM/PM</label>
        <select value={ampmInicio} onChange={e => setAmpmInicio(e.target.value)} className="w-full p-2 rounded-md border border-gray-300 bg-white text-base text-gray-700 shadow-sm focus:outline-none">
          {ampmOptions.map(opt => <option key={opt}>{opt}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Fecha de Fin</label>
        <input type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} className="w-full p-2 rounded-md border border-gray-300 bg-white text-base text-gray-700 shadow-sm focus:outline-none" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Hora de Fin</label>
        <input type="text" placeholder="Ejemplo: 10:30" value={horaFin} onChange={e => setHoraFin(e.target.value)} className="w-full p-2 rounded-md border border-gray-300 bg-white text-base text-gray-700 shadow-sm focus:outline-none" maxLength={5} pattern="^(0[1-9]|1[0-2]):[0-5][0-9]$" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">AM/PM</label>
        <select value={ampmFin} onChange={e => setAmpmFin(e.target.value)} className="w-full p-2 rounded-md border border-gray-300 bg-white text-base text-gray-700 shadow-sm focus:outline-none">
          {ampmOptions.map(opt => <option key={opt}>{opt}</option>)}
        </select>
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción de la Incidencia</label>
        <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder="Describa la incidencia o problema con el mayor detalle posible" className="w-full min-h-[60px] p-2 rounded-md border border-gray-300 bg-white text-base text-gray-700 shadow-sm focus:outline-none resize-y" />
      </div>
      {/* Botones */}
      <div className="col-span-1 md:col-span-2 flex justify-end space-x-4 mt-8 w-full">
        <button type="button" onClick={onCancelar} className="flex items-center justify-center" disabled={cargando} title="Cancelar">
          <IconoCancelar />
        </button>
        <button type="submit" className="flex items-center justify-center" disabled={cargando} title={cargando ? 'Guardando...' : 'Guardar'}>
          <IconoGuardar />
        </button>
      </div>
    </form>
  );
};

export default FormularioIncidencia; 