import React from 'react';
import { Business } from '../types';
import { PhoneIcon, WhatsAppIcon, WebsiteIcon, ShareIcon, MapPinIcon } from './Icons';

interface BusinessCardProps {
  business: Business;
  categoryName: string;
}

const InfoTag: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="bg-gray-200 text-gray-700 text-xs font-semibold mr-2 mb-2 px-2.5 py-0.5 rounded-full">
    {children}
  </span>
);

export const BusinessCard: React.FC<BusinessCardProps> = ({ business, categoryName }) => {
  const handleShare = async () => {
    const shareData = {
      title: business.name,
      text: `${business.description} - ¡Encuéntralo en Enlace Izcalli!`,
      url: window.location.href, // Could be a specific URL for the business if available
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        alert('La función de compartir no está disponible en este navegador.');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const mapLink = business.googleMapsUrl && business.googleMapsUrl.startsWith('http')
    ? business.googleMapsUrl
    : `https://www.google.com/maps/search/?api=1&query=${business.latitude},${business.longitude}`;
  
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full transform hover:scale-105 transition-transform duration-300">
      <div className="p-6 flex-grow">
        <div className="flex items-start space-x-4 mb-4">
          <img 
            src={business.logoUrl} 
            alt={`${business.name} logo`}
            className="w-20 h-20 rounded-full object-cover border-4 border-gray-100 flex-shrink-0"
          />
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-600">{categoryName}</p>
            <h3 className="text-xl font-bold text-gray-800">{business.name}</h3>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-4">{business.description}</p>
        
        {business.services.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold text-gray-700 text-sm mb-2">Servicios:</h4>
            <div className="flex flex-wrap">
              {business.services.map((service, index) => <InfoTag key={index}>{service}</InfoTag>)}
            </div>
          </div>
        )}
        
        {business.products.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-700 text-sm mb-2">Productos:</h4>
            <div className="flex flex-wrap">
              {business.products.map((product, index) => <InfoTag key={index}>{product}</InfoTag>)}
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-gray-50 p-4 mt-auto border-t border-gray-200">
        <div className="flex justify-around items-center">
          <a href={`tel:${business.phone}`} title="Llamar" className="text-gray-600 hover:text-red-600 transition-colors">
            <PhoneIcon className="w-6 h-6" />
          </a>
          <a href={`https://wa.me/${business.whatsapp}`} target="_blank" rel="noopener noreferrer" title="WhatsApp" className="text-gray-600 hover:text-green-500 transition-colors">
            <WhatsAppIcon className="w-6 h-6" />
          </a>
          <a href={business.website} target="_blank" rel="noopener noreferrer" title="Sitio Web" className="text-gray-600 hover:text-gray-900 transition-colors">
            <WebsiteIcon className="w-6 h-6" />
          </a>
           <a href={mapLink} target="_blank" rel="noopener noreferrer" title="Ver en Mapa" className="text-gray-600 hover:text-red-600 transition-colors">
            <MapPinIcon className="w-6 h-6" />
          </a>
          <button onClick={handleShare} title="Compartir" className="text-gray-600 hover:text-blue-500 transition-colors">
            <ShareIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};