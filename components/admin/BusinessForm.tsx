import React, { useState } from 'react';
import { Business, Category } from '../../types';

interface BusinessFormProps {
  categories: Category[];
  onSubmit: (business: Omit<Business, 'id'> | Business) => void;
  initialData?: Business;
  onCancel: () => void;
}

// Helper components for form fields with updated styling
const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ name, label, ...props }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
    <input id={name} name={name} {...props} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm bg-gray-100 text-black" />
  </div>
);

const TextAreaField: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }> = ({ name, label, ...props }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
    <textarea id={name} name={name} rows={3} {...props} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm bg-gray-100 text-black" />
  </div>
);

const SelectField: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string, options: {id: string | number, name: string}[] }> = ({ name, label, options, ...props }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
    <select id={name} name={name} {...props} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-100 text-black rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm">
      {options.map((opt) => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
    </select>
  </div>
);

const promotionDurations = [
    { id: '1', name: '1 Mes' },
    { id: '2', name: '2 Meses' },
    { id: '3', name: '3 Meses' },
    { id: '6', name: '6 Meses' },
    { id: '12', name: '12 Meses' },
];

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
    promotionDuration: '1', // Default promotion duration for new businesses
    // Fix: Add missing fields to form state to satisfy the Business type.
    address: initialData?.address || '',
    latitude: initialData?.latitude || 0,
    longitude: initialData?.longitude || 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
        const { checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
        // Fix: Ensure latitude and longitude are stored as numbers.
        const isNumericField = name === 'categoryId' || name === 'latitude' || name === 'longitude';
        setFormData(prev => ({ ...prev, [name]: isNumericField ? Number(value) : value }));
    }
  };
  
  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'services' | 'products') => {
      setFormData(prev => ({ ...prev, [field]: e.target.value.split(',').map(item => item.trim()) }));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(initialData) {
        const { promotionDuration, ...dataToSubmit } = formData;
        onSubmit({ ...initialData, ...dataToSubmit });
    } else {
        const { promotionDuration, ...restOfForm } = formData;
        const promotionMonths = parseInt(promotionDuration, 10);
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + promotionMonths);
        
        const newBusinessData = {
            ...restOfForm,
            promotionEndDate: endDate.toISOString(),
            isActive: true,
        };
        onSubmit(newBusinessData);
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
      {/* Fix: Add form fields for address and coordinates. */}
      <TextAreaField name="address" label="Dirección" value={formData.address} onChange={handleChange} required />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField name="latitude" label="Latitud" type="number" step="any" value={formData.latitude} onChange={handleChange} required />
          <InputField name="longitude" label="Longitud" type="number" step="any" value={formData.longitude} onChange={handleChange} required />
      </div>
      <InputField name="services" label="Servicios (separados por coma)" value={formData.services.join(', ')} onChange={(e) => handleArrayChange(e, 'services')} />
      <InputField name="products" label="Productos (separados por coma)" value={formData.products.join(', ')} onChange={(e) => handleArrayChange(e, 'products')} />
      
      {!initialData && (
        <SelectField name="promotionDuration" label="Duración de la Promoción" value={formData.promotionDuration} onChange={handleChange} options={promotionDurations} required />
      )}
      
      {initialData && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Vencimiento de la Promoción</label>
          <p className="mt-1 text-sm text-gray-900 bg-gray-100 p-2 rounded-md">{new Date(initialData.promotionEndDate).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      )}

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