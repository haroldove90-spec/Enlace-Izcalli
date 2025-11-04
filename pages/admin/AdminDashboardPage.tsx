
import React from 'react';
import { StatCard } from '../../components/admin/StatCard';
import { SimpleBarChart } from '../../components/admin/SimpleBarChart';
import { Business, Category } from '../../types';
import { View } from '../../App';
import { PlusIcon } from '../../components/Icons';

interface AdminDashboardPageProps {
  businesses: Business[];
  categories: Category[];
  setActiveView: (view: View) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ businesses, categories, setActiveView }) => {
  const totalBusinesses = businesses.length;
  const totalCategories = categories.length;
  const featuredBusinesses = businesses.filter(b => b.isFeatured).length;

  const businessesPerCategory = categories.map(category => ({
    name: category.name.split(' ')[0], // Shorten name for chart
    value: businesses.filter(b => b.categoryId === category.id).length
  }));

  return (
    <div className="animate-fade-in">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Panel de Administración</h1>
        <div className="flex space-x-2">
            <button
              onClick={() => setActiveView('adminAddBusiness')}
              className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Añadir Negocio
            </button>
             <button
              onClick={() => setActiveView('adminManageCategories')}
              className="bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center"
            >
              Gestionar Categorías
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total de Negocios" value={totalBusinesses.toString()} />
        <StatCard title="Negocios Destacados" value={featuredBusinesses.toString()} />
        <StatCard title="Total de Categorías" value={totalCategories.toString()} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-700 mb-4">Negocios por Categoría</h2>
        <SimpleBarChart data={businessesPerCategory} barColor="bg-red-500" />
      </div>
    </div>
  );
};
