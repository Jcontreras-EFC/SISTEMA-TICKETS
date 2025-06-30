import { useContext } from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import { AuthContext } from '../App';

export default function Navbar() {
  const { user } = useContext(AuthContext); // user: { nombre, usuario }
  const foto = user?.usuario ? `/Usuarios/${user.usuario}.png` : null;
  return (
    <header className="w-full bg-gray-50 h-14 flex items-center justify-end px-6 shadow-sm rounded-b-lg z-30" style={{position:'relative'}}>
      <span className="mr-2 font-semibold text-gray-700 hidden sm:inline">{user?.nombre}</span>
      {foto && <img src={foto} alt="Foto de perfil" className="w-12 h-12 rounded-full object-cover border-4 border-gray-300 shadow-lg mr-2" />}
      <button className="text-gray-500 hover:text-red-500 text-xl">
        <FaSignOutAlt />
      </button>
    </header>
  );
}