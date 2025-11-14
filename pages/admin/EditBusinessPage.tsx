import React from 'react';
import { BusinessForm } from '../../components/admin/BusinessForm';
import { Category, Business, View } from '../../types';

interface EditBusinessPageProps {
  categories: Category[];
  businessToEdit: Business;
  onUpdateBusiness: (business: Business) => void;
  onCancel: () => void;
  setActiveView: (view: View) => void;
  onCategoriesUpdate: () => Promise<void>;
}

export const EditBusinessPage: React.FC<EditBusinessPageProps> = ({ categories, businessToEdit, onUpdateBusiness, onCancel, setActiveView, onCategoriesUpdate }) => {

  const handleSubmit = (businessData: Omit<Business, 'id'> | Business) => {
    onUpdateBusiness(businessData as Business);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 animate-fade-in max-w-4xl mx-auto border border-slate-200">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Editar Negocio: {businessToEdit.name}</h1>
      <BusinessForm 
        categories={categories} 
        onSubmit={handleSubmit} 
        onCancel={onCancel}
        initialData={businessToEdit}
        setActiveView={setActiveView}
        onCategoriesUpdate={onCategoriesUpdate}
      />
    </div>
  );
};