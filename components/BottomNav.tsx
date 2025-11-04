import React from 'react';
import { HomeIcon, CategoryIcon, MegaphoneIcon, MapIcon } from './Icons';

type View = 'home' | 'categories' | 'advertise' | 'zones';

interface BottomNavProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const navLinks: { id: View; name:string; href: string; icon: React.FC<any> }[] = [
  { id: 'home', name: 'Home', href: '#', icon: HomeIcon },
  { id: 'categories', name: 'Categorias', href: '#', icon: CategoryIcon },
  { id: 'advertise', name: 'Anunciate', href: '#', icon: MegaphoneIcon },
  { id: 'zones', name: 'Zonas', href: '#', icon: MapIcon },
];

export const BottomNav: React.FC<BottomNavProps> = ({ activeView, setActiveView }) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-red-600 shadow-t-lg z-50">
      <div className="flex justify-around items-center h-16">
        {navLinks.map((link) => (
          <button
            key={link.id}
            onClick={() => setActiveView(link.id)}
            className={`flex flex-col items-center justify-center text-center w-full px-2 py-1 transition-all duration-200 transform focus:outline-none ${activeView === link.id ? 'text-white scale-110' : 'text-red-200'} hover:text-white`}
            aria-label={link.name}
          >
            <link.icon className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">{link.name}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};