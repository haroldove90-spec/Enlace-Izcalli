import React, { useState } from 'react';
import { Business, Category, View } from '../../types';
import { supabase } from '../../supabaseClient';
import { PlusIcon } from '../Icons';

interface BusinessFormProps {
  categories: Category[];
  onSubmit: (business: Omit<Business, 'id'> | Business) => void;
  initialData?: Business;
  onCancel: () => void;
  setActiveView: (view: View) => void;
  onCategoriesUpdate: () => Promise<void>;
}

const CategoryModal: React.FC<{
    isOpen: boolean,
    onClose: () => void,
    onSave: (name: string) => Promise<void>,
}> = ({ isOpen, onClose, onSave }) => {
    const [name, setName] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    if (!isOpen) return null;

    const handleSave = async () => {
        if (!name.trim()) {
            alert('El nombre de la categoría no puede estar vacío.');
            return;
        }
        setIsSaving(true);
        await onSave(name);
        setIsSaving(false);
        setName('');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-bold mb-4">Añadir Nueva Categoría</h3>
                <InputField
                    label="Nombre de la Categoría"
                    name="newCategoryName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Comida Rápida"
                    disabled={isSaving}
                />
                <div className="flex justify-end space-x-2 mt-4">
                    <button onClick={onClose} disabled={isSaving} className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300">Cancelar</button>
                    <button onClick={handleSave} disabled={isSaving} className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700">
                        {isSaving ? 'Guardando...' : 'Guardar'}
                    </button>
                </div>
            </div>
        </div>
    );
};


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

export const BusinessForm: React.FC<BusinessFormProps> = ({ categories, onSubmit, initialData, onCancel, onCategoriesUpdate }) => {
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
    address: initialData?.address || '',
    latitude: initialData?.latitude || 0,
    longitude: initialData?.longitude || 0,
    googleMapsUrl: initialData?.googleMapsUrl || '',
  });

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(initialData?.logoUrl || null);

  const handleSaveCategory = async (name: string) => {
    try {
        const { data, error } = await supabase.from('categories').insert([{ name }]).select();
        if (error) throw new Error('Failed to save category');

        await onCategoriesUpdate();
        
        if (data && data[0]) {
            setFormData(prev => ({ ...prev, categoryId: data[0].id }));
        }
        setIsCategoryModalOpen(false);
    } catch (error) {
        console.error(error);
        alert('Error al guardar la categoría.');
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLogoPreview(URL.createObjectURL(file));
    setIsUploading(true);

    try {
        const fileName = `${Date.now()}_${file.name}`;
        const { error: uploadError } = await supabase.storage
            .from('business-logos')
            .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
            .from('business-logos')
            .getPublicUrl(fileName);

        setFormData(prev => ({ ...prev, logoUrl: urlData.publicUrl }));
        setLogoPreview(urlData.publicUrl);
    } catch (error) {
        console.error("Error uploading file: ", error);
        alert("Error al subir el logo. Asegúrate de que el bucket 'business-logos' exista y sea público.");
        setLogoPreview(initialData?.logoUrl || null);
    } finally {
        setIsUploading(false);
    }
  }


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
        const { checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
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
    <>
    <CategoryModal isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)} onSave={handleSaveCategory} />
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
        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
           <div className="flex items-center gap-2">
            <select id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleChange} required className="flex-grow block w-full px-3 py-2 border border-gray-300 bg-gray-100 text-black rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm">
              {categories.length > 0 ? (
                categories.map((opt) => <option key={opt.id} value={opt.id}>{opt.name}</option>)
              ) : (
                <option value="" disabled>Primero crea una categoría</option>
              )}
            </select>
            <button
                type="button"
                onClick={() => setIsCategoryModalOpen(true)}
                className="flex-shrink-0 bg-red-100 text-red-700 hover:bg-red-200 font-bold p-2 rounded-md"
                title="Añadir nueva categoría"
            >
                <PlusIcon className="w-5 h-5" />
            </button>
           </div>
        </div>
      </div>
      <TextAreaField name="description" label="Descripción" value={formData.description} onChange={handleChange} required />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <InputField name="logoUrl" label="URL del Logo" value={formData.logoUrl} onChange={handleChange} placeholder="https://ejemplo.com/logo.png" />
             <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink mx-4 text-gray-400 text-xs">O</span>
                <div className="flex-grow border-t border-gray-300"></div>
            </div>
             <label className="w-full text-center cursor-pointer bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                <span>{isUploading ? 'Subiendo...' : 'Subir Archivo'}</span>
                <input type="file" className="sr-only" onChange={handleLogoUpload} accept="image/png, image/jpeg, image/jpg" disabled={isUploading} />
            </label>
            {logoPreview && (
                <div className="mt-4">
                    <img src={logoPreview} alt="Vista previa del logo" className="h-24 w-24 object-cover rounded-md border" />
                </div>
            )}
        </div>
        <div>
            <InputField name="phone" label="Teléfono" value={formData.phone} onChange={handleChange} />
            <InputField name="whatsapp" label="WhatsApp (con código de país)" value={formData.whatsapp} onChange={handleChange} containerClassName="mt-6" />
            <InputField name="website" label="Sitio Web" value={formData.website} onChange={handleChange} containerClassName="mt-6" />
        </div>
      </div>
      <TextAreaField name="address" label="Dirección" value={formData.address} onChange={handleChange} required />
      <InputField name="googleMapsUrl" label="Enlace de Google Maps" value={formData.googleMapsUrl} onChange={handleChange} placeholder="https://maps.app.goo.gl/..." />
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
    </>
  );
};