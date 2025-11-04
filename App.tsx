
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
import { PwaInstallPrompt } from './components/PwaInstallPrompt';
import { CATEGORIES as initialCategories, BUSINESSES as initialBusinesses } from './constants';
import { Business, Category } from './types';

export type View = 'home' | 'categories' | 'advertise' | 'zones' | 'adminDashboard' | 'adminAddBusiness' | 'adminManageCategories';

// Custom event type for BeforeInstallPromptEvent
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const App: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>(initialBusinesses);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [activeView, setActiveView] = useState<View>('home');

  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    });
  };

  const handleDismissInstall = () => {
    setShowInstallPrompt(false);
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
        return <AdminDashboardPage businesses={businesses} categories={categories} setActiveView={setActiveView} />;
      case 'adminAddBusiness':
        return <AddBusinessPage categories={categories} onAddBusiness={(newBusiness) => setBusinesses(prev => [...prev, {...newBusiness, id: Date.now()}])} setActiveView={setActiveView} />;
      case 'adminManageCategories':
        return <ManageCategoriesPage categories={categories} setCategories={setCategories} />;
      default:
        return <HomePage categories={categories} businesses={businesses} getCategoryName={getCategoryName} />;
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex-1 flex flex-col md:ml-64">
        <Header />
        <main className="flex-grow p-4 md:p-8 pb-20 md:pb-8">
          {renderContent()}
        </main>
        <BottomNav activeView={activeView} setActiveView={setActiveView} />
        {showInstallPrompt && <PwaInstallPrompt onInstall={handleInstallClick} onDismiss={handleDismissInstall} />}
      </div>
    </div>
  );
};

export default App;
