import React from 'react';
import { Category } from '../types';

interface CategoryFilterProps {
  categories: Category[];
  selectedFilter: number | 'all';
  onSelectFilter: (filter: number | 'all') => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, selectedFilter, onSelectFilter }) => {
  const baseClasses = "px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 whitespace-nowrap";
  const activeClasses = "bg-red-600 text-white shadow-md";
  const inactiveClasses = "bg-white text-gray-700 hover:bg-gray-200";

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">Explora Por Categoría</h2>
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        <button
          onClick={() => onSelectFilter('all')}
          className={`${baseClasses} ${selectedFilter === 'all' ? activeClasses : inactiveClasses}`}
        >
          Todos
        </button>
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => onSelectFilter(category.id)}
            className={`${baseClasses} ${selectedFilter === category.id ? activeClasses : inactiveClasses}`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};