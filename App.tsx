import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { HomePage } from './pages/HomePage';
import { CategoriesPage } from './pages/CategoriesPage';
import { AdvertisePage } from './pages/AdvertisePage';
import { ZonesPage } from './pages/ZonesPage';
import { BUSINESSES, CATEGORIES } from './constants';

type View = 'home' | 'categories' | 'advertise' | 'zones';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('home');

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
    </div>
  );
};

export default App;