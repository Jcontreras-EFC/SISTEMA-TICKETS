import React from 'react';

const Navbar = ({ onSelect, seccion, permisos = [] }) => (
  <nav className="flex items-center justify-between bg-green-700 px-6 py-3 shadow text-white">
    <div className="flex items-center gap-3">
      <img
        src="/logo.png"
        alt="Logo EFC"
        className="h-12 mr-2"
        style={{ objectFit: 'contain' }}
      />
      <span className="text-xl font-bold tracking-wide">Electro Ferro Centro S.A.C</span>
    </div>
    <div className="flex gap-6">
      {permisos.includes('tickets') && (
        <button onClick={() => onSelect('tickets')} className={`hover:text-green-200 font-semibold ${seccion === 'tickets' ? 'underline' : ''}`}>Gestión de tickets</button>
      )}
      {permisos.includes('base') && (
        <button onClick={() => onSelect('base')} className={`hover:text-green-200 font-semibold ${seccion === 'base' ? 'underline' : ''}`}>Base de datos</button>
      )}
      {permisos.includes('dashboard') && (
        <button onClick={() => onSelect('dashboard')} className={`hover:text-green-200 font-semibold ${seccion === 'dashboard' ? 'underline' : ''}`}>Dashboards/Reportes</button>
      )}
      {permisos.includes('usuarios') && (
        <button onClick={() => onSelect('usuarios')} className={`hover:text-green-200 font-semibold ${seccion === 'usuarios' ? 'underline' : ''}`}>Administrar usuarios</button>
      )}
    </div>
  </nav>
);

export default Navbar;