import React, { useState } from 'react';
import { Business, Category } from '../../types';

interface BusinessFormProps {
  categories: Category[];
  onSubmit: (business: Omit<Business, 'id'> | Business) => void;
  initialData?: Business;
  onCancel: () => void;
}

// Helper components for form fields
const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ name, label, ...props }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
    <input id={name} name={name} {...props} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" />
  </div>
);

const TextAreaField: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }> = ({ name, label, ...props }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
    <textarea id={name} name={name} rows={3} {...props} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" />
  </div>
);

const SelectField: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string, options: Category[] }> = ({ name, label, options, ...props }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
    <select id={name} name={name} {...props} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm">
      {options.map((opt: Category) => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
    </select>
  </div>
);


export const BusinessForm: React.FC<BusinessFormProps> = ({ categories, onSubmit, initialData, onCancel }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    logoUrl: initialData?.logoUrl || '',
    phone: initialData?.phone || '',
    whatsapp: initialData?.whatsapp || '',
    website: initialData?.website || '',
    categoryId: initialData?.categoryId || categories[0]?.id || 0,
    services: initialData?.services || [],
    products: initialData?.products || [],
    isFeatured: initialData?.isFeatured || false,
    ownerName: initialData?.ownerName || '',
    ownerEmail: initialData?.ownerEmail || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
        const { checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
        setFormData(prev => ({ ...prev, [name]: name === 'categoryId' ? Number(value) : value }));
    }
  };
  
  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'services' | 'products') => {
      setFormData(prev => ({ ...prev, [field]: e.target.value.split(',').map(item => item.trim()) }));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(initialData) {
        onSubmit({ ...initialData, ...formData });
    } else {
        onSubmit(formData as Omit<Business, 'id'>);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 border-l-4 border-red-500 bg-red-50">
        <h2 className="text-lg font-bold text-gray-800">Datos del Cliente</h2>
      </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField name="ownerName" label="Nombre del Dueño/Representante" value={formData.ownerName} onChange={handleChange} required />
        <InputField name="ownerEmail" label="Email del Dueño" type="email" value={formData.ownerEmail} onChange={handleChange} required />
      </div>

       <div className="p-4 border-l-4 border-red-500 bg-red-50 mt-8">
        <h2 className="text-lg font-bold text-gray-800">Datos del Negocio</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField name="name" label="Nombre del Negocio" value={formData.name} onChange={handleChange} required />
        <SelectField name="categoryId" label="Categoría" value={formData.categoryId} onChange={handleChange} options={categories} required />
      </div>
      <TextAreaField name="description" label="Descripción" value={formData.description} onChange={handleChange} required />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField name="logoUrl" label="URL del Logo" value={formData.logoUrl} onChange={handleChange} />
        <InputField name="phone" label="Teléfono" value={formData.phone} onChange={handleChange} />
        <InputField name="whatsapp" label="WhatsApp (con código de país)" value={formData.whatsapp} onChange={handleChange} />
        <InputField name="website" label="Sitio Web" value={formData.website} onChange={handleChange} />
      </div>
      <InputField name="services" label="Servicios (separados por coma)" value={formData.services.join(', ')} onChange={(e) => handleArrayChange(e, 'services')} />
      <InputField name="products" label="Productos (separados por coma)" value={formData.products.join(', ')} onChange={(e) => handleArrayChange(e, 'products')} />
      <div className="flex items-center">
        <input type="checkbox" id="isFeatured" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500" />
        <label htmlFor="isFeatured" className="ml-2 block text-sm font-medium text-gray-700">¿Es un negocio destacado?</label>
      </div>
      <div className="flex justify-end space-x-4 pt-4 border-t">
        <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">Cancelar</button>
        <button type="submit" className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">{initialData ? 'Actualizar' : 'Crear'} Negocio</button>
      </div>
    </form>
  );
};
