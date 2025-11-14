import React, { useState, useMemo } from 'react';
import { Business } from '../types';
import { ZONES, Zone } from '../constants';
import { BusinessList } from '../components/BusinessList';
import { MapIcon } from '../components/Icons';

/**
 * Calculates the distance between two geographical points using the Haversine formula.
 * @param lat1 Latitude of the first point.
 * @param lon1 Longitude of the first point.
 * @param lat2 Latitude of the second point.
 * @param lon2 Longitude of the second point.
 * @returns The distance in kilometers.
 */
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    0.5 - Math.cos(dLat) / 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    (1 - Math.cos(dLon)) / 2;
  return R * 2 * Math.asin(Math.sqrt(a));
};

interface ZonesPageProps {
  businesses: Business[];
  getCategoryName: (categoryId: number) => string;
  onSelectBusiness: (business: Business) => void;
}

export const ZonesPage: React.FC<ZonesPageProps> = ({ businesses, getCategoryName, onSelectBusiness }) => {
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);

  const businessesInZone = useMemo(() => {
    if (!selectedZone) return [];
    // Filter businesses within a 3km radius of the selected zone's center
    return businesses.filter(business => {
      if (!business.latitude || !business.longitude) return false;
      const distance = getDistance(selectedZone.latitude, selectedZone.longitude, business.latitude, business.longitude);
      return distance < 3; // 3km radius
    });
  }, [selectedZone, businesses]);

  if (selectedZone) {
    return (
      <div className="animate-fade-in max-w-7xl mx-auto">
        <button 
          onClick={() => setSelectedZone(null)}
          className="mb-6 inline-flex items-center text-sm font-semibold text-red-600 hover:text-red-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver a Zonas
        </button>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">{selectedZone.name}</h1>
        <p className="text-slate-600 mb-6">Explorando negocios cerca de {selectedZone.name}.</p>
        
        <div className="mb-8">
          <iframe
            className="w-full h-64 md:h-96 rounded-lg shadow-md border border-slate-200"
            loading="lazy"
            allowFullScreen
            src={`https://maps.google.com/maps?q=${selectedZone.latitude},${selectedZone.longitude}&hl=es;z=${selectedZone.zoom}&amp;output=embed`}
          >
          </iframe>
        </div>
        
        <BusinessList businesses={businessesInZone} getCategoryName={getCategoryName} onSelectBusiness={onSelectBusiness} />
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-7xl mx-auto">
      <div className="text-center">
        <MapIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Explora por Zona</h1>
        <p className="text-center text-slate-600 mb-8">
          Encuentra los mejores comercios seleccionando una de las zonas comerciales clave de Cuautitlán Izcalli.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {ZONES.map(zone => (
          <button
            key={zone.id}
            onClick={() => setSelectedZone(zone)}
            className="group flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm hover:shadow-lg hover:bg-red-600 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <div className="mb-4 p-4 bg-red-100 rounded-full group-hover:bg-white transition-colors duration-300">
              <MapIcon className="w-8 h-8 text-red-600 group-hover:text-red-600 transition-colors duration-300" />
            </div>
            <h3 className="text-center font-semibold text-slate-700 group-hover:text-white transition-colors duration-300">{zone.name}</h3>
          </button>
        ))}
      </div>
    </div>
  );
};