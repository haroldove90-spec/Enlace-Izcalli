import React from 'react';
import { Category } from '../types';

interface CategoryFilterProps {
  categories: Category[];
  selectedFilter: string | number;
  onSelectFilter: (filter: string | number) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, selectedFilter, onSelectFilter }) => {
  const baseClasses = "px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 whitespace-nowrap border";
  const activeClasses = "bg-red-600 text-white border-red-600 shadow";
  const inactiveClasses = "bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300";

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-4 text-center">Explora Categorías</h2>
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        <button
          onClick={() => onSelectFilter('featured')}
          className={`${baseClasses} ${selectedFilter === 'featured' ? activeClasses : inactiveClasses}`}
        >
          <span role="img" aria-label="star" className="mr-2">⭐</span> Destacados
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