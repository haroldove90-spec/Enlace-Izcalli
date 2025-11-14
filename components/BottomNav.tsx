import React from 'react';
import { HomeIcon, MapPinIcon, UserCircleIcon, StarOutlineIcon } from './Icons';
import { View } from '../types';

interface BottomNavProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const userNavLinks: { id: View; name:string; icon: React.FC<any> }[] = [
  { id: 'home', name: 'Inicio', icon: HomeIcon },
  { id: 'map', name: 'Mapa', icon: MapPinIcon },
  { id: 'favorites', name: 'Favoritos', icon: StarOutlineIcon },
  { id: 'profile', name: 'Perfil', icon: UserCircleIcon },
];


export const BottomNav: React.FC<BottomNavProps> = ({ activeView, setActiveView }) => {
  const navLinks = userNavLinks;
  
  const gridColsClass = `grid-cols-${navLinks.length}`;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-red-600 z-50">
      <div className={`grid ${gridColsClass} h-16`}>
        {navLinks.map((link) => {
            const isActive = activeView === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveView(link.id)}
                className={`flex flex-col items-center justify-center text-center w-full px-1 py-1 transition-colors duration-200 focus:outline-none ${isActive ? 'text-white' : 'text-white/70'} hover:text-white`}
                aria-label={link.name}
              >
                <link.icon className="w-6 h-6 mb-1" />
                <span className={`text-xs font-medium ${isActive ? 'font-bold' : ''}`}>{link.name}</span>
              </button>
            )
        })}
      </div>
    </nav>
  );
};