import React from 'react';
import { View, UserRole } from '../../App';

interface AdminHeaderProps {
  activeView: View;
  setActiveView: (view: View) => void;
  setCurrentUserRole: (role: UserRole) => void;
}

const adminNavLinks: { id: View; name: string; }[] = [
  { id: 'adminDashboard', name: 'Dashboard' },
  { id: 'adminManageBusinesses', name: 'Businesses' },
  { id: 'adminClients', name: 'Clients' },
  { id: 'adminManageCategories', name: 'Categories' },
  { id: 'adminAddBusiness', name: 'Add New' },
];

export const AdminHeader: React.FC<AdminHeaderProps> = ({ activeView, setActiveView, setCurrentUserRole }) => {

  const handleRoleChange = () => {
    setCurrentUserRole('user');
    setActiveView('home');
  };
  
  return (
    <header className="bg-black border-b border-neutral-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button onClick={() => setActiveView('adminDashboard')} className="flex-shrink-0">
               <img 
                src="https://appdesignmex.com/enlaceizcalliicono.png" 
                alt="Enlace Izcalli Logo" 
                className="h-8 w-auto invert"
              />
            </button>
            <span className="text-gray-500 mx-3">/</span>
            <span className="font-semibold text-white">Admin Panel</span>
          </div>
          <button 
            onClick={handleRoleChange} 
            className="text-sm text-gray-400 hover:text-white font-semibold focus:outline-none"
          >
            Ver como Usuario
          </button>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-neutral-800">
        <div className="flex items-center space-x-2 sm:space-x-4 -mb-px overflow-x-auto">
          {adminNavLinks.map((link) => (
            <button 
              key={link.id}
              onClick={() => setActiveView(link.id)}
              className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeView === link.id
                  ? 'border-white text-white'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              {link.name}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
