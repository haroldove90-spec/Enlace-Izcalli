import React from 'react';
import { StarOutlineIcon } from '../components/Icons';

export const FavoritesPage: React.FC = () => {
  return (
    <div className="flex-grow flex flex-col">
      {/* Header Section */}
      <div className="px-6 py-8 text-white">
        <h1 className="text-3xl font-black uppercase tracking-wide">Mis Favoritos</h1>
        <p className="text-white/80 mt-1">Tus negocios guardados en un solo lugar.</p>
      </div>

      {/* Content Section (white card) */}
      <div className="flex-grow bg-white rounded-t-3xl shadow-2xl p-6 pb-24">
        <div className="text-center mt-12">
          <StarOutlineIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-700">Aún no tienes favoritos</h2>
          <p className="text-slate-500 mt-2">Explora los negocios y guárdalos para verlos aquí más tarde.</p>
        </div>
      </div>
    </div>
  );
};