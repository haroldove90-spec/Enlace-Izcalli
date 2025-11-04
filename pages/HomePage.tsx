
import React, { useState, useMemo } from 'react';
import { Business, Category } from '../types';
import { CategoryFilter } from '../components/CategoryFilter';
import { BusinessList } from '../components/BusinessList';
import { SearchIcon } from '../components/Icons';

interface HomePageProps {
  categories: Category[];
  businesses: Business[];
  getCategoryName: (categoryId: number) => string;
}

export const HomePage: React.FC<HomePageProps> = ({ categories, businesses, getCategoryName }) => {
  const [selectedFilter, setSelectedFilter] = useState<string | number>('featured');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBusinesses = useMemo(() => {
    let result = businesses;

    if (selectedFilter === 'featured') {
      result = result.filter(b => b.isFeatured);
    } else if (typeof selectedFilter === 'number') {
      result = result.filter(b => b.categoryId === selectedFilter);
    }

    if (searchTerm) {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      result = result.filter(b => 
        b.name.toLowerCase().includes(lowercasedSearchTerm) ||
        b.description.toLowerCase().includes(lowercasedSearchTerm) ||
        b.services.some(s => s.toLowerCase().includes(lowercasedSearchTerm)) ||
        b.products.some(p => p.toLowerCase().includes(lowercasedSearchTerm))
      );
    }
    
    return result;
  }, [businesses, selectedFilter, searchTerm]);

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <img 
            src="https://appdesignmex.com/enlaceizcallichica.jpg" 
            alt="Enlace Izcalli" 
            className="w-full max-w-lg mx-auto rounded-lg shadow-md"
        />
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mt-6">Tu Guía de Negocios en Izcalli</h1>
        <p className="text-md md:text-lg text-gray-600 mt-2">Encuentra los mejores productos y servicios cerca de ti.</p>
      </div>

      <div className="mb-8 max-w-2xl mx-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar negocios, productos o servicios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-full focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-shadow"
          />
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>
      
      <CategoryFilter 
        categories={categories}
        selectedFilter={selectedFilter}
        onSelectFilter={setSelectedFilter}
      />
      
      <BusinessList businesses={filteredBusinesses} getCategoryName={getCategoryName} />
    </div>
  );
};
