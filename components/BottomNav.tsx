import React from 'react';
import { HomeIcon, CategoryIcon, MegaphoneIcon, MapIcon, ChartBarIcon, PlusCircleIcon, TagIcon, UsersIcon } from './Icons';
import { View, UserRole } from '../App';

interface BottomNavProps {
  activeView: View;
  setActiveView: (view: View) => void;
  currentUserRole: UserRole;
}

const userNavLinks: { id: View; name: string; icon: React.FC<any> }[] = [
  { id: 'home', name: 'Home', icon: HomeIcon },
  { id: 'categories', name: 'Categorias', icon: CategoryIcon },
  { id: 'advertise', name: 'Anunciate', icon: MegaphoneIcon },
  { id: 'zones', name: 'Zonas', icon: MapIcon },
];

const adminNavLinks: { id: View; name: string; icon: React.FC<any> }[] = [
  { id: 'adminDashboard', name: 'Dashboard', icon: ChartBarIcon },
  { id: 'adminAddBusiness', name: 'Añadir', icon: PlusCircleIcon },
  { id: 'adminManageCategories', name: 'Categorías', icon: TagIcon },
  { id: 'adminClients', name: 'Clientes', icon: UsersIcon },
];

export const BottomNav: React.FC<BottomNavProps> = ({ activeView, setActiveView, currentUserRole }) => {
  let navLinks = currentUserRole === 'admin' ? adminNavLinks : userNavLinks;

  // Add the admin toggle to user view for mobile demo without mutating the original array
  if (currentUserRole === 'user') {
    navLinks = [...userNavLinks, { id: 'adminDashboard', name: 'Admin', icon: ChartBarIcon }];
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-red-600 shadow-t-lg z-50">
      <div className="flex justify-around items-center h-16">
        {navLinks.map((link) => {
            const isActive = activeView === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveView(link.id)}
                className={`flex flex-col items-center justify-center text-center w-full px-1 py-1 transition-all duration-200 transform focus:outline-none ${isActive ? 'text-white scale-110' : 'text-red-200'} hover:text-white`}
                aria-label={link.name}
              >
                <link.icon className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">{link.name}</span>
              </button>
            )
        })}
      </div>
    </nav>
  );
};