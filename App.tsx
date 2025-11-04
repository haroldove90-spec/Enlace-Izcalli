import React, { useState, useEffect, useCallback } from 'react';
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
import { Business, Category } from './types';

export type View = 'home' | 'categories' | 'advertise' | 'zones' | 'adminDashboard' | 'adminAddBusiness' | 'adminManageCategories' | 'adminClients' | 'adminEditBusiness' | 'adminManageBusinesses';
export type UserRole = 'user' | 'admin';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string; }>;
  prompt(): Promise<void>;
}

const App: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState<View>('home');
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('user');
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [businessesRes, categoriesRes] = await Promise.all([
        fetch('/api/businesses'),
        fetch('/api/categories')
      ]);
      const businessesData = await businessesRes.json();
      const categoriesData = await categoriesRes.json();
      setBusinesses(businessesData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      // Optionally, set some error state to show in the UI
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);
  
  // Effect to check for expired promotions on app load - this can remain client-side for immediate UI feedback
  useEffect(() => {
    const now = new Date();
    setBusinesses(prevBusinesses => 
      prevBusinesses.map(b => {
        if (b.isActive && new Date(b.promotionEndDate) < now) {
          // Here you could also trigger an API call to update the backend
          return { ...b, isActive: false };
        }
        return b;
      })
    );
  }, [businesses]);


  const handleInstallClick = () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(() => {
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    });
  };

  const handleViewChange = (view: View) => {
    if (currentUserRole === 'admin' && !view.startsWith('admin')) {
      setCurrentUserRole('user');
    }
    if (currentUserRole === 'user' && view.startsWith('admin')) {
       setCurrentUserRole('admin');
    }
    setActiveView(view);
  };
  
  const handleEditClick = (business: Business) => {
    setEditingBusiness(business);
    setActiveView('adminEditBusiness');
  };

  const handleUpdateBusiness = async (updatedBusiness: Business) => {
    try {
      const response = await fetch(`/api/businesses`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedBusiness),
      });
      if (!response.ok) throw new Error('Failed to update business');
      await fetchData(); // Refetch all data
      setEditingBusiness(null);
      setActiveView('adminClients');
      alert('Negocio actualizado con éxito!');
    } catch (error) {
      console.error(error);
      alert('Error al actualizar el negocio.');
    }
  };

  const handleAddBusiness = async (newBusiness: Omit<Business, 'id'>) => {
     try {
      const response = await fetch('/api/businesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBusiness),
      });
      if (!response.ok) throw new Error('Failed to add business');
      await fetchData(); // Refetch all data
      alert('Negocio añadido con éxito!');
      setActiveView('adminDashboard');
    } catch (error) {
      console.error(error);
      alert('Error al añadir el negocio.');
    }
  };

  const handleToggleBusinessStatus = async (businessId: number, currentStatus: boolean) => {
      const business = businesses.find(b => b.id === businessId);
      if (!business) return;

      let newStatus = !currentStatus;
      let newEndDate = business.promotionEndDate;

      if (!currentStatus) { // If reactivating
           const durationInput = prompt("Selecciona la nueva duración en meses para reactivar el anuncio (ej. 1, 3, 6, 12):", "1");
           if (durationInput === null) return;
           
           const months = parseInt(durationInput, 10);
           if (isNaN(months) || months <= 0) {
               alert("Por favor, introduce un número válido de meses.");
               return;
           }

           const date = new Date();
           date.setMonth(date.getMonth() + months);
           newEndDate = date.toISOString();
      } else { // If deactivating
         if (!window.confirm('¿Estás seguro de que quieres desactivar este anuncio?')) {
            return;
         }
      }
      
      try {
        const response = await fetch('/api/businesses', {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ ...business, isActive: newStatus, promotionEndDate: newEndDate })
        });
        if (!response.ok) throw new Error('Failed to toggle status');
        await fetchData();
        if(newStatus) alert(`Negocio reactivado hasta ${new Date(newEndDate).toLocaleDateString()}.`);
      } catch (error) {
        console.error(error);
        alert('Error al cambiar el estado del negocio.');
      }
  };
  
  const getCategoryName = (categoryId: number): string => {
    return categories.find(c => c.id === categoryId)?.name || 'Sin Categoría';
  };
  
  const renderLoading = () => (
    <div className="flex justify-center items-center h-full">
      <p className="text-lg text-gray-600">Cargando datos...</p>
    </div>
  );

  const renderContent = () => {
    if (isLoading) return renderLoading();
    
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
        return <ManageCategoriesPage categories={categories} onCategoriesUpdate={fetchData} />;
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
