import React, { useState, useMemo, useEffect } from 'react';
import { Business, Category } from '../types';
import { BusinessList } from '../components/BusinessList';
import { SearchIcon } from '../components/Icons';
import { CategoryFilter } from '../components/CategoryFilter';


interface HomePageProps {
  categories: Category[];
  businesses: Business[];
  getCategoryName: (categoryId: number) => string;
  onSelectBusiness: (business: Business) => void;
  initialFilter: string | number | null;
  clearInitialFilter: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ categories, businesses, getCategoryName, onSelectBusiness, initialFilter, clearInitialFilter }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<number | 'all'>('all');

  useEffect(() => {
    if (initialFilter !== null) {
      if (typeof initialFilter === 'number') {
        setSelectedFilter(initialFilter);
      }
      clearInitialFilter(); // Clear the initial filter after applying it once
    }
  }, [initialFilter, clearInitialFilter]);

  const searchedBusinesses = useMemo(() => {
    if (!searchTerm.trim()) {
      return businesses;
    }
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return businesses.filter(b => 
      b.name.toLowerCase().includes(lowercasedSearchTerm) ||
      b.description.toLowerCase().includes(lowercasedSearchTerm) ||
      b.services.some(s => s.toLowerCase().includes(lowercasedSearchTerm)) ||
      b.products.some(p => p.toLowerCase().includes(lowercasedSearchTerm))
    );
  }, [businesses, searchTerm]);
  
  const featuredBusinesses = useMemo(() => {
    return searchedBusinesses.filter(b => b.isFeatured);
  }, [searchedBusinesses]);

  const categoryFilteredBusinesses = useMemo(() => {
    if (selectedFilter === 'all') {
      return searchedBusinesses;
    }
    return searchedBusinesses.filter(b => b.categoryId === selectedFilter);
  }, [searchedBusinesses, selectedFilter]);


  return (
    <div className="animate-fade-in max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <img 
            src="https://appdesignmex.com/enlaceizcallichica.jpg" 
            alt="Enlace Izcalli" 
            className="w-full md:w-3/4 lg:w-1/2 mx-auto rounded-lg shadow-md"
        />
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mt-6">Tu Guía de Negocios en Izcalli</h1>
        <p className="text-md md:text-lg text-gray-600 mt-2">Encuentra los mejores productos y servicios cerca de ti.</p>
      </div>

      <div className="mb-8 w-full md:w-3/4 lg:w-1/2 mx-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar negocios, productos o servicios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-full focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-shadow bg-gray-100 text-black placeholder-gray-600"
          />
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>
      
      {/* Featured Section */}
      <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center border-b-2 border-red-200 pb-2">
              ⭐ Negocios Destacados
          </h2>
          {featuredBusinesses.length > 0 ? (
            <BusinessList businesses={featuredBusinesses} getCategoryName={getCategoryName} onSelectBusiness={onSelectBusiness} />
          ) : (
            <div className="text-center py-8">
              <p className="text-lg text-gray-500">
                {searchTerm.trim()
                  ? "No se encontraron negocios destacados que coincidan con tu búsqueda."
                  : "No hay negocios destacados en este momento."
                }
              </p>
            </div>
          )}
      </div>

      <CategoryFilter categories={categories} selectedFilter={selectedFilter} onSelectFilter={setSelectedFilter} />
      
      <BusinessList businesses={categoryFilteredBusinesses} getCategoryName={getCategoryName} onSelectBusiness={onSelectBusiness} />
      
      {/* Handle case where search or filter yields no results */}
      {categoryFilteredBusinesses.length === 0 && (
        <div className="text-center py-16">
          <p className="text-lg text-gray-500">No se encontraron negocios que coincidan con tu búsqueda o filtro.</p>
          <p className="text-gray-400 mt-2">Intenta con otros términos o selecciona otra categoría.</p>
        </div>
      )}

    </div>
  );
};