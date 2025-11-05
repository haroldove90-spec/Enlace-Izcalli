import React from 'react';
import { BusinessForm } from '../../components/admin/BusinessForm';
import { Category, Business } from '../../types';

interface EditBusinessPageProps {
  categories: Category[];
  businessToEdit: Business;
  onUpdateBusiness: (business: Business) => void;
  onCancel: () => void;
}

export const EditBusinessPage: React.FC<EditBusinessPageProps> = ({ categories, businessToEdit, onUpdateBusiness, onCancel }) => {

  const handleSubmit = (businessData: Omit<Business, 'id'> | Business) => {
    onUpdateBusiness(businessData as Business);
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg shadow-lg p-8 animate-fade-in max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">Editar Negocio: {businessToEdit.name}</h1>
      <BusinessForm 
        categories={categories} 
        onSubmit={handleSubmit} 
        onCancel={onCancel}
        initialData={businessToEdit}
      />
    </div>
  );
};