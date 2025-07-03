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
    <div className="pl-8">
      <h1 className="text-2xl font-bold mb-4">Incidencias</h1>
      <div className="overflow-x-auto">
        <table className="w-full max-w-[1230px]">
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

export default FormularioIncidencia; 