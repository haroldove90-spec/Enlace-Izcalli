import React from 'react';
import { Business } from '../../types';

interface ManageBusinessesPageProps {
  businesses: Business[];
  onToggleStatus: (businessId: number, currentStatus: boolean) => void;
  onEditBusiness: (business: Business) => void;
}

export const ManageBusinessesPage: React.FC<ManageBusinessesPageProps> = ({ businesses, onToggleStatus, onEditBusiness }) => {
  const sortedBusinesses = [...businesses].sort((a, b) => (a.isActive === b.isActive) ? 0 : a.isActive ? -1 : 1);

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 md:p-8 animate-fade-in max-w-7xl mx-auto border border-slate-200">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Gestión de Negocios</h1>
      
      <div className="border border-slate-200 rounded-lg overflow-hidden">
        {/* Header for Desktop View */}
        <div className="hidden md:grid md:grid-cols-12 gap-4 px-4 py-3 bg-slate-50 font-semibold text-xs text-slate-600 uppercase tracking-wider items-center border-b border-slate-200">
          <div className="col-span-4">Negocio</div>
          <div className="col-span-3">Vencimiento</div>
          <div className="col-span-2">Estado</div>
          <div className="col-span-3 text-right">Acciones</div>
        </div>

        <div className="divide-y divide-slate-200">
          {sortedBusinesses.map((business) => (
            <div key={business.id} className="p-4 md:grid md:grid-cols-12 md:gap-4 md:items-center md:p-0 md:px-4 md:py-3 hover:bg-slate-50 transition-colors">
              
              {/* --- Mobile Card Layout --- */}
              <div className="md:hidden">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-lg text-slate-800 break-words pr-2">{business.name}</h3>
                  {business.isActive ? (
                      <span className="flex-shrink-0 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Activo
                      </span>
                  ) : (
                      <span className="flex-shrink-0 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Vencido
                      </span>
                  )}
                </div>
                <div className="text-sm text-slate-600 space-y-1 mb-4">
                  <p>
                    <span className="font-semibold text-slate-700">Vence: </span> 
                    {new Date(business.promotionEndDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-200">
                  <button onClick={() => onEditBusiness(business)} className="w-full text-sm font-medium text-white bg-slate-600 hover:bg-slate-700 px-3 py-2 rounded-md transition-colors shadow-sm">
                    Editar
                  </button>
                  <button 
                    onClick={() => onToggleStatus(business.id, business.isActive)} 
                    className={`w-full text-sm font-medium text-white px-3 py-2 rounded-md transition-colors shadow-sm ${
                      business.isActive 
                        ? 'bg-red-600 hover:bg-red-700' 
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {business.isActive ? 'Desactivar' : 'Reactivar'}
                  </button>
                </div>
              </div>

              {/* --- Desktop Table Row Layout --- */}
              <div className="hidden md:contents">
                <div className="col-span-4 text-sm font-medium text-slate-900">{business.name}</div>
                <div className="col-span-3 text-sm text-slate-700">{new Date(business.promotionEndDate).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                <div className="col-span-2">
                  {business.isActive ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Activo
                      </span>
                  ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Vencido
                      </span>
                  )}
                </div>
                <div className="col-span-3 text-right space-x-4">
                  <button onClick={() => onEditBusiness(business)} className="text-sm font-medium text-slate-600 hover:text-slate-900">
                    Editar
                  </button>
                  <button 
                    onClick={() => onToggleStatus(business.id, business.isActive)} 
                    className={`text-sm font-medium ${
                      business.isActive 
                        ? 'text-red-600 hover:text-red-900' 
                        : 'text-green-600 hover:text-green-900'
                    }`}
                  >
                    {business.isActive ? 'Desactivar' : 'Reactivar'}
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};