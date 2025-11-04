
import React from 'react';
import { BusinessForm } from '../../components/admin/BusinessForm';
import { Category, Business } from '../../types';
import { View } from '../../App';

interface AddBusinessPageProps {
  categories: Category[];
  onAddBusiness: (business: Omit<Business, 'id'>) => void;
  setActiveView: (view: View) => void;
}

export const AddBusinessPage: React.FC<AddBusinessPageProps> = ({ categories, onAddBusiness, setActiveView }) => {
  const handleSubmit = (businessData: Omit<Business, 'id'>) => {
    onAddBusiness(businessData);
    alert('Negocio añadido con éxito!');
    setActiveView('adminDashboard');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Añadir Nuevo Negocio</h1>
      <BusinessForm 
        categories={categories} 
        onSubmit={handleSubmit} 
        onCancel={() => setActiveView('adminDashboard')} 
      />
    </div>
  );
};
