import React from 'react';
import { MegaphoneIcon } from '../components/Icons';

export const AdvertisePage: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto animate-fade-in">
      <div className="text-center">
        <MegaphoneIcon className="w-16 h-16 mx-auto text-blue-600 mb-4" />
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">Haz Crecer Tu Negocio en Izcalli</h1>
        <p className="text-xl text-gray-600 mb-8">Únete a la plataforma líder que conecta comercios locales con miles de clientes.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 text-center my-12">
        <div>
          <h3 className="text-2xl font-bold text-gray-700 mb-2">Mayor Visibilidad</h3>
          <p className="text-gray-600">Llega a clientes que buscan activamente productos y servicios en tu zona.</p>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-700 mb-2">Conexión Directa</h3>
          <p className="text-gray-600">Facilita que te contacten por teléfono, WhatsApp o visiten tu sitio web.</p>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-700 mb-2">Resultados Medibles</h3>
          <p className="text-gray-600">Obtén estadísticas y entiende el impacto de tu presencia en nuestro directorio.</p>
        </div>
      </div>

      <div className="text-center mt-10">
        <a 
          href="mailto:ventas@enlaceizcalli.com"
          className="bg-red-600 text-white font-bold py-4 px-10 rounded-full text-lg hover:bg-red-700 transition-transform transform hover:scale-105 duration-300 inline-block shadow-lg"
        >
          ¡Quiero Anunciarme!
        </a>
      </div>
    </div>
  );
};