import React from 'react';
import { HomeIcon, CategoryIcon, MegaphoneIcon, MapIcon } from './Icons';

const navLinks = [
  { name: 'Home', href: '#', icon: HomeIcon },
  { name: 'Categorias', href: '#', icon: CategoryIcon },
  { name: 'Anunciate', href: '#', icon: MegaphoneIcon },
  { name: 'Zonas', href: '#', icon: MapIcon },
];

export const BottomNav: React.FC = () => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-red-600 shadow-t-lg z-50">
      <div className="flex justify-around items-center h-16">
        {navLinks.map((link, index) => (
          <a
            key={link.name}
            href={link.href}
            className={`flex flex-col items-center justify-center text-center w-full px-2 py-1 transition-colors duration-200 ${index === 0 ? 'text-white' : 'text-red-200'} hover:text-white`}
            aria-label={link.name}
          >
            <link.icon className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">{link.name}</span>
          </a>
        ))}
      </div>
    </nav>
  );
};