import React, { useState, useMemo } from 'react';
import { Business, Category } from '../types';
import { SearchIcon } from '../components/Icons';
import { StarRating } from '../components/StarRating';

// Default center for the map when no business is selected
const IZCALLI_CENTER = { lat: 19.6503, lng: -99.2155, zoom: 14 };

// A compact list item for the map view
const MapBusinessListItem: React.FC<{
  business: Business;
  isActive: boolean;
  onSelect: () => void;
  onViewDetails: () => void;
}> = ({ business, isActive, onSelect, onViewDetails }) => {
  return (
    <div 
      className={`p-4 border-b border-gray-200 cursor-pointer transition-colors duration-200 ${isActive ? 'bg-red-50' : 'bg-white hover:bg-gray-50'}`}
      onClick={onSelect}
    >
      <h3 className="font-bold text-gray-800">{business.name}</h3>
      <p className="text-sm text-gray-500 truncate">{business.address}</p>
      <div className="flex items-center mt-1">
        {business.reviews.length > 0 ? (
          <>
            <StarRating rating={business.averageRating} className="h-4 w-4" />
            <span className="text-xs text-gray-500 ml-2">
              {business.averageRating.toFixed(1)} ({business.reviews.length})
            </span>
          </>
        ) : (
          <span className="text-xs text-gray-400">Sin reseñas</span>
        )}
      </div>
      <button 
        onClick={(e) => {
            e.stopPropagation(); // prevent onSelect from firing again
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
      // Category filter
      const categoryMatch = selectedCategory === 'all' || b.categoryId === selectedCategory;

      // Search term filter
      const searchMatch = !searchTerm || (
        b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.services.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
        b.products.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      
      // Must have coordinates to be on the map
      const hasCoordinates = b.latitude !== 0 || b.longitude !== 0;

      return categoryMatch && searchMatch && hasCoordinates;
    });
  }, [businesses, searchTerm, selectedCategory]);

  const mapUrl = useMemo(() => {
    const activeBusiness = businesses.find(b => b.id === activeBusinessId);
    if (activeBusiness) {
      return `https://maps.google.com/maps?q=${activeBusiness.latitude},${activeBusiness.longitude}&hl=es&z=17&amp;output=embed`;
    }
    return `https://maps.google.com/maps?q=${IZCALLI_CENTER.lat},${IZCALLI_CENTER.lng}&hl=es&z=${IZCALLI_CENTER.zoom}&amp;output=embed`;
  }, [activeBusinessId, businesses]);

  return (
    <div className="animate-fade-in h-full flex flex-col md:flex-row overflow-hidden bg-white">
      {/* --- Left Pane: Filters & List --- */}
      <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col border-r border-gray-200 order-2 md:order-1">
        {/* Filters */}
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Filtrar Mapa</h2>
          {/* Search */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-full focus:ring-1 focus:ring-red-500 focus:border-red-500 bg-gray-50 text-black placeholder-gray-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
             <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${selectedCategory === 'all' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Todos
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${selectedCategory === cat.id ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
        {/* Business List */}
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
                <p className="p-4 text-center text-gray-500">No se encontraron resultados.</p>
            )}
        </div>
      </div>

      {/* --- Right Pane: Map --- */}
      <div className="w-full md:w-2/3 lg:w-3/4 h-1/2 md:h-full order-1 md:order-2 flex-grow">
         <iframe
            key={mapUrl} // key is important to force re-render on src change
            className="w-full h-full border-0"
            loading="lazy"
            allowFullScreen
            src={mapUrl}
          >
          </iframe>
      </div>
    </div>
  );
};