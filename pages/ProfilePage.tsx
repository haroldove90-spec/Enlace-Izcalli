import React from 'react';
import { MegaphoneIcon, ShieldCheckIcon, UserCircleIcon } from '../components/Icons';
import { View, UserRole } from '../types';

interface ProfilePageProps {
  setActiveView: (view: View) => void;
  currentUserRole: UserRole;
  setCurrentUserRole: (role: UserRole) => void;
}


export const ProfilePage: React.FC<ProfilePageProps> = ({ setActiveView, currentUserRole, setCurrentUserRole }) => {
    
  const handleRoleChange = () => {
    const newRole = currentUserRole === 'user' ? 'admin' : 'user';
    setCurrentUserRole(newRole);
    setActiveView(newRole === 'admin' ? 'adminDashboard' : 'home');
  };

  return (
    <div className="flex-grow flex flex-col">
       {/* Header Section */}
       <div className="px-6 py-8 text-white text-center">
          <UserCircleIcon className="w-20 h-20 text-white/80 mx-auto mb-4" />
          <h1 className="text-3xl font-black uppercase tracking-wide">Mi Perfil</h1>
          <p className="text-white/80 mt-1">Gestiona tus preferencias y ajustes.</p>
      </div>

       {/* Content Section (white card) */}
       <div className="flex-grow bg-white rounded-t-3xl shadow-2xl p-6 pb-24">
          <div className="space-y-4 max-w-md mx-auto">
              {/* Advertise Link */}
              <button 
                  className="group w-full flex items-center p-4 bg-slate-50 rounded-lg hover:bg-red-50 transition-colors cursor-pointer border border-slate-200 hover:border-red-200 text-left"
                  onClick={() => setActiveView('advertise')}
              >
                  <div className="flex-shrink-0 bg-red-100 p-3 rounded-full mr-4">
                    <MegaphoneIcon className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                      <h3 className="font-bold text-slate-800 group-hover:text-red-700 transition-colors">Anúnciate con Nosotros</h3>
                      <p className="text-sm text-slate-600">Haz crecer tu negocio llegando a más clientes locales.</p>
                  </div>
              </button>

              {/* Admin Toggle */}
              <button
                  className="group w-full flex items-center p-4 bg-slate-50 rounded-lg hover:bg-red-50 transition-colors cursor-pointer border border-slate-200 hover:border-red-200 text-left"
                  onClick={handleRoleChange}
              >
                  <div className="flex-shrink-0 bg-red-100 p-3 rounded-full mr-4">
                    <ShieldCheckIcon className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                      <h3 className="font-bold text-slate-800 group-hover:text-red-700 transition-colors">
                          {currentUserRole === 'user' ? 'Cambiar a Vista de Admin' : 'Volver a Vista de Usuario'}
                      </h3>
                      <p className="text-sm text-slate-600">Accede al panel de administración para gestionar el contenido.</p>
                  </div>
              </button>
          </div>
      </div>
    </div>
  );
};