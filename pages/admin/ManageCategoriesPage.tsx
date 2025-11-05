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
        const alertMessage = error instanceof Error ? error.message : 'Ocurrió un error inesperado.';
        alert(alertMessage);
      }
    }
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg shadow-lg p-4 sm:p-8 animate-fade-in max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">Gestionar Categorías</h1>
      
      <div className="flex flex-col sm:flex-row gap-2 mb-6">
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="Nombre de la nueva categoría"
          className="flex-grow px-3 py-2 border border-neutral-700 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm bg-neutral-800 text-white placeholder-gray-400"
          disabled={isSubmitting}
        />
        <button
          onClick={handleAddCategory}
          className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:bg-red-800 disabled:cursor-not-allowed flex-shrink-0"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Añadiendo...' : 'Añadir'}
        </button>
      </div>

      <div className="border border-neutral-800 rounded-lg overflow-hidden">
        <ul className="divide-y divide-neutral-800">
          {categories.length > 0 ? categories.map(category => (
            <li key={category.id} className="flex justify-between items-center p-3 sm:p-4 gap-4 bg-neutral-900">
              <span className="text-gray-200 break-words flex-1 min-w-0">{category.name}</span>
              <button
                onClick={() => handleDeleteCategory(category.id)}
                className="text-red-500 hover:text-red-400 font-semibold flex-shrink-0 text-sm"
              >
                Eliminar
              </button>
            </li>
          )) : (
            <li className="p-4 text-center text-gray-500">No hay categorías para mostrar.</li>
          )}
        </ul>
      </div>
    </div>
  );
};