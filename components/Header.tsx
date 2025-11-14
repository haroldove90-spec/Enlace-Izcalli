import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40 md:hidden">
      <div className="container mx-auto px-4 py-3 flex justify-center items-center">
        <a href="#" className="flex-shrink-0" aria-label="Página de inicio de Enlace Izcalli">
          <img 
            src="https://appdesignmex.com/enlaceizcallidigitall.png" 
            alt="Enlace Izcalli Logo" 
            className="h-10 w-auto"
          />
        </a>
      </div>
    </header>
  );
};