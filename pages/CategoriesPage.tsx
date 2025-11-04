import React from 'react';
import { Category } from '../types';
import { 
  RestaurantIcon, 
  HealthIcon, 
  BriefcaseIcon, 
  ShoppingIcon, 
  CarIcon, 
  HomeGardenIcon 
} from '../components/Icons';

interface CategoriesPageProps {
  categories: Category[];
}

const categoryIcons: { [key: number]: React.FC<any> } = {
  1: RestaurantIcon,
  2: HealthIcon,
  3: BriefcaseIcon,
  4: ShoppingIcon,
  5: CarIcon,
  6: HomeGardenIcon,
};

export const CategoriesPage: React.FC<CategoriesPageProps> = ({ categories }) => {
  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Categorías</h1>
      <p className="text-center text-gray-600 mb-8">Encuentra lo que buscas navegando por nuestras categorías.</p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {categories.map(category => {
          const Icon = categoryIcons[category.id] || BriefcaseIcon;
          return (
            <a 
              key={category.id}
              href="#" 
              className="group flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-md hover:shadow-xl hover:bg-red-600 transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="mb-3 p-4 bg-red-100 rounded-full group-hover:bg-white transition-colors duration-300">
                <Icon className="w-8 h-8 text-red-600 group-hover:text-red-500 transition-colors duration-300" />
              </div>
              <h3 className="text-center font-semibold text-gray-700 group-hover:text-white transition-colors duration-300">{category.name}</h3>
            </a>
          );
        })}
      </div>
    </div>
  );
};