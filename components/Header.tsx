import React, { useState } from 'react';
import { MenuIcon, XIcon } from './Icons';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Categorias', href: '#' },
    { name: 'Anunciate', href: '#' },
    { name: 'Zonas', href: '#' },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <a href="#" className="flex-shrink-0" aria-label="Página de inicio de Enlace Izcalli">
          <img 
            src="https://appdesignmex.com/enlaceizcallidigitall.png" 
            alt="Enlace Izcalli Logo" 
            className="h-[38px] w-auto"
          />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="text-gray-700 font-semibold hover:text-blue-600 transition-colors duration-200"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="text-gray-700 focus:outline-none p-2"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu (collapsible) */}
      <div className={`transition-all duration-300 ease-in-out md:hidden ${isMenuOpen ? 'max-h-96 block' : 'max-h-0 hidden'}`}>
        <nav className="flex flex-col items-center px-4 pt-2 pb-4 space-y-2 border-t border-gray-200">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="text-gray-700 font-semibold block w-full text-center py-2 rounded-md hover:bg-gray-100 hover:text-blue-600 transition-colors duration-200"
            >
              {link.name}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
};