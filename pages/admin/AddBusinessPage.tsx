import React from 'react';
import { View } from '../../App';
import { BusinessForm } from '../../components/admin/BusinessForm';
import { CATEGORIES } from '../../constants';

interface AddBusinessPageProps {
  setActiveView: (view: View) => void;
}

export const AddBusinessPage: React.FC<AddBusinessPageProps> = ({ setActiveView }) => {
  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
        <div className="mb-8">
            <button 
                onClick={() => setActiveView('adminDashboard')}
                className="text-sm font-semibold text-red-600 hover:text-red-800"
            >
                &larr; Volver al Dashboard
            </button>
        </div>
        
        <div className="bg-white p-8 rounded-xl shadow-lg">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Añadir Nuevo Negocio</h1>
            <p className="text-gray-500 mb-6">Completa el formulario para registrar un nuevo comercio en el directorio.</p>
            <BusinessForm categories={CATEGORIES} />
        </div>
    </div>
  );
};