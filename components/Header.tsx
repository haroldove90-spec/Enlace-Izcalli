import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-40 md:hidden">
      <div className="container mx-auto px-4 py-4 flex justify-center items-center">
        <a href="#" className="flex-shrink-0" aria-label="Página de inicio de Enlace Izcalli">
          <img 
            src="https://appdesignmex.com/enlaceizcallidigitall.png" 
            alt="Enlace Izcalli Logo" 
            className="h-[38px] w-auto"
          />
        </a>
      </div>
    </header>
  );
};