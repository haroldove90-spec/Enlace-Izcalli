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

      <div className="w-full border-t pt-8 mt-4">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Nuestra Próxima Expansión</h2>
        <p className="text-gray-600 mb-6">
          ¡Llevaremos Enlace a más municipios! Próximamente podrás encontrar negocios en:
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <span className="bg-gray-200 text-gray-800 text-sm font-medium px-4 py-2 rounded-full">Tecámac</span>
          <span className="bg-gray-200 text-gray-800 text-sm font-medium px-4 py-2 rounded-full">Coacalco</span>
          <span className="bg-gray-200 text-gray-800 text-sm font-medium px-4 py-2 rounded-full">Tlalnepantla</span>
          <span className="bg-gray-200 text-gray-800 text-sm font-medium px-4 py-2 rounded-full">Ecatepec</span>
          <span className="bg-gray-200 text-gray-800 text-sm font-medium px-4 py-2 rounded-full">Tultitlán</span>
          <span className="bg-gray-200 text-gray-800 text-sm font-medium px-4 py-2 rounded-full">Tultepec</span>
        </div>
      </div>
    </div>
  );
};
