import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { CategoryFilter } from './components/CategoryFilter';
import { BusinessList } from './components/BusinessList';
import { BUSINESSES, CATEGORIES } from './constants';
import { Business, Category } from './types';

const App: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<string | number>('featured');

  const sortedCategories = useMemo(() => 
    [...CATEGORIES].sort((a, b) => a.name.localeCompare(b.name)), 
  []);

  const filteredBusinesses = useMemo(() => {
    if (selectedFilter === 'featured') {
      return BUSINESSES.filter(business => business.isFeatured);
    }
    return BUSINESSES.filter(business => business.categoryId === selectedFilter);
  }, [selectedFilter]);

  const getCategoryName = (categoryId: number): string => {
    return CATEGORIES.find(cat => cat.id === categoryId)?.name || 'Sin Categoría';
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <CategoryFilter 
          categories={sortedCategories}
          selectedFilter={selectedFilter}
          onSelectFilter={setSelectedFilter}
        />
        <BusinessList 
          businesses={filteredBusinesses} 
          getCategoryName={getCategoryName}
        />
      </main>
      <footer className="text-center py-6 bg-gray-800 text-white">
        <p>&copy; {new Date().getFullYear()} Enlace Izcalli. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default App;
