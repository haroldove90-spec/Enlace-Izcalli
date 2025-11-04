import React from 'react';
import { View } from '../../App';
import { StatCard } from '../../components/admin/StatCard';
import { SimpleBarChart } from '../../components/admin/SimpleBarChart';
import { PlusCircleIcon } from '../../components/Icons';

interface AdminDashboardPageProps {
  setActiveView: (view: View) => void;
}

const newBusinessesData = [
  { name: 'Lun', value: 2 },
  { name: 'Mar', value: 3 },
  { name: 'Mié', value: 1 },
  { name: 'Jue', value: 5 },
  { name: 'Vie', value: 4 },
  { name: 'Sáb', value: 7 },
  { name: 'Dom', value: 6 },
];

const salesData = [
    { name: 'Ene', value: 12000 },
    { name: 'Feb', value: 19000 },
    { name: 'Mar', value: 15000 },
    { name: 'Abr', value: 21000 },
    { name: 'May', value: 18000 },
    { name: 'Jun', value: 25000 },
];

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ setActiveView }) => {
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard de Administrador</h1>
            <p className="text-gray-600">Resumen del rendimiento de Enlace Izcalli.</p>
        </div>
        <button
            onClick={() => setActiveView('adminAddBusiness')}
            className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg inline-flex items-center hover:bg-red-700 transition-colors duration-300 shadow-md"
        >
            <PlusCircleIcon className="w-5 h-5 mr-2" />
            Añadir Negocio
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Negocios Publicados (Hoy)" value="8" />
        <StatCard title="Negocios Publicados (Semana)" value="42" />
        <StatCard title="Negocios Publicados (Mes)" value="156" />
        <StatCard title="Ingresos del Mes" value="$12,500" isCurrency />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Nuevos Negocios (Última Semana)</h2>
          <SimpleBarChart data={newBusinessesData} barColor="bg-red-500" />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Resumen de Ventas (YTD)</h2>
          <SimpleBarChart data={salesData} barColor="bg-green-500" formatAsCurrency />
        </div>
      </div>
    </div>
  );
};