import { useContext, useRef, useEffect } from 'react';
import { FaTachometerAlt, FaTicketAlt, FaExclamationTriangle, FaDatabase, FaUsers, FaSignOutAlt } from 'react-icons/fa';
// Suponiendo que tienes un contexto de autenticación
import { AuthContext } from '../App';

const menuItems = [
  { icon: <FaTachometerAlt />, label: 'Dashboard', key: 'dashboard' },
  { icon: <FaTicketAlt />, label: 'Tickets', key: 'tickets' },
  { icon: <FaExclamationTriangle />, label: 'Incidencias', key: 'incidencias' },
  { icon: <FaDatabase />, label: 'Backup Correos', key: 'backup' },
  { icon: <FaUsers />, label: 'Usuarios', key: 'usuarios' },
];

export default function Sidebar({ expanded, setExpanded, setSeccion, seccion }) {
  const { user } = useContext(AuthContext); // user: { nombre, usuario }
  const foto = user?.usuario ? `/Usuarios/${user.usuario}.png` : null;
  const sidebarRef = useRef();

  // Colapsar sidebar al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setExpanded(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setExpanded]);

  return (
    <aside ref={sidebarRef} className={`bg-[#22304A] text-white shadow-lg transition-all duration-300 ${expanded ? 'w-64' : 'w-20'} flex flex-col`} style={{height: '100vh'}}>
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-2 w-full">
          {foto ? (
            <img src={foto} alt="Foto de perfil" className="w-14 h-14 rounded-full object-cover border-4 border-white shadow-lg" />
          ) : (
            <FaUsers className="text-3xl" />
          )}
          {expanded && (
            <div className="ml-2">
              <div className="font-semibold text-sm">Bienvenido,</div>
              <div className="font-bold text-base">{user?.nombre || 'Usuario'}</div>
            </div>
          )}
        </div>
      </div>
      <nav className="flex-1 mt-4">
        {menuItems.map((item, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-4 px-4 py-3 cursor-pointer transition-all rounded-md mx-2 ${seccion === item.key ? 'bg-[#1a2336] font-bold' : 'hover:bg-[#1a2336]'}`}
            onClick={() => { setExpanded(true); setSeccion(item.key); }}
          >
            <span className="text-lg">{item.icon}</span>
            {expanded && <span className="text-base font-medium">{item.label}</span>}
          </div>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10 mt-auto">
        <button className="flex items-center gap-2 w-full text-left hover:text-red-400">
          <FaSignOutAlt />
          {expanded && <span>Cerrar sesión</span>}
        </button>
      </div>
    </aside>
  );
} 