import React, { useState } from 'react';
import { Category, View } from '../types';
import { SearchIcon, RestaurantIcon, HealthIcon, BriefcaseIcon, ShoppingIcon, CarIcon, HomeGardenIcon, UtensilsIcon } from '../components/Icons';

interface HomePageProps {
  categories: Category[];
  onSelectCategory: (categoryId: number) => void;
  onViewChange: (view: View) => void;
}

const categoryIcons: { [key: number]: React.FC<any> } = {
  1: RestaurantIcon,
  2: HealthIcon,
  3: BriefcaseIcon,
  4: ShoppingIcon,
  5: CarIcon,
  6: HomeGardenIcon,
};

const CategoryGridItem: React.FC<{ category: Category, onClick: () => void }> = ({ category, onClick }) => {
  const Icon = categoryIcons[category.id] || BriefcaseIcon;
  const showUtensils = category.id === 1;

  return (
    <button
      onClick={onClick}
      className="relative group bg-red-600 p-4 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-white text-left flex flex-col justify-between aspect-square"
    >
      <div className="flex justify-between items-start">
        <div className="w-12 h-12 bg-black/20 rounded-full flex items-center justify-center">
          <Icon className="w-7 h-7 text-white" />
        </div>
        {showUtensils && <UtensilsIcon className="w-7 h-7 text-white/30" />}
      </div>
      <h3 className="text-lg font-bold uppercase tracking-wide mt-2">{category.name}</h3>
    </button>
  );
};

export const HomePage: React.FC<HomePageProps> = ({ categories, onSelectCategory, onViewChange }) => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="flex-grow flex flex-col">
      {/* Header Section (in red background) */}
      <div className="px-6 py-8 text-white">
        <h1 className="text-3xl font-black uppercase tracking-wide">Explora Directorios Locales</h1>
        <div className="w-16 h-1 bg-white/50 mt-2 rounded-full" />
      </div>

      {/* Content Section (white card) */}
      <div className="flex-grow bg-white rounded-t-3xl shadow-2xl p-6 pb-24">
        {/* Segmented Control */}
        <div className="flex bg-slate-100 p-1 rounded-full mb-6 text-sm font-bold">
          <button className="w-1/2 py-2.5 rounded-full bg-red-600 text-white shadow">
            CATEGORIAS
          </button>
          <button 
            onClick={() => onViewChange('map')} 
            className="w-1/2 py-2.5 rounded-full text-slate-600 hover:bg-slate-200"
          >
            MAPA
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Buscar por nombre o palabra clave..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-5 py-4 pl-12 border border-slate-200 bg-slate-50 rounded-full focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-shadow text-slate-900 placeholder-slate-500"
          />
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-slate-400" />
          </div>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 gap-4">
          {categories.map(category => (
            <CategoryGridItem
              key={category.id}
              category={category}
              onClick={() => onSelectCategory(category.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};