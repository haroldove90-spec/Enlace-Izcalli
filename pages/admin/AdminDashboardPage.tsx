import React, { useState, useCallback } from 'react';
import { StatCard } from '../../components/admin/StatCard';
import { SimpleBarChart } from '../../components/admin/SimpleBarChart';
import { Business, Category } from '../../types';
import { View } from '../../App';
import { supabase } from '../../supabaseClient';
import { BUSINESSES, CATEGORIES } from '../../constants';


interface AdminDashboardPageProps {
  businesses: Business[];
  categories: Category[];
  setActiveView: (view: View) => void;
  usingFallbackData?: boolean;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ businesses, categories, usingFallbackData }) => {
  const totalBusinesses = businesses.length;
  const totalCategories = categories.length;
  const featuredBusinesses = businesses.filter(b => b.isFeatured).length;
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState<string | null>(null);
  const [seedError, setSeedError] = useState<string | null>(null);

  const handleSeedDatabase = useCallback(async () => {
    if (!window.confirm('¿Estás seguro de que quieres reiniciar la base de datos? Se borrarán todos los datos actuales y se reemplazarán con los datos de ejemplo.')) {
      return;
    }
    setIsSeeding(true);
    setSeedMessage(null);
    setSeedError(null);
    try {
      // 1. Delete existing data in reverse order of dependencies
      // This is a destructive operation. RLS must be disabled or have permissive policies.
      const { error: deleteBusinessesError } = await supabase.from('businesses').delete().neq('id', 0);
      if (deleteBusinessesError) throw deleteBusinessesError;

      const { error: deleteCategoriesError } = await supabase.from('categories').delete().neq('id', 0);
      if (deleteCategoriesError) throw deleteCategoriesError;

      // 2. Insert new data from constants
      const { error: insertCategoriesError } = await supabase.from('categories').insert(CATEGORIES);
      if (insertCategoriesError) throw insertCategoriesError;

      const { error: insertBusinessesError } = await supabase.from('businesses').insert(BUSINESSES);
      if (insertBusinessesError) throw insertBusinessesError;


      setSeedMessage('¡Base de datos inicializada con éxito! La página se recargará.');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      const rawMessage = error instanceof Error ? error.message : JSON.stringify(error);
      console.error("Database seed error:", rawMessage); // Log for debugging

      let friendlyMessage = 'No se pudo inicializar la base de datos. ';
      friendlyMessage += 'Asegúrate de que las tablas (businesses, categories) existen en Supabase y de que las políticas de seguridad (RLS) permiten la inserción y eliminación.';
      
      setSeedError(`${friendlyMessage}\n\nDetalles técnicos:\n${rawMessage}`);
    } finally {
      setIsSeeding(false);
    }
  }, []);

  const businessesPerCategory = categories.map(category => ({
    name: category.name.split(' ')[0], // Shorten name for chart
    value: businesses.filter(b => b.categoryId === category.id).length
  }));

  return (
    <div className="animate-fade-in max-w-7xl mx-auto">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
      </div>
      
      <div className="bg-orange-50 border-l-4 border-orange-400 text-orange-700 p-4 mb-8 rounded-r-lg" role="alert">
        <p className="font-bold">
            {usingFallbackData ? "Atención: Se Requiere Inicialización" : "Inicialización de la Base de Datos"}
        </p>
        <p className="text-sm">
            {usingFallbackData
                ? "La aplicación no pudo conectar con Supabase y está mostrando datos de prueba. Presiona el botón para crear las tablas y cargar los datos iniciales."
                : "Si los datos no se cargan o ves errores, es posible que la base de datos necesite ser inicializada. Este proceso borrará los datos actuales y los reemplazará con datos de prueba."
            }
        </p>
        <button
          onClick={handleSeedDatabase}
          disabled={isSeeding}
          className="mt-3 bg-orange-500 text-white font-bold py-2 px-4 rounded hover:bg-orange-600 disabled:bg-orange-300 transition-colors"
        >
          {isSeeding ? 'Inicializando...' : 'Inicializar Base de Datos'}
        </button>
        {seedMessage && <p className="mt-2 text-sm font-semibold text-green-700">{seedMessage}</p>}
        {seedError && (
             <div className="mt-3 bg-red-50 border border-red-200 text-red-900 p-4 rounded-md text-sm" role="alert">
                <p className="font-bold">Ocurrió un error</p>
                <pre className="whitespace-pre-wrap font-mono text-xs mt-2 p-2 bg-red-100 rounded text-red-800">{seedError}</pre>
            </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total de Negocios" value={totalBusinesses.toString()} />
        <StatCard title="Negocios Destacados" value={featuredBusinesses.toString()} />
        <StatCard title="Total de Categorías" value={totalCategories.toString()} />
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-700 mb-4">Negocios por Categoría</h2>
        <div className="overflow-x-auto pb-2">
          <SimpleBarChart data={businessesPerCategory} barColor="bg-red-500" />
        </div>
      </div>
    </div>
  );
};
