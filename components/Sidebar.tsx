import React from 'react';
import { HomeIcon, CategoryIcon, MegaphoneIcon, MapIcon } from './Icons';

const navLinks = [
  { name: 'Home', href: '#', icon: HomeIcon },
  { name: 'Categorias', href: '#', icon: CategoryIcon },
  { name: 'Anunciate', href: '#', icon: MegaphoneIcon },
  { name: 'Zonas', href: '#', icon: MapIcon },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 sticky top-0 h-screen">
      <div className="flex items-center justify-center p-6 border-b border-gray-200">
        <a href="#" aria-label="Página de inicio de Enlace Izcalli">
          <img 
            src="https://appdesignmex.com/enlaceizcallidigitall.png" 
            alt="Enlace Izcalli Logo" 
            className="h-12 w-auto"
          />
        </a>
      </div>
      <nav className="flex-1 px-4 py-6">
        <ul>
          {navLinks.map((link, index) => (
            <li key={link.name}>
              <a 
                href={link.href}
                className={`flex items-center px-4 py-3 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 hover:text-blue-600 transition-colors duration-200 ${index === 0 ? 'bg-blue-50 text-blue-600' : ''}`}
              >
                <link.icon className="w-6 h-6 mr-3" />
                <span>{link.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};