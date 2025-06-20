import React from 'react';

const colores = {
  total: 'bg-green-600',
  altas: 'bg-red-500',
  medias: 'bg-yellow-400',
  bajas: 'bg-gray-400',
};

const ResumenTickets = ({ total, altas, medias, bajas }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 my-8">
    <div className={`rounded-lg shadow p-6 text-white ${colores.total}`}>
      <div className="text-3xl font-bold">{total}</div>
      <div className="text-lg">Total Tickets</div>
    </div>
    <div className={`rounded-lg shadow p-6 text-white ${colores.altas}`}>
      <div className="text-3xl font-bold">{altas}</div>
      <div className="text-lg">Prioridad Alta</div>
    </div>
    <div className={`rounded-lg shadow p-6 text-white ${colores.medias}`}>
      <div className="text-3xl font-bold">{medias}</div>
      <div className="text-lg">Prioridad Media</div>
    </div>
    <div className={`rounded-lg shadow p-6 text-white ${colores.bajas}`}>
      <div className="text-3xl font-bold">{bajas}</div>
      <div className="text-lg">Prioridad Baja</div>
    </div>
  </div>
);

export default ResumenTickets; 