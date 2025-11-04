import React from 'react';

interface PwaInstallPromptProps {
  onInstall: () => void;
  onDismiss: () => void;
}

export const PwaInstallPrompt: React.FC<PwaInstallPromptProps> = ({ onInstall, onDismiss }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg border-t border-gray-200 z-50 animate-fade-in-up">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <img src="https://appdesignmex.com/enlaceizcalliicono.png" alt="App Icon" className="w-12 h-12 mr-4" />
          <div>
            <h3 className="font-bold text-gray-800">Instala Enlace Izcalli</h3>
            <p className="text-sm text-gray-600">Acceso rápido a los mejores negocios locales.</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={onDismiss}
            className="text-sm font-semibold text-gray-600 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            Ahora no
          </button>
          <button 
            onClick={onInstall}
            className="text-sm font-semibold text-white bg-red-600 px-4 py-2 rounded-md hover:bg-red-700 transition-colors shadow"
          >
            Instalar
          </button>
        </div>
      </div>
    </div>
  );
};
