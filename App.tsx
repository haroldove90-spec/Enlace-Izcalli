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
import { PwaInstallPrompt } from './components/PwaInstallPrompt';
import { CATEGORIES as initialCategories, BUSINESSES as initialBusinesses } from './constants';
import { Business, Category } from './types';

export type View = 'home' | 'categories' | 'advertise' | 'zones' | 'adminDashboard' | 'adminAddBusiness' | 'adminManageCategories' | 'adminClients' | 'adminEditBusiness';
export type UserRole = 'user' | 'admin';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string; }>;
  prompt(): Promise<void>;
}

const App: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>(initialBusinesses);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [activeView, setActiveView] = useState<View>('home');
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('user');
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);

  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
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
    setActiveView('adminClients');
    alert('Negocio actualizado con éxito!');
  };

  const handleAddBusiness = (newBusiness: Omit<Business, 'id'>) => {
    setBusinesses(prev => [...prev, {...newBusiness, id: Date.now()}]);
    alert('Negocio añadido con éxito!');
    setActiveView('adminDashboard');
  };
  
  const getCategoryName = (categoryId: number): string => {
    return categories.find(c => c.id === categoryId)?.name || 'Sin Categoría';
  };

  const renderContent = () => {
    switch (activeView) {
      case 'home':
        return <HomePage categories={categories} businesses={businesses} getCategoryName={getCategoryName} />;
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
      case 'adminEditBusiness':
        return editingBusiness ? <EditBusinessPage businessToEdit={editingBusiness} categories={categories} onUpdateBusiness={handleUpdateBusiness} onCancel={() => setActiveView('adminClients')} /> : <p>No business selected for editing.</p>;
      default:
        return <HomePage categories={categories} businesses={businesses} getCategoryName={getCategoryName} />;
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
