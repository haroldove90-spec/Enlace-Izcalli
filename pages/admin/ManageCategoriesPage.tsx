import React, { useState } from 'react';
import { Category } from '../../types';

interface ManageCategoriesPageProps {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
}

export const ManageCategoriesPage: React.FC<ManageCategoriesPageProps> = ({ categories, setCategories }) => {
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory: Category = {
        id: Date.now(), // simple unique id
        name: newCategoryName.trim(),
      };
      setCategories(prev => [...prev, newCategory]);
      setNewCategoryName('');
    }
  };

  const handleDeleteCategory = (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta categoría? Esto no afectará a los negocios existentes en ella.')) {
      setCategories(prev => prev.filter(cat => cat.id !== id));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 animate-fade-in max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Gestionar Categorías</h1>
      
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="Nombre de la nueva categoría"
          className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm bg-gray-100 text-black placeholder-gray-600"
        />
        <button
          onClick={handleAddCategory}
          className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
        >
          Añadir
        </button>
      </div>

      <ul className="space-y-3">
        {categories.map(category => (
          <li key={category.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
            <span className="text-gray-800">{category.name}</span>
            <button
              onClick={() => handleDeleteCategory(category.id)}
              className="text-red-600 hover:text-red-800 font-semibold"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
