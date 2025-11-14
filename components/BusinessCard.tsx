import React from 'react';
import { Business } from '../types';
import { PhoneIcon, WhatsAppIcon, WebsiteIcon, ShareIcon, MapPinIcon, EnvelopeIcon } from './Icons';
import { StarRating } from './StarRating';

interface BusinessCardProps {
  business: Business;
  categoryName: string;
  onSelect?: (business: Business) => void;
  isDetailPage?: boolean;
}

const InfoTag: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="bg-slate-100 text-slate-600 text-xs font-medium mr-2 mb-2 px-2.5 py-1 rounded-full">
    {children}
  </span>
);

export const BusinessCard: React.FC<BusinessCardProps> = ({ business, categoryName, onSelect, isDetailPage = false }) => {
  const handleShare = async () => {
    const shareData = {
      title: business.name,
      text: `${business.description} - ¡Encuéntralo en Enlace Izcalli!`,
      url: window.location.href,
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

  const formatWebsiteUrl = (url: string): string => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }
    return `https://${url}`;
  };
  
  const getMapLink = (): string | null => {
    if (business.googleMapsUrl && business.googleMapsUrl.startsWith('http')) {
        return business.googleMapsUrl;
    }
    if (business.latitude !== 0 || business.longitude !== 0) {
        return `https://www.google.com/maps/search/?api=1&query=${business.latitude},${business.longitude}`;
    }
    return null;
  };
  
  const getWhatsAppLink = (whatsappNumber: string): string | null => {
    if (!whatsappNumber) return null;
    let sanitized = whatsappNumber.replace(/[^0-9]/g, '');
    if (sanitized.length === 10) {
      sanitized = `52${sanitized}`;
    } else if (sanitized.startsWith('521') && sanitized.length === 12) {
      sanitized = `52${sanitized.substring(3)}`;
    }
    if (sanitized.length > 0) {
      return `https://wa.me/${sanitized}`;
    }
    return null;
  };

  const websiteUrl = formatWebsiteUrl(business.website);
  const mapLink = getMapLink();
  const whatsappLink = getWhatsAppLink(business.whatsapp);
  const { reviews = [], averageRating = 0 } = business;
  
  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-full ${!isDetailPage && 'hover:shadow-xl transition-shadow duration-300'}`}>
      <div className="p-6 flex-grow">
        <div className="flex items-start space-x-4 mb-4">
          <img 
            src={business.logoUrl} 
            alt={`${business.name} logo`}
            className="w-20 h-20 rounded-full object-cover border-4 border-slate-100 flex-shrink-0"
          />
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-600 uppercase tracking-wide">{categoryName}</p>
            <h3 className="text-xl font-bold text-slate-800">{business.name}</h3>
            <div className="flex items-center mt-1">
              {reviews.length > 0 ? (
                <>
                  <StarRating rating={averageRating} />
                  <span className="text-xs text-slate-500 ml-2">
                    {averageRating.toFixed(1)} ({reviews.length} {reviews.length === 1 ? 'reseña' : 'reseñas'})
                  </span>
                </>
              ) : (
                 <span className="text-xs text-slate-500">Sin reseñas</span>
              )}
            </div>
          </div>
        </div>
        
        <p className="text-slate-600 text-sm mb-5">{business.description}</p>
        
        {business.services.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold text-slate-700 text-sm mb-2">Servicios:</h4>
            <div className="flex flex-wrap">
              {business.services.map((service, index) => <InfoTag key={index}>{service}</InfoTag>)}
            </div>
          </div>
        )}
        
        {business.products.length > 0 && (
          <div>
            <h4 className="font-semibold text-slate-700 text-sm mb-2">Productos:</h4>
            <div className="flex flex-wrap">
              {business.products.map((product, index) => <InfoTag key={index}>{product}</InfoTag>)}
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-slate-50 p-4 mt-auto border-t border-slate-200">
        <div className="flex justify-around items-center">
          {business.phone ? (
            <a href={`tel:${business.phone}`} title="Llamar" className="text-slate-500 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-100">
              <PhoneIcon className="w-6 h-6" />
            </a>
          ) : (
            <span title="Llamar (no disponible)" className="text-slate-300 cursor-not-allowed p-2">
              <PhoneIcon className="w-6 h-6" />
            </span>
          )}

          {whatsappLink ? (
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" title="WhatsApp" className="text-slate-500 hover:text-green-500 transition-colors p-2 rounded-full hover:bg-green-100">
              <WhatsAppIcon className="w-6 h-6" />
            </a>
          ) : (
            <span title="WhatsApp (no disponible)" className="text-slate-300 cursor-not-allowed p-2">
              <WhatsAppIcon className="w-6 h-6" />
            </span>
          )}

          {business.ownerEmail ? (
            <a href={`mailto:${business.ownerEmail}`} title="Enviar Correo" className="text-slate-500 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-blue-100">
              <EnvelopeIcon className="w-6 h-6" />
            </a>
          ) : (
            <span title="Enviar Correo (no disponible)" className="text-slate-300 cursor-not-allowed p-2">
              <EnvelopeIcon className="w-6 h-6" />
            </span>
          )}

          {websiteUrl ? (
            <a href={websiteUrl} target="_blank" rel="noopener noreferrer" title="Sitio Web" className="text-slate-500 hover:text-slate-900 transition-colors p-2 rounded-full hover:bg-slate-200">
              <WebsiteIcon className="w-6 h-6" />
            </a>
          ) : (
            <span title="Sitio Web (no disponible)" className="text-slate-300 cursor-not-allowed p-2">
              <WebsiteIcon className="w-6 h-6" />
            </span>
          )}

          {mapLink ? (
            <a href={mapLink} target="_blank" rel="noopener noreferrer" title="Ver en Mapa" className="text-slate-500 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-100">
              <MapPinIcon className="w-6 h-6" />
            </a>
          ) : (
            <span title="Ver en Mapa (no disponible)" className="text-slate-300 cursor-not-allowed p-2">
              <MapPinIcon className="w-6 h-6" />
            </span>
          )}

          <button onClick={handleShare} title="Compartir" className="text-slate-500 hover:text-blue-500 transition-colors p-2 rounded-full hover:bg-blue-100">
            <ShareIcon className="w-6 h-6" />
          </button>
        </div>
      </div>

       {!isDetailPage && (
        <div className="p-4 border-t border-slate-100 bg-white">
          <button 
            onClick={() => onSelect?.(business)}
            className="w-full text-center bg-red-50 text-red-600 font-semibold py-3 px-4 rounded-lg hover:bg-red-100 transition-colors duration-200"
          >
            Ver Más y Reseñas
          </button>
        </div>
      )}
    </div>
  );
};