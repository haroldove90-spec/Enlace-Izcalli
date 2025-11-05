import React, { useState, useCallback } from 'react';
import { StatCard } from '../../components/admin/StatCard';
import { SimpleBarChart } from '../../components/admin/SimpleBarChart';
import { Business, Category } from '../../types';
import { View } from '../../App';

interface AdminDashboardPageProps {
  businesses: Business[];
  categories: Category[];
  setActiveView: (view: View) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ businesses, categories }) => {
  const totalBusinesses = businesses.length;
  const totalCategories = categories.length;
  const featuredBusinesses = businesses.filter(b => b.isFeatured).length;
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState<string | null>(null);
  const [seedError, setSeedError] = useState<string | null>(null);

  const handleSeedDatabase = useCallback(async () => {
    if (!window.confirm('¿Estás seguro de que quieres reiniciar la base de datos? Se borrarán todos los datos actuales.')) {
      return;
    }
    setIsSeeding(true);
    setSeedMessage(null);
    setSeedError(null);
    try {
      const response = await fetch('/api/seed');
      
      if (!response.ok) {
        let errorDetails = 'Ocurrió un error en el servidor.';
        try {
            const errorData = await response.json();
            errorDetails = errorData.details || errorData.error || JSON.stringify(errorData);
        } catch (jsonError) {
            // If JSON parsing fails, it's not a JSON response, so get raw text.
            errorDetails = await response.text();
        }
        throw new Error(errorDetails);
      }

      const data = await response.json();
      setSeedMessage(data.message || '¡Base de datos inicializada con éxito! La página se recargará.');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ocurrió un error inesperado.';
      setSeedError(`Error: ${message}`);
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
        <p className="font-bold">Inicialización de la Base de Datos</p>
        <p className="text-sm">Si los datos no se cargan o ves errores, es posible que la base de datos necesite ser inicializada. Este proceso borrará los datos actuales y los reemplazará con datos de prueba.</p>
        <button
          onClick={handleSeedDatabase}
          disabled={isSeeding}
          className="mt-3 bg-orange-500 text-white font-bold py-2 px-4 rounded hover:bg-orange-600 disabled:bg-orange-300 transition-colors"
        >
          {isSeeding ? 'Inicializando...' : 'Inicializar Base de Datos'}
        </button>
        {seedMessage && <p className="mt-2 text-sm font-semibold text-green-700">{seedMessage}</p>}
        {seedError && <p className="mt-2 text-sm font-semibold text-red-700">{seedError}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total de Negocios" value={totalBusinesses.toString()} />
        <StatCard title="Negocios Destacados" value={featuredBusinesses.toString()} />
        <StatCard title="Total de Categorías" value={totalCategories.toString()} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-700 mb-4">Negocios por Categoría</h2>
        <SimpleBarChart data={businessesPerCategory} barColor="bg-red-500" />
      </div>
    </div>
  );
};