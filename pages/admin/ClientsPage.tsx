import React from 'react';
import { Business } from '../../types';

interface ClientsPageProps {
  businesses: Business[];
  onEditBusiness: (business: Business) => void;
}

export const ClientsPage: React.FC<ClientsPageProps> = ({ businesses, onEditBusiness }) => {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg shadow-lg p-4 md:p-8 animate-fade-in max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">Gestión de Clientes y Anuncios</h1>
      
      {/* List Container */}
      <div className="space-y-4">
        {/* Header for Desktop View */}
        <div className="hidden md:grid md:grid-cols-12 gap-4 px-4 py-2 bg-neutral-950 rounded-t-lg font-medium text-xs text-gray-400 uppercase tracking-wider items-center">
          <div className="col-span-3">Negocio</div>
          <div className="col-span-3">Dueño</div>
          <div className="col-span-3">Email</div>
          <div className="col-span-2">Anuncio</div>
          <div className="col-span-1 text-right">Acciones</div>
        </div>

        {/* Business List */}
        <div className="space-y-4 md:space-y-0">
          {businesses.map((business) => (
            <div key={business.id} className="bg-neutral-900 p-4 rounded-lg shadow-md border border-neutral-800 md:shadow-none md:border-none md:rounded-none md:grid md:grid-cols-12 md:gap-4 md:items-center md:p-0 md:px-4 md:py-4 md:border-b md:border-neutral-800">
              
              {/* --- Mobile Card Layout --- */}
              <div className="md:hidden">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-lg text-gray-100 break-words pr-2">{business.name}</h3>
                  {business.isFeatured ? (
                      <span className="flex-shrink-0 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-900 text-yellow-200">
                          Destacado
                      </span>
                  ) : (
                      <span className="flex-shrink-0 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-neutral-700 text-neutral-200">
                          Estándar
                      </span>
                  )}
                </div>
                <div className="text-sm text-gray-400 space-y-1">
                  <p><span className="font-semibold text-gray-300">Dueño:</span> {business.ownerName}</p>
                  <p className="truncate"><span className="font-semibold text-gray-300">Email:</span> {business.ownerEmail}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-neutral-800">
                  <button onClick={() => onEditBusiness(business)} className="w-full text-sm font-medium text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md transition-colors shadow-sm">
                    Editar
                  </button>
                </div>
              </div>

              {/* --- Desktop Table Row Layout --- */}
              <div className="hidden md:contents">
                <div className="col-span-3 text-sm font-medium text-gray-100">{business.name}</div>
                <div className="col-span-3 text-sm text-gray-300">{business.ownerName}</div>
                <div className="col-span-3 text-sm text-gray-400 truncate">{business.ownerEmail}</div>
                <div className="col-span-2">
                  {business.isFeatured ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-900 text-yellow-200">
                          Destacado
                      </span>
                  ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-neutral-700 text-neutral-200">
                          Estándar
                      </span>
                  )}
                </div>
                <div className="col-span-1 text-right">
                  <button onClick={() => onEditBusiness(business)} className="text-sm font-medium text-red-500 hover:text-red-400">
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