import React from 'react';
import { Business } from '../../types';

interface ClientsPageProps {
  businesses: Business[];
  onEditBusiness: (business: Business) => void;
}

export const ClientsPage: React.FC<ClientsPageProps> = ({ businesses, onEditBusiness }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 md:p-8 animate-fade-in max-w-7xl mx-auto border border-slate-200">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Gestión de Clientes y Anuncios</h1>
      
      <div className="border border-slate-200 rounded-lg overflow-hidden">
        <div className="hidden md:grid md:grid-cols-12 gap-4 px-4 py-3 bg-slate-50 font-semibold text-xs text-slate-600 uppercase tracking-wider items-center border-b border-slate-200">
          <div className="col-span-3">Negocio</div>
          <div className="col-span-3">Dueño</div>
          <div className="col-span-3">Email</div>
          <div className="col-span-2">Anuncio</div>
          <div className="col-span-1 text-right">Acciones</div>
        </div>

        <div className="divide-y divide-slate-200">
          {businesses.map((business) => (
            <div key={business.id} className="p-4 md:grid md:grid-cols-12 md:gap-4 md:items-center md:p-0 md:px-4 md:py-3 hover:bg-slate-50 transition-colors">
              
              {/* --- Mobile Card Layout --- */}
              <div className="md:hidden">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-lg text-slate-800 break-words pr-2">{business.name}</h3>
                  {business.isFeatured ? (
                      <span className="flex-shrink-0 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Destacado
                      </span>
                  ) : (
                      <span className="flex-shrink-0 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-slate-100 text-slate-800">
                          Estándar
                      </span>
                  )}
                </div>
                <div className="text-sm text-slate-600 space-y-1">
                  <p><span className="font-semibold text-slate-700">Dueño:</span> {business.ownerName}</p>
                  <p className="truncate"><span className="font-semibold text-slate-700">Email:</span> {business.ownerEmail}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <button onClick={() => onEditBusiness(business)} className="w-full text-sm font-medium text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                    Editar Detalles
                  </button>
                </div>
              </div>

              {/* --- Desktop Table Row Layout --- */}
              <div className="hidden md:contents">
                <div className="col-span-3 text-sm font-medium text-slate-900">{business.name}</div>
                <div className="col-span-3 text-sm text-slate-700">{business.ownerName}</div>
                <div className="col-span-3 text-sm text-slate-500 truncate">{business.ownerEmail}</div>
                <div className="col-span-2">
                  {business.isFeatured ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Destacado
                      </span>
                  ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-slate-100 text-slate-800">
                          Estándar
                      </span>
                  )}
                </div>
                <div className="col-span-1 text-right">
                  <button onClick={() => onEditBusiness(business)} className="text-sm font-medium text-red-600 hover:text-red-900">
                    Editar
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