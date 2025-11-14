import React from 'react';
import { HomeIcon, CategoryIcon, MegaphoneIcon, MapIcon, MapPinIcon, ChartBarIcon, PlusCircleIcon, TagIcon, UsersIcon, BriefcaseIcon } from './Icons';
import { View, UserRole } from '../types';

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
  currentUserRole: UserRole;
  setCurrentUserRole: (role: UserRole) => void;
}

const userNavLinks: { id: View; name: string; icon: React.FC<any> }[] = [
  { id: 'home', name: 'Home', icon: HomeIcon },
  { id: 'categories', name: 'Categorias', icon: CategoryIcon },
  { id: 'notifications', name: 'Notificaciones', icon: MegaphoneIcon },
  { id: 'zones', name: 'Zonas', icon: MapIcon },
  { id: 'map', name: 'Mapa', icon: MapPinIcon },
];

const adminNavLinks: { id: View; name: string; icon: React.FC<any> }[] = [
  { id: 'adminDashboard', name: 'Dashboard', icon: ChartBarIcon },
  { id: 'adminAddBusiness', name: 'Añadir Negocio', icon: PlusCircleIcon },
  { id: 'adminManageBusinesses', name: 'Negocios', icon: BriefcaseIcon },
  { id: 'adminManageCategories', name: 'Categorías', icon: TagIcon },
  { id: 'adminClients', name: 'Clientes', icon: UsersIcon },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, currentUserRole, setCurrentUserRole }) => {
  const navLinks = currentUserRole === 'admin' ? adminNavLinks : userNavLinks;

  const handleRoleChange = () => {
    const newRole = currentUserRole === 'user' ? 'admin' : 'user';
    setCurrentUserRole(newRole);
    setActiveView(newRole === 'admin' ? 'adminDashboard' : 'home');
  };

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 sticky top-0 h-screen">
      <div className="flex items-center justify-center p-6 border-b border-gray-200">
        <button onClick={() => setActiveView('home')} aria-label="Página de inicio de Enlace Izcalli">
          <img 
            src="https://appdesignmex.com/enlaceizcallidigitall.png" 
            alt="Enlace Izcalli Logo" 
            className="h-12 w-auto"
          />
        </button>
      </div>
      <nav className="flex-1 px-4 py-6">
        <ul>
          {navLinks.map((link) => (
            <li key={link.id}>
              <button 
                onClick={() => setActiveView(link.id)}
                className={`w-full flex items-center px-4 py-3 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 hover:text-red-600 transition-colors duration-200 text-left ${activeView === link.id ? 'bg-red-50 text-red-600' : ''}`}
              >
                <link.icon className="w-6 h-6 mr-3" />
                <span>{link.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-2 bg-gray-100 p-2 rounded-lg">
          <span className="text-sm font-medium text-gray-600">Vista: {currentUserRole === 'user' ? 'Usuario' : 'Admin'}</span>
          <button onClick={handleRoleChange} className="text-sm text-red-600 hover:text-red-800 font-semibold focus:outline-none">Cambiar</button>
        </div>
      </div>
    </aside>
  );
};