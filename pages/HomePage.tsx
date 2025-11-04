import React, { useState, useMemo } from 'react';
import { CategoryFilter } from '../components/CategoryFilter';
import { BusinessList } from '../components/BusinessList';
import { Business, Category } from '../types';
import { CATEGORIES, BUSINESSES } from '../constants';


interface HomePageProps {
  businesses: Business[];
  categories: Category[];
}

export const HomePage: React.FC<HomePageProps> = ({ businesses, categories }) => {
  const [selectedFilter, setSelectedFilter] = useState<string | number>('featured');

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

  return (
    <>
      <img 
        src="https://appdesignmex.com/enlaceizcallichica.jpg" 
        alt="Banner principal de Enlace Izcalli"
        className="w-full h-auto object-cover rounded-xl shadow-lg mb-12"
      />
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