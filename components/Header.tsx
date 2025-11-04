import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-center items-center">
        <img 
          src="https://appdesignmex.com/enlaceizcallidigitall.png" 
          alt="Enlace Izcalli Logo" 
          className="h-[38px] w-auto"
        />
      </div>
    </header>
  );
};
