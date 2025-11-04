import React, { useState, useMemo } from 'react';
import { CategoryFilter } from '../components/CategoryFilter';
import { BusinessList } from '../components/BusinessList';
import { Business, Category } from '../types';
import { LocationMarkerIcon } from '../components/Icons';

interface HomePageProps {
  businesses: Business[];
  categories: Category[];
}

export const HomePage: React.FC<HomePageProps> = ({ businesses, categories }) => {
  const [selectedFilter, setSelectedFilter] = useState<string | number>('featured');
  const [locationStatus, setLocationStatus] = useState('idle');

  const sortedCategories = useMemo(() => 
    [...categories].sort((a, b) => a.name.localeCompare(b.name)), 
  [categories]);

  const filteredBusinesses = useMemo(() => {
    if (selectedFilter === 'featured') {
      return businesses.filter(business => business.isFeatured);
    }
    return businesses.filter(business => business.categoryId === selectedFilter);
  }, [selectedFilter, businesses]);

  const getCategoryName = (categoryId: number): string => {
    return categories.find(cat => cat.id === categoryId)?.name || 'Sin Categoría';
  }

  const handleLocationClick = () => {
    setLocationStatus('loading');
    if (!navigator.geolocation) {
      alert('La geolocalización no es soportada por tu navegador.');
      setLocationStatus('error');
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('User Location:', position.coords.latitude, position.coords.longitude);
        alert(`Ubicación obtenida: Lat ${position.coords.latitude.toFixed(4)}, Lon ${position.coords.longitude.toFixed(4)}`);
        setLocationStatus('success');
        // Here you would typically filter businesses based on location
      },
      () => {
        alert('No se pudo obtener tu ubicación. Asegúrate de haber otorgado los permisos.');
        setLocationStatus('error');
      }
    );
  };

  return (
    <>
      <img 
        src="https://appdesignmex.com/enlaceizcallichica.jpg" 
        alt="Banner principal de Enlace Izcalli"
        className="w-full h-auto object-cover rounded-xl shadow-lg mb-8"
      />

      <div className="flex justify-center mb-12">
        <button
          onClick={handleLocationClick}
          disabled={locationStatus === 'loading'}
          className="bg-white border border-red-600 text-red-600 font-semibold py-2 px-6 rounded-full inline-flex items-center hover:bg-red-600 hover:text-white transition-colors duration-300 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LocationMarkerIcon className="w-5 h-5 mr-2" />
          {locationStatus === 'loading' ? 'Buscando...' : 'Encontrar negocios cerca de mí'}
        </button>
      </div>

      <CategoryFilter 
        categories={sortedCategories}
        selectedFilter={selectedFilter}
        onSelectFilter={setSelectedFilter}
      />
      <BusinessList 
        businesses={filteredBusinesses} 
        getCategoryName={getCategoryName}
      />
    </>
  );
};
