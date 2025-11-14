import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomePage } from './pages/HomePage';
import { CategoriesPage } from './pages/CategoriesPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ZonesPage } from './pages/ZonesPage';
import { MapViewPage } from './pages/MapViewPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AddBusinessPage } from './pages/admin/AddBusinessPage';
import { ManageCategoriesPage } from './pages/admin/ManageCategoriesPage';
import { ClientsPage } from './pages/admin/ClientsPage';
import { EditBusinessPage } from './pages/admin/EditBusinessPage';
import { ManageBusinessesPage } from './pages/admin/ManageBusinessesPage';
import { PwaInstallPrompt } from './components/PwaInstallPrompt';
import { Business, Category, View, UserRole, Review } from './types';
import { BUSINESSES, CATEGORIES } from './constants';
import { supabase } from './supabaseClient';
import { BusinessDetailPage } from './pages/BusinessDetailPage';

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
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [usingFallbackData, setUsingFallbackData] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setUsingFallbackData(false);

    try {
      // Fetch essential data: businesses and categories
      const [
        { data: businessesData, error: businessesError },
        { data: categoriesData, error: categoriesError }
      ] = await Promise.all([
        supabase.from('businesses').select('*').order('id'),
        supabase.from('categories').select('*').order('id')
      ]);

      if (businessesError || categoriesError) {
        throw businessesError || categoriesError;
      }

      // Fetch non-essential data: reviews. If this fails, the app can still function.
      const { data: reviewsData, error: reviewsError } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });

      if (reviewsError) {
        console.warn("Could not fetch reviews, proceeding without them:", reviewsError);
      }

      const finalCategories: Category[] = Array.isArray(categoriesData) ? categoriesData : [];
      const allReviewsRaw = (reviewsError || !Array.isArray(reviewsData)) ? [] : reviewsData;

      // Map reviews from snake_case (db) to camelCase (app)
      const allReviews: Review[] = allReviewsRaw.map((r: any) => ({
        id: r.id,
        businessId: r.business_id,
        userName: r.user_name,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.created_at,
      }));
      
      const processedBusinesses: Business[] = (Array.isArray(businessesData) ? businessesData : []).map((b: any) => {
        const businessReviews = allReviews.filter(r => r.businessId === b.id);
        const totalRating = businessReviews.reduce((acc, review) => acc + review.rating, 0);
        const averageRating = businessReviews.length > 0 ? totalRating / businessReviews.length : 0;
        const isActive = new Date(b.promotion_end_date) >= new Date();

        // Map business data from snake_case to camelCase to match the app's types
        return { 
          id: b.id,
          name: b.name,
          description: b.description,
          logoUrl: b.logo_url,
          phone: b.phone,
          whatsapp: b.whatsapp,
          website: b.website,
          categoryId: b.category_id,
          services: b.services || [],
          products: b.products || [],
          isFeatured: b.is_featured,
          ownerName: b.owner_name,
          ownerEmail: b.owner_email,
          isActive,
          promotionEndDate: b.promotion_end_date,
          address: b.address,
          latitude: b.latitude,
          longitude: b.longitude,
          googleMapsUrl: b.google_maps_url,
          reviews: businessReviews,
          averageRating
        };
      });

      setBusinesses(processedBusinesses);
      setCategories(finalCategories);

    } catch (error) {
      console.error("Failed to fetch essential data from Supabase, falling back to local mock data:", error);
      setUsingFallbackData(true);
      const now = new Date();
      const fallbackBusinesses = BUSINESSES.map(b => {
          const isActive = new Date(b.promotionEndDate) >= now;
          return {
              ...b,
              isActive,
              reviews: [],
              averageRating: 0,
          };
      });
      setBusinesses(fallbackBusinesses);
      setCategories(CATEGORIES);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // This effect keeps the `selectedBusiness` state in sync with the main `businesses` list.
  // This is useful after a refetch (e.g., after adding a review).
  useEffect(() => {
    if (selectedBusiness) {
      const updatedSelected = businesses.find(b => b.id === selectedBusiness.id);
      if (updatedSelected && JSON.stringify(selectedBusiness) !== JSON.stringify(updatedSelected)) {
        setSelectedBusiness(updatedSelected);
      }
    }
  }, [businesses, selectedBusiness]);

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
      const { reviews, averageRating, ...businessToUpdate } = updatedBusiness;
      const { error } = await supabase.from('businesses').update(businessToUpdate).eq('id', businessToUpdate.id);
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

  const handleAddBusiness = async (newBusiness: Omit<Business, 'id' | 'reviews' | 'averageRating'>) => {
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
  
  const handleSelectBusiness = (business: Business) => {
    setSelectedBusiness(business);
    setActiveView('businessDetail');
  };
  
  const handleBackToList = () => {
    setSelectedBusiness(null);
    setActiveView('home');
  };
  
  const handleAddReview = async (reviewData: Omit<Review, 'id' | 'createdAt'>) => {
     try {
        const { error } = await supabase.from('reviews').insert([reviewData]);
        if (error) throw error;
        
        await fetchData(); // This will refetch all data and trigger the useEffect to update the selected business
        alert('Reseña añadida con éxito!');
      } catch (error) {
        console.error("Error adding review:", error);
        alert('Error al añadir la reseña.');
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
  
  const mainPadding = activeView === 'map' ? '' : 'p-4 md:p-8 pb-20 md:pb-8';

  const renderContent = () => {
    if (isLoading) return renderLoading();
    
    switch (activeView) {
      case 'home':
        return <HomePage categories={categories} businesses={businesses.filter(b => b.isActive)} getCategoryName={getCategoryName} onSelectBusiness={handleSelectBusiness} />;
      case 'categories':
        return <CategoriesPage categories={categories} />;
      case 'notifications':
        return <NotificationsPage />;
      case 'zones':
        return <ZonesPage businesses={businesses.filter(b => b.isActive)} getCategoryName={getCategoryName} onSelectBusiness={handleSelectBusiness} />;
      case 'map':
        return <MapViewPage businesses={businesses.filter(b => b.isActive)} categories={categories} onSelectBusiness={handleSelectBusiness} />;
      case 'businessDetail':
        return selectedBusiness ? (
            <BusinessDetailPage 
                business={selectedBusiness} 
                onBack={handleBackToList}
                getCategoryName={getCategoryName}
                onAddReview={handleAddReview}
            />
        ) : <p>Negocio no seleccionado.</p>;
      case 'adminDashboard':
        return <AdminDashboardPage businesses={businesses} categories={categories} setActiveView={handleViewChange} />;
      case 'adminAddBusiness':
        return <AddBusinessPage categories={categories} onAddBusiness={handleAddBusiness} setActiveView={handleViewChange} onCategoriesUpdate={fetchData} />;
      case 'adminManageCategories':
        return <ManageCategoriesPage categories={categories} onCategoriesUpdate={fetchData} />;
       case 'adminClients':
        return <ClientsPage businesses={businesses} onEditBusiness={handleEditClick} />;
       case 'adminManageBusinesses':
        return <ManageBusinessesPage businesses={businesses} onToggleStatus={handleToggleBusinessStatus} onEditBusiness={handleEditClick} />;
      case 'adminEditBusiness':
        return editingBusiness ? <EditBusinessPage businessToEdit={editingBusiness} categories={categories} onUpdateBusiness={handleUpdateBusiness} onCancel={() => setActiveView('adminClients')} setActiveView={handleViewChange} onCategoriesUpdate={fetchData} /> : <p>No business selected for editing.</p>;
      default:
        return <HomePage categories={categories} businesses={businesses.filter(b => b.isActive)} getCategoryName={getCategoryName} onSelectBusiness={handleSelectBusiness} />;
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar activeView={activeView} setActiveView={handleViewChange} currentUserRole={currentUserRole} setCurrentUserRole={setCurrentUserRole}/>
      <div className="flex-1 flex flex-col md:ml-64 overflow-x-hidden">
        {usingFallbackData && (
            <div className="bg-red-500 text-white text-center p-2 text-sm font-semibold sticky top-0 z-50 md:relative">
              <span>Error de conexión. Mostrando datos de ejemplo.</span>
            </div>
        )}
        <Header />
        <main className={`flex-grow ${mainPadding}`}>
          {renderContent()}
        </main>
        <BottomNav activeView={activeView} setActiveView={handleViewChange} currentUserRole={currentUserRole}/>
        {showInstallPrompt && <PwaInstallPrompt onInstall={handleInstallClick} onDismiss={() => setShowInstallPrompt(false)} />}
      </div>
    </div>
  );
};

export default App;
