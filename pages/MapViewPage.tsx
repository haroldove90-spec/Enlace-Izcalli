import React, { useState, useMemo } from 'react';
import { Business, Category } from '../types';
import { SearchIcon } from '../components/Icons';
import { StarRating } from '../components/StarRating';

const IZCALLI_CENTER = { lat: 19.6503, lng: -99.2155, zoom: 14 };

const MapBusinessListItem: React.FC<{
  business: Business;
  isActive: boolean;
  onSelect: () => void;
  onViewDetails: () => void;
}> = ({ business, isActive, onSelect, onViewDetails }) => {
  return (
    <div 
      className={`p-4 border-b border-slate-200 cursor-pointer transition-colors duration-200 ${isActive ? 'bg-red-50' : 'bg-white hover:bg-slate-50'}`}
      onClick={onSelect}
    >
      <h3 className="font-bold text-slate-800">{business.name}</h3>
      <p className="text-sm text-slate-500 truncate">{business.address}</p>
      <div className="flex items-center mt-1">
        {business.reviews.length > 0 ? (
          <>
            <StarRating rating={business.averageRating} className="h-4 w-4" />
            <span className="text-xs text-slate-500 ml-2">
              {business.averageRating.toFixed(1)} ({business.reviews.length})
            </span>
          </>
        ) : (
          <span className="text-xs text-slate-400">Sin reseñas</span>
        )}
      </div>
      <button 
        onClick={(e) => {
            e.stopPropagation();
            onViewDetails();
        }} 
        className="text-sm text-red-600 hover:text-red-800 font-semibold mt-2"
      >
        Ver detalles
      </button>
    </div>
  );
};


interface MapViewPageProps {
  businesses: Business[];
  categories: Category[];
  onSelectBusiness: (business: Business) => void;
}

export const MapViewPage: React.FC<MapViewPageProps> = ({ businesses, categories, onSelectBusiness }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
  const [activeBusinessId, setActiveBusinessId] = useState<number | null>(null);

  const filteredBusinesses = useMemo(() => {
    return businesses.filter(b => {
      const categoryMatch = selectedCategory === 'all' || b.categoryId === selectedCategory;
      const searchMatch = !searchTerm || (
        b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.services.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
        b.products.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      const hasCoordinates = b.latitude !== 0 || b.longitude !== 0;
      return categoryMatch && searchMatch && hasCoordinates;
    });
  }, [businesses, searchTerm, selectedCategory]);

  const mapUrl = useMemo(() => {
    const activeBusiness = businesses.find(b => b.id === activeBusinessId);
    if (activeBusiness) {
      return `https://maps.google.com/maps?q=${activeBusiness.latitude},${activeBusiness.longitude}&hl=es&z=17&amp;output=embed`;
    }
    // Create a URL with all filtered business markers
    const markers = filteredBusinesses.map(b => `&q=${b.latitude},${b.longitude}(${encodeURIComponent(b.name)})`).join('');
    return `https://maps.google.com/maps?q=${IZCALLI_CENTER.lat},${IZCALLI_CENTER.lng}&hl=es&z=${IZCALLI_CENTER.zoom}&amp;output=embed` + markers;

  }, [activeBusinessId, businesses, filteredBusinesses]);

  return (
    <div className="flex-grow flex flex-col">
      {/* Header Section */}
      <div className="px-6 py-8 text-white">
        <h1 className="text-3xl font-black uppercase tracking-wide">Mapa Interactivo</h1>
        <p className="text-white/80 mt-1">Encuentra negocios cerca de ti.</p>
      </div>

      {/* Content Section (white card) */}
      <div className="flex-grow bg-white rounded-t-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden pb-16 md:pb-0">
        {/* --- Left Pane: Filters & List --- */}
        <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col border-r border-slate-200 order-2 md:order-1 h-1/2 md:h-full">
          {/* Filters */}
          <div className="p-4 border-b border-slate-200 flex-shrink-0">
            <h2 className="text-lg font-bold text-slate-800 mb-3">Filtrar Mapa</h2>
            <div className="relative mb-3">
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-slate-300 rounded-full focus:ring-1 focus:ring-red-500 focus:border-red-500 bg-slate-50 text-slate-900 placeholder-slate-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-slate-400" />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${selectedCategory === 'all' ? 'bg-red-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
              >
                Todos
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${selectedCategory === cat.id ? 'bg-red-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-grow overflow-y-auto">
              {filteredBusinesses.length > 0 ? (
                  filteredBusinesses.map(business => (
                      <MapBusinessListItem 
                          key={business.id}
                          business={business}
                          isActive={business.id === activeBusinessId}
                          onSelect={() => setActiveBusinessId(business.id)}
                          onViewDetails={() => onSelectBusiness(business)}
                      />
                  ))
              ) : (
                  <p className="p-4 text-center text-slate-500">No se encontraron resultados.</p>
              )}
          </div>
        </div>

        {/* --- Right Pane: Map --- */}
        <div className="w-full md:w-2/3 lg:w-3/4 h-1/2 md:h-full order-1 md:order-2 flex-grow">
           <iframe
              key={mapUrl}
              className="w-full h-full border-0"
              loading="lazy"
              allowFullScreen
              src={mapUrl}
            >
            </iframe>
        </div>
      </div>
    </div>
  );
};