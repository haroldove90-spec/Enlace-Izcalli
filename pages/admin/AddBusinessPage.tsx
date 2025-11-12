import React from 'react';
import { BusinessForm } from '../../components/admin/BusinessForm';
import { Category, Business } from '../../types';
import { View } from '../../types';

interface AddBusinessPageProps {
  categories: Category[];
  onAddBusiness: (business: Omit<Business, 'id'>) => void;
  setActiveView: (view: View) => void;
}

export const AddBusinessPage: React.FC<AddBusinessPageProps> = ({ categories, onAddBusiness, setActiveView }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 animate-fade-in max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Añadir Nuevo Negocio</h1>
      <BusinessForm 
        categories={categories} 
        onSubmit={onAddBusiness} 
        onCancel={() => setActiveView('adminDashboard')} 
        setActiveView={setActiveView}
      />
    </div>
  );
};