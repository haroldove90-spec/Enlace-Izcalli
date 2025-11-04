import React, { useState } from 'react';
import { Category } from '../../types';

interface BusinessFormProps {
  categories: Category[];
}

export const BusinessForm: React.FC<BusinessFormProps> = ({ categories }) => {
  const [formData, setFormData] = useState({
    logo: null as File | null,
    name: '',
    categoryId: '',
    ownerName: '',
    services: '',
    products: '',
    promotions: '',
    description: '',
    phone: '',
    whatsapp: '',
    email: '',
    website: '',
    location: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, logo: e.target.files![0] }));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would process and submit the data
    const finalData = {
        ...formData,
        services: formData.services.split(',').map(s => s.trim()).filter(Boolean),
        products: formData.products.split(',').map(p => p.trim()).filter(Boolean),
        promotions: formData.promotions.split(',').map(p => p.trim()).filter(Boolean),
    };
    console.log('Submitting business data:', finalData);
    alert(`Negocio "${finalData.name}" guardado exitosamente (simulación).`);
    // Reset form or navigate away
  };

  const InputField: React.FC<{ name: string; label: string; placeholder: string; type?: string; required?: boolean }> = ({ name, label, placeholder, type = 'text', required = false }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input
            type={type}
            id={name}
            name={name}
            value={formData[name as keyof typeof formData] as string}
            onChange={handleChange}
            placeholder={placeholder}
            required={required}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
        />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Section 1: Main Info */}
      <fieldset className="border-t border-gray-200 pt-6">
        <legend className="text-lg font-semibold text-gray-800">Información Principal</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <InputField name="name" label="Nombre del Negocio" placeholder="Ej: Taquería 'El Buen Pastor'" required />
            <div>
                <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <select id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 bg-white">
                    <option value="" disabled>Selecciona una categoría</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
            </div>
            <InputField name="ownerName" label="Nombre del Dueño o Representante" placeholder="Ej: Juan Pérez" />
             <div>
                <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-1">Logo del Negocio</label>
                <input type="file" id="logo" name="logo" onChange={handleFileChange} accept="image/*" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100" />
            </div>
        </div>
      </fieldset>

       {/* Section 2: Business Details */}
       <fieldset className="border-t border-gray-200 pt-6">
        <legend className="text-lg font-semibold text-gray-800">Detalles del Negocio</legend>
        <div className="space-y-6 mt-4">
            <InputField name="services" label="Servicios (separados por coma)" placeholder="Ej: Servicio a domicilio, Eventos privados" />
            <InputField name="products" label="Productos (separados por coma)" placeholder="Ej: Tacos al pastor, Gringas, Alambres" />
            <InputField name="promotions" label="Promociones (separadas por coma)" placeholder="Ej: 2x1 en tacos los martes" />
            <div>
                 <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descripción (Texto Libre)</label>
                 <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} placeholder="Describe el negocio, su historia, y lo que lo hace especial." className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"></textarea>
            </div>
        </div>
       </fieldset>

      {/* Section 3: Contact Info */}
      <fieldset className="border-t border-gray-200 pt-6">
        <legend className="text-lg font-semibold text-gray-800">Información de Contacto</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <InputField name="phone" label="Número de Teléfono" placeholder="5512345678" type="tel" />
            <InputField name="whatsapp" label="WhatsApp (con código de país)" placeholder="5215512345678" type="tel" />
            <InputField name="email" label="Correo Electrónico" placeholder="contacto@negocio.com" type="email" />
            <InputField name="website" label="Página Web" placeholder="https://negocio.com" type="url" />
            <div className="md:col-span-2">
                <InputField name="location" label="Mapa de Ubicación (Dirección o URL de Google Maps)" placeholder="Av. de los Chopos 123, Arcos del Alba..." />
            </div>
        </div>
      </fieldset>

      <div className="flex justify-end pt-6 border-t border-gray-200">
        <button type="submit" className="bg-red-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-red-700 transition-colors duration-300 shadow-lg transform hover:scale-105">
          Guardar Negocio
        </button>
      </div>
    </form>
  );
};