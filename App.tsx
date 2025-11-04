import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { HomePage } from './pages/HomePage';
import { CategoriesPage } from './pages/CategoriesPage';
import { AdvertisePage } from './pages/AdvertisePage';
import { ZonesPage } from './pages/ZonesPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AddBusinessPage } from './pages/admin/AddBusinessPage';
import { BUSINESSES, CATEGORIES } from './constants';
import { PwaInstallPrompt } from './components/PwaInstallPrompt';

export type View = 'home' | 'categories' | 'advertise' | 'zones' | 'adminDashboard' | 'adminAddBusiness';

// Define the BeforeInstallPromptEvent interface for use in state
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('home');
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
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
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      setDeferredPrompt(null);
    });
  };

  const handleDismissInstall = () => {
    setDeferredPrompt(null);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'home':
        return <HomePage businesses={BUSINESSES} categories={CATEGORIES} />;
      case 'categories':
        return <CategoriesPage categories={CATEGORIES} />;
      case 'advertise':
        return <AdvertisePage />;
      case 'zones':
        return <ZonesPage />;
      case 'adminDashboard':
        return <AdminDashboardPage setActiveView={setActiveView} />;
      case 'adminAddBusiness':
        return <AddBusinessPage setActiveView={setActiveView} />;
      default:
        return <HomePage businesses={BUSINESSES} categories={CATEGORIES} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans flex">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="container mx-auto px-4 py-8 flex-grow pb-24 md:pb-8">
          {renderContent()}
        </main>
        <footer className="text-center py-6 bg-gray-800 text-white">
          <p>&copy; {new Date().getFullYear()} Enlace Izcalli. Todos los derechos reservados.</p>
        </footer>
      </div>
      <BottomNav activeView={activeView} setActiveView={setActiveView} />
      {deferredPrompt && (
        <PwaInstallPrompt 
          onInstall={handleInstallClick}
          onDismiss={handleDismissInstall}
        />
      )}
    </div>
  );
};

export default App;