import React, { useState } from 'react';
import { Category } from '../../types';

interface ManageCategoriesPageProps {
  categories: Category[];
  onCategoriesUpdate: () => void; // Callback to refetch data
}

export const ManageCategoriesPage: React.FC<ManageCategoriesPageProps> = ({ categories, onCategoriesUpdate }) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getErrorMessage = async (response: Response, defaultMessage: string): Promise<string> => {
      const errorText = await response.text();
      try {
          // Attempt to parse the text as a JSON object
          const errorData = JSON.parse(errorText);
          return errorData.error || JSON.stringify(errorData);
      } catch (e) {
          // If JSON parsing fails, it's not a JSON response. Return the raw text.
          return errorText || defaultMessage;
      }
  };


  const handleAddCategory = async () => {
    if (newCategoryName.trim() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        const response = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newCategoryName.trim() }),
        });
        
        if (!response.ok) {
          const errorMessage = await getErrorMessage(response, 'No se pudo añadir la categoría.');
          throw new Error(errorMessage);
        }

        setNewCategoryName('');
        onCategoriesUpdate(); // Refetch categories from parent
      } catch (error) {
        console.error(error);
        const message = error instanceof Error ? error.message : 'Ocurrió un error inesperado.';
        alert(message);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta categoría? Esta acción no se puede deshacer.')) {
      try {
        const response = await fetch(`/api/categories`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        });
        if (!response.ok) {
           const errorMessage = await getErrorMessage(response, 'No se pudo eliminar la categoría.');
           throw new Error(errorMessage);
        }
        onCategoriesUpdate(); // Refetch categories from parent
      } catch (error) {
        console.error(error);
        const message = error instanceof Error ? error.message : 'Ocurrió un error inesperado.';
        alert(message);
      }
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
          disabled={isSubmitting}
        />
        <button
          onClick={handleAddCategory}
          className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:bg-red-300"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Añadiendo...' : 'Añadir'}
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