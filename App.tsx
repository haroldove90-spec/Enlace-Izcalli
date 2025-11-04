import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomePage } from './pages/HomePage';
import { CategoriesPage } from './pages/CategoriesPage';
import { AdvertisePage } from './pages/AdvertisePage';
import { ZonesPage } from './pages/ZonesPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AddBusinessPage } from './pages/admin/AddBusinessPage';
import { ManageCategoriesPage } from './pages/admin/ManageCategoriesPage';
import { ClientsPage } from './pages/admin/ClientsPage';
import { EditBusinessPage } from './pages/admin/EditBusinessPage';
import { ManageBusinessesPage } from './pages/admin/ManageBusinessesPage';
import { PwaInstallPrompt } from './components/PwaInstallPrompt';
import { CATEGORIES as initialCategories, BUSINESSES as initialBusinesses } from './constants';
import { Business, Category } from './types';

export type View = 'home' | 'categories' | 'advertise' | 'zones' | 'adminDashboard' | 'adminAddBusiness' | 'adminManageCategories' | 'adminClients' | 'adminEditBusiness' | 'adminManageBusinesses';
export type UserRole = 'user' | 'admin';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string; }>;
  prompt(): Promise<void>;
}

const App: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>(() => {
    try {
      const savedBusinesses = localStorage.getItem('enlaceIzcalli-businesses');
      if (savedBusinesses) {
        return JSON.parse(savedBusinesses);
      }
      // If nothing in localStorage, save initial data
      localStorage.setItem('enlaceIzcalli-businesses', JSON.stringify(initialBusinesses));
      return initialBusinesses;
    } catch (error) {
      console.error('Failed to load businesses from localStorage', error);
      return initialBusinesses;
    }
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const savedCategories = localStorage.getItem('enlaceIzcalli-categories');
      if (savedCategories) {
        return JSON.parse(savedCategories);
      }
      // If nothing in localStorage, save initial data
      localStorage.setItem('enlaceIzcalli-categories', JSON.stringify(initialCategories));
      return initialCategories;
    } catch (error) {
      console.error('Failed to load categories from localStorage', error);
      return initialCategories;
    }
  });

  const [activeView, setActiveView] = useState<View>('home');
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('user');
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);

  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  
  // Effect to save businesses to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('enlaceIzcalli-businesses', JSON.stringify(businesses));
    } catch (error) {
      console.error('Failed to save businesses to localStorage', error);
    }
  }, [businesses]);

  // Effect to save categories to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('enlaceIzcalli-categories', JSON.stringify(categories));
    } catch (error) {
      console.error('Failed to save categories to localStorage', error);
    }
  }, [categories]);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);
  
  // Effect to check for expired promotions on app load
  useEffect(() => {
    const now = new Date();
    setBusinesses(prevBusinesses => 
      prevBusinesses.map(b => {
        if (b.isActive && new Date(b.promotionEndDate) < now) {
          return { ...b, isActive: false };
        }
        return b;
      })
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInstallClick = () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(() => {
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    });
  };

  const handleViewChange = (view: View) => {
    // If switching out of admin role, go to home
    if (currentUserRole === 'admin' && !view.startsWith('admin')) {
      setCurrentUserRole('user');
    }
    // If switching into admin role, go to dashboard
    if (currentUserRole === 'user' && view.startsWith('admin')) {
       setCurrentUserRole('admin');
    }
    setActiveView(view);
  };
  
  const handleEditClick = (business: Business) => {
    setEditingBusiness(business);
    setActiveView('adminEditBusiness');
  };

  const handleUpdateBusiness = (updatedBusiness: Business) => {
    setBusinesses(businesses.map(b => b.id === updatedBusiness.id ? updatedBusiness : b));
    setEditingBusiness(null);
    setActiveView('adminClients'); // Or maybe adminManageBusinesses
    alert('Negocio actualizado con éxito!');
  };

  const handleAddBusiness = (newBusiness: Omit<Business, 'id'>) => {
    setBusinesses(prev => [...prev, {...newBusiness, id: Date.now()}]);
    alert('Negocio añadido con éxito!');
    setActiveView('adminDashboard');
  };

  const handleToggleBusinessStatus = (businessId: number, currentStatus: boolean) => {
      const business = businesses.find(b => b.id === businessId);
      if (!business) return;

      if (currentStatus) { // If currently active, deactivate
          if (window.confirm('¿Estás seguro de que quieres desactivar este anuncio?')) {
              setBusinesses(businesses.map(b => b.id === businessId ? { ...b, isActive: false } : b));
          }
      } else { // If currently inactive, reactivate
           const durationInput = prompt("Selecciona la nueva duración en meses para reactivar el anuncio (ej. 1, 3, 6, 12):", "1");
           if (durationInput === null) return; // User cancelled
           
           const months = parseInt(durationInput, 10);
           if (isNaN(months) || months <= 0) {
               alert("Por favor, introduce un número válido de meses.");
               return;
           }

           const newEndDate = new Date();
           newEndDate.setMonth(newEndDate.getMonth() + months);
           
           setBusinesses(businesses.map(b => b.id === businessId ? { ...b, isActive: true, promotionEndDate: newEndDate.toISOString() } : b));
           alert(`Negocio reactivado hasta ${newEndDate.toLocaleDateString()}.`);
      }
  };
  
  const getCategoryName = (categoryId: number): string => {
    return categories.find(c => c.id === categoryId)?.name || 'Sin Categoría';
  };

  const renderContent = () => {
    switch (activeView) {
      case 'home':
        return <HomePage categories={categories} businesses={businesses.filter(b => b.isActive)} getCategoryName={getCategoryName} />;
      case 'categories':
        return <CategoriesPage categories={categories} />;
      case 'advertise':
        return <AdvertisePage />;
      case 'zones':
        return <ZonesPage />;
      case 'adminDashboard':
        return <AdminDashboardPage businesses={businesses} categories={categories} setActiveView={handleViewChange} />;
      case 'adminAddBusiness':
        return <AddBusinessPage categories={categories} onAddBusiness={handleAddBusiness} setActiveView={handleViewChange} />;
      case 'adminManageCategories':
        return <ManageCategoriesPage categories={categories} setCategories={setCategories} />;
       case 'adminClients':
        return <ClientsPage businesses={businesses} onEditBusiness={handleEditClick} />;
       case 'adminManageBusinesses':
        return <ManageBusinessesPage businesses={businesses} onToggleStatus={handleToggleBusinessStatus} onEditBusiness={handleEditClick} />;
      case 'adminEditBusiness':
        return editingBusiness ? <EditBusinessPage businessToEdit={editingBusiness} categories={categories} onUpdateBusiness={handleUpdateBusiness} onCancel={() => setActiveView('adminClients')} /> : <p>No business selected for editing.</p>;
      default:
        return <HomePage categories={categories} businesses={businesses.filter(b => b.isActive)} getCategoryName={getCategoryName} />;
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar activeView={activeView} setActiveView={handleViewChange} currentUserRole={currentUserRole} setCurrentUserRole={setCurrentUserRole}/>
      <div className="flex-1 flex flex-col md:ml-64">
        <Header />
        <main className="flex-grow p-4 md:p-8 pb-20 md:pb-8">
          {renderContent()}
        </main>
        <BottomNav activeView={activeView} setActiveView={handleViewChange} currentUserRole={currentUserRole}/>
        {showInstallPrompt && <PwaInstallPrompt onInstall={handleInstallClick} onDismiss={() => setShowInstallPrompt(false)} />}
      </div>
    </div>
  );
};

export default App;