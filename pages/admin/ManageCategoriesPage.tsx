import React, { useState } from 'react';
import { Category } from '../../types';
import { supabase } from '../../supabaseClient';

interface ManageCategoriesPageProps {
  categories: Category[];
  onCategoriesUpdate: () => void; // Callback to refetch data
}

export const ManageCategoriesPage: React.FC<ManageCategoriesPageProps> = ({ categories, onCategoriesUpdate }) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddCategory = async () => {
    if (newCategoryName.trim() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        const { error } = await supabase.from('categories').insert([{ name: newCategoryName.trim() }]);
        
        if (error) {
          if (error.code === '23505') { // Unique constraint violation
            throw new Error(`La categoría '${newCategoryName.trim()}' ya existe.`);
          }
          throw error;
        }

        setNewCategoryName('');
        onCategoriesUpdate();
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
        const { count, error: countError } = await supabase.from('businesses').select('*', { count: 'exact', head: true }).eq('categoryId', id);

        if (countError) throw countError;

        if (count && count > 0) {
          alert('No se puede eliminar la categoría porque está siendo utilizada por uno o más negocios.');
          return;
        }

        const { error: deleteError } = await supabase.from('categories').delete().eq('id', id);
        if (deleteError) throw deleteError;
        
        onCategoriesUpdate();
      } catch (error) {
        console.error(error);
        const message = error instanceof Error ? error.message : 'Ocurrió un error inesperado.';
        alert(message);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8 animate-fade-in max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Gestionar Categorías</h1>
      
      <div className="flex flex-col sm:flex-row gap-2 mb-6">
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
          className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:bg-red-300 flex-shrink-0"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Añadiendo...' : 'Añadir'}
        </button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {categories.length > 0 ? categories.map(category => (
            <li key={category.id} className="flex justify-between items-center p-3 sm:p-4 gap-4">
              <span className="text-gray-800 break-words flex-1 min-w-0">{category.name}</span>
              <button
                onClick={() => handleDeleteCategory(category.id)}
                className="text-red-600 hover:text-red-800 font-semibold flex-shrink-0"
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
