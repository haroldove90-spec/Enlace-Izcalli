import React from 'react';
import { MapIcon } from '../components/Icons';

export const ZonesPage: React.FC = () => {
  return (
    <div className="text-center flex flex-col items-center justify-center h-full max-w-2xl mx-auto animate-fade-in">
      <MapIcon className="w-24 h-24 text-red-400 mb-6" />
      <h1 className="text-4xl font-bold text-gray-800 mb-3">Explora Negocios por Zona</h1>
      <p className="text-lg text-gray-600 mb-8">
        Estamos trabajando para traerte una nueva forma de descubrir los mejores comercios
        cerca de ti. Podrás explorar por colonias y centros comerciales de Cuautitlán Izcalli.
      </p>
      <div className="bg-red-100 text-red-800 font-semibold px-6 py-3 rounded-full">
        ¡Próximamente!
      </div>
    </div>
  );
};
