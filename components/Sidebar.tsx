import React from 'react';
import { HomeIcon, CategoryIcon, MegaphoneIcon, MapIcon, ShieldCheckIcon } from './Icons';
import { View } from '../App';

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const navLinks: { id: View; name: string; icon: React.FC<any> }[] = [
  { id: 'home', name: 'Home', icon: HomeIcon },
  { id: 'categories', name: 'Categorias', icon: CategoryIcon },
  { id: 'advertise', name: 'Anunciate', icon: MegaphoneIcon },
  { id: 'zones', name: 'Zonas', icon: MapIcon },
  { id: 'adminDashboard', name: 'Admin', icon: ShieldCheckIcon },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 sticky top-0 h-screen">
      <div className="flex items-center justify-center p-6 border-b border-gray-200">
        <a href="#" onClick={() => setActiveView('home')} aria-label="Página de inicio de Enlace Izcalli">
          <img 
            src="https://appdesignmex.com/enlaceizcallidigitall.png" 
            alt="Enlace Izcalli Logo" 
            className="h-12 w-auto"
          />
        </a>
      </div>
      <nav className="flex-1 px-4 py-6">
        <ul>
          {navLinks.map((link) => (
            <li key={link.id}>
              <button 
                onClick={() => setActiveView(link.id)}
                className={`w-full flex items-center px-4 py-3 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 hover:text-red-600 transition-colors duration-200 text-left ${activeView.startsWith('admin') && link.id.startsWith('admin') ? 'bg-red-50 text-red-600' : activeView === link.id ? 'bg-red-50 text-red-600' : ''}`}
              >
                <link.icon className="w-6 h-6 mr-3" />
                <span>{link.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};