import React, { useState, useEffect } from 'react';
import { MegaphoneIcon } from '../components/Icons';
import { supabase } from '../supabaseClient';

// This VAPID key would normally be stored in environment variables
// It's used to identify the application server to the push service.
const VAPID_PUBLIC_KEY = 'BPhgcyS29fN19F1n_2Ld1sASKT1mHfc4V_548p6i5qNI4kY3Kx4E7q-jQPb9t5T_b48f_3XJp-8G0j6v3aU0rXg';

const urlBase64ToUint8Array = (base64String: string) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};


export const NotificationsPage: React.FC = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notificationPermission, setNotificationPermission] = useState(Notification.permission);

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.ready.then(reg => {
        reg.pushManager.getSubscription().then(sub => {
          if (sub) {
            setIsSubscribed(true);
          }
          setIsLoading(false);
        });
      });
    } else {
        setIsLoading(false);
    }
  }, []);

  const handleSubscriptionChange = async () => {
    if (!('serviceWorker' in navigator && 'PushManager' in window)) {
        alert("Las notificaciones push no son soportadas en este navegador.");
        return;
    }
    
    const registration = await navigator.serviceWorker.ready;
    
    if (isSubscribed) {
      // Unsubscribe
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        // Notify backend to remove subscription
        const { error } = await supabase.from('subscriptions').delete().eq('endpoint', subscription.endpoint);
        if (error) console.error('Error unsubscribing:', error);
        setIsSubscribed(false);
        alert('Te has desuscrito de las notificaciones.');
      }
    } else {
      // Subscribe
      if (Notification.permission === 'denied') {
          alert('Has bloqueado las notificaciones. Por favor, habilítalas en la configuración de tu navegador.');
          return;
      }
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });
      
      // Notify backend to save subscription
      const { error } = await supabase.from('subscriptions').upsert({
          endpoint: subscription.endpoint,
          subscription_data: subscription,
      }, { onConflict: 'endpoint' });
      
      if (error) {
        console.error('Error saving subscription:', error);
        alert('Hubo un error al guardar tu suscripción.');
        return;
      }
      
      setIsSubscribed(true);
      alert('¡Gracias por suscribirte a las notificaciones!');
    }
    setNotificationPermission(Notification.permission);
  };
  
  const renderSubscriptionButton = () => {
    if (!('serviceWorker' in navigator && 'PushManager' in window)) {
        return <p className="text-center text-gray-600">Este navegador no soporta notificaciones push.</p>;
    }
    
    if (isLoading) {
      return <p className="text-center text-gray-600">Cargando...</p>;
    }

    if (notificationPermission === 'denied') {
      return <p className="text-center text-red-600 font-semibold">Has bloqueado las notificaciones. Para recibirlas, debes cambiar los permisos en la configuración de tu navegador.</p>;
    }

    return (
        <button
          onClick={handleSubscriptionChange}
          className={`font-bold py-4 px-10 rounded-full text-lg transition-transform transform hover:scale-105 duration-300 inline-flex items-center justify-center shadow-lg ${isSubscribed ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}
        >
          {isSubscribed ? 'Desactivar Notificaciones' : 'Activar Notificaciones'}
        </button>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 animate-fade-in max-w-7xl mx-auto text-center">
        <MegaphoneIcon className="w-20 h-20 text-red-500 mx-auto mb-6" />
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">Mantente Conectado</h1>
        <p className="text-xl text-gray-600 mb-8">Activa las notificaciones para recibir ofertas exclusivas y ser el primero en conocer los nuevos negocios en Izcalli.</p>

        <div className="my-12">
            {renderSubscriptionButton()}
        </div>
        
        <div className="mt-12 text-left max-w-2xl mx-auto text-gray-600">
             <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">¿Qué recibirás?</h2>
             <ul className="list-disc list-inside space-y-2">
                <li><span className="font-semibold">Promociones Especiales:</span> Descuentos y ofertas que solo los suscriptores conocen.</li>
                <li><span className="font-semibold">Nuevos Negocios:</span> Entérate cuando un nuevo y emocionante comercio se una a nuestro directorio.</li>
                <li><span className="font-semibold">Eventos Locales:</span> Información sobre eventos y actividades en los comercios de Cuautitlán Izcalli.</li>
             </ul>
        </div>
    </div>
  );
};
