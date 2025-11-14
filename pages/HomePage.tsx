import React, { useState, useMemo } from 'react';
import { Business, Category } from '../types';
import { BusinessList } from '../components/BusinessList';
import { SearchIcon } from '../components/Icons';

interface HomePageProps {
  categories: Category[];
  businesses: Business[];
  getCategoryName: (categoryId: number) => string;
  onSelectBusiness: (business: Business) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ categories, businesses, getCategoryName, onSelectBusiness }) => {
  const [searchTerm, setSearchTerm] = useState('');

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

  const nonFeaturedBusinesses = useMemo(() => {
    return searchedBusinesses.filter(b => !b.isFeatured);
  }, [searchedBusinesses]);

  const businessesByCategory = useMemo(() => {
    const grouped: { [categoryId: number]: Business[] } = {};
    nonFeaturedBusinesses.forEach(business => {
      if (!grouped[business.categoryId]) {
        grouped[business.categoryId] = [];
      }
      grouped[business.categoryId].push(business);
    });
    return grouped;
  }, [nonFeaturedBusinesses]);

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

      <div className="mb-12 w-full md:w-3/4 lg:w-1/2 mx-auto">
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
      
      <div className="space-y-16">
        {/* Featured Section */}
        {featuredBusinesses.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-red-500 flex items-center">
              <span className="mr-3 text-yellow-400 text-3xl">⭐</span>
              Destacados
            </h2>
            <BusinessList businesses={featuredBusinesses} getCategoryName={getCategoryName} onSelectBusiness={onSelectBusiness} />
          </section>
        )}

        {/* Sections per category */}
        {categories.map(category => {
          const categoryBusinesses = businessesByCategory[category.id];
          if (!categoryBusinesses || categoryBusinesses.length === 0) {
            return null; // Don't render empty categories
          }
          return (
            <section key={category.id}>
              <h2 className="text-3xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-gray-200">{category.name}</h2>
              <BusinessList businesses={categoryBusinesses} getCategoryName={getCategoryName} onSelectBusiness={onSelectBusiness} />
            </section>
          );
        })}
        
        {/* Handle case where search yields no results */}
        {searchedBusinesses.length === 0 && searchTerm && (
          <div className="text-center py-16">
            <p className="text-lg text-gray-500">No se encontraron negocios que coincidan con tu búsqueda.</p>
            <p className="text-gray-400 mt-2">Intenta con otros términos.</p>
          </div>
        )}
      </div>
    </div>
  );
};