import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomePage } from './pages/HomePage';
import { CategoriesPage } from './pages/CategoriesPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ZonesPage } from './pages/ZonesPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AddBusinessPage } from './pages/admin/AddBusinessPage';
import { ManageCategoriesPage } from './pages/admin/ManageCategoriesPage';
import { ClientsPage } from './pages/admin/ClientsPage';
import { EditBusinessPage } from './pages/admin/EditBusinessPage';
import { ManageBusinessesPage } from './pages/admin/ManageBusinessesPage';
import { PwaInstallPrompt } from './components/PwaInstallPrompt';
import { Business, Category } from './types';
import { BUSINESSES, CATEGORIES } from './constants';
import { supabase } from './supabaseClient';

export type View = 'home' | 'categories' | 'notifications' | 'zones' | 'adminDashboard' | 'adminAddBusiness' | 'adminManageCategories' | 'adminClients' | 'adminEditBusiness' | 'adminManageBusinesses';
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
  const [usingFallbackData, setUsingFallbackData] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: businessesData, error: businessesError } = await supabase.from('businesses').select('*').order('id');
      const { data: categoriesData, error: categoriesError } = await supabase.from('categories').select('*').order('id');
      
      if (businessesError) throw businessesError;
      if (categoriesError) throw categoriesError;

      let finalBusinesses = Array.isArray(businessesData) ? businessesData : [];
      const finalCategories = Array.isArray(categoriesData) ? categoriesData : [];
      
      // Process expirations right after fetching
      if (finalBusinesses.length > 0) {
          const now = new Date();
          finalBusinesses = finalBusinesses.map(b => {
              if (b.isActive && new Date(b.promotionEndDate) < now) {
                  return { ...b, isActive: false };
              }
              return b;
          });
      }

      setBusinesses(finalBusinesses);
      setCategories(finalCategories);
      setUsingFallbackData(false);

    } catch (error) {
      console.error("Failed to fetch data from Supabase, falling back to local mock data:", error);
      setUsingFallbackData(true);
      // Fallback to local data on API failure
      let finalBusinesses = BUSINESSES;
      const finalCategories = CATEGORIES;
      const now = new Date();
      finalBusinesses = finalBusinesses.map(b => {
          if (b.isActive && new Date(b.promotionEndDate) < now) {
              return { ...b, isActive: false };
          }
          return b;
      });

      setBusinesses(finalBusinesses);
      setCategories(finalCategories);
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
      const { error } = await supabase.from('businesses').update(updatedBusiness).eq('id', updatedBusiness.id);
      if (error) throw error;

      await fetchData();
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
      const { error } = await supabase.from('businesses').insert([newBusiness]);
      if (error) throw error;
      
      await fetchData();
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
        const { error } = await supabase.from('businesses').update({ isActive: newStatus, promotionEndDate: newEndDate }).eq('id', business.id);
        if (error) throw error;

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
      case 'notifications':
        return <NotificationsPage />;
      case 'zones':
        return <ZonesPage businesses={businesses.filter(b => b.isActive)} getCategoryName={getCategoryName} />;
      case 'adminDashboard':
        return <AdminDashboardPage businesses={businesses} categories={categories} setActiveView={handleViewChange} usingFallbackData={usingFallbackData} />;
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
      <div className="flex-1 flex flex-col md:ml-64 overflow-x-hidden">
        {usingFallbackData && (
            <div className="bg-red-500 text-white text-center p-2 text-sm font-semibold sticky top-0 z-50 md:relative">
              <span>Error de conexión con Supabase. Mostrando datos de ejemplo.</span>
              <button onClick={() => handleViewChange('adminDashboard')} className="underline ml-2 font-bold hover:text-red-200">
                  Inicializar Base de Datos
              </button>
            </div>
        )}
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
