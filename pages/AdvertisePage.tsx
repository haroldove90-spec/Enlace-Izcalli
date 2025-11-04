import React from 'react';
import { WhatsAppIcon } from '../components/Icons';

export const AdvertisePage: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto animate-fade-in">
      <div className="text-center">
        <img 
            src="https://appdesignmex.com/enlaceizcalli.png" 
            alt="Enlace Izcalli Logo" 
            className="h-20 w-auto mx-auto mb-6"
        />
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

      <div className="my-12">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Nuestros Planes</h2>
        <div className="max-w-2xl mx-auto grid sm:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-lg p-8 border border-gray-200 text-center transform hover:scale-105 transition-transform duration-300">
                <h3 className="text-2xl font-semibold text-gray-700 mb-3">Anuncio Estándar</h3>
                <p className="text-5xl font-bold text-gray-900 mb-2">$400</p>
                <p className="text-gray-600 font-medium">pesos mensuales</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-8 border-2 border-red-500 text-center transform hover:scale-105 transition-transform duration-300 shadow-lg">
                <span className="inline-block bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase mb-3">Recomendado</span>
                <h3 className="text-2xl font-semibold text-red-600 mb-3">Anuncio Destacado</h3>
                <p className="text-5xl font-bold text-gray-900 mb-2">$600</p>
                <p className="text-gray-600 font-medium">pesos mensuales</p>
            </div>
        </div>
      </div>

      <div className="text-center mt-12">
        <a 
          href="https://wa.me/5215624222449?text=Quiero%20promocionar%20mi%20negocio%20en%20Enlace%20Izcalli"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 text-white font-bold py-4 px-10 rounded-full text-lg hover:bg-green-600 transition-transform transform hover:scale-105 duration-300 inline-flex items-center justify-center shadow-lg"
        >
          <WhatsAppIcon className="w-7 h-7 mr-3" />
          Quiero anunciarme
        </a>
      </div>
    </div>
  );
};