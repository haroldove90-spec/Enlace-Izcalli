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
    <div className="animate-fade-in max-w-4xl mx-auto">
        <div className="flex flex-col items-center mb-8">
            <UserCircleIcon className="w-24 h-24 text-gray-400 mb-4" />
            <h1 className="text-3xl font-bold text-gray-800">Mi Perfil</h1>
            <p className="text-gray-600">Gestiona tus preferencias y ajustes.</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
             {/* Advertise Link */}
             <div 
                className="group flex items-center p-4 bg-gray-50 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                onClick={() => setActiveView('advertise')}
            >
                <MegaphoneIcon className="w-8 h-8 text-red-500 mr-4" />
                <div>
                    <h3 className="font-bold text-gray-800 group-hover:text-red-600">Anúnciate con Nosotros</h3>
                    <p className="text-sm text-gray-600">Haz crecer tu negocio llegando a más clientes locales.</p>
                </div>
             </div>

             {/* Admin Toggle */}
             <div 
                className="group flex items-center p-4 bg-gray-50 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                onClick={handleRoleChange}
            >
                <ShieldCheckIcon className="w-8 h-8 text-red-500 mr-4" />
                <div>
                    <h3 className="font-bold text-gray-800 group-hover:text-red-600">
                        {currentUserRole === 'user' ? 'Cambiar a Vista de Admin' : 'Volver a Vista de Usuario'}
                    </h3>
                    <p className="text-sm text-gray-600">Accede al panel de administración para gestionar el contenido.</p>
                </div>
             </div>
        </div>
    </div>
  );
};