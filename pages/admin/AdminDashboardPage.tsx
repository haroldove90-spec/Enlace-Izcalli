import React from 'react';
import { StatCard } from '../../components/admin/StatCard';
import { SimpleBarChart } from '../../components/admin/SimpleBarChart';
import { Business, Category } from '../../types';
import { View } from '../../types';

interface AdminDashboardPageProps {
  businesses: Business[];
  categories: Category[];
  setActiveView: (view: View) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ businesses, categories }) => {
  const totalBusinesses = businesses.length;
  const totalCategories = categories.length;
  const featuredBusinesses = businesses.filter(b => b.isFeatured).length;
  const activeBusinesses = businesses.filter(b => b.isActive).length;

  const businessesPerCategory = categories.map(category => ({
    name: category.name.split(' ')[0], // Shorten name for chart
    value: businesses.filter(b => b.categoryId === category.id).length
  }));

  return (
    <div className="animate-fade-in max-w-7xl mx-auto">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total de Negocios" value={totalBusinesses.toString()} />
        <StatCard title="Negocios Activos" value={activeBusinesses.toString()} />
        <StatCard title="Negocios Destacados" value={featuredBusinesses.toString()} />
        <StatCard title="Total de Categorías" value={totalCategories.toString()} />
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-slate-200">
        <h2 className="text-xl font-bold text-slate-700 mb-4">Negocios por Categoría</h2>
        <div className="overflow-x-auto pb-2">
          <SimpleBarChart data={businessesPerCategory} barColor="bg-red-500" />
        </div>
      </div>
    </div>
  );
};