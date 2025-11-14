import React, { useState, useEffect } from 'react';
import { BellIcon } from '../components/Icons';
import { supabase } from '../supabaseClient';

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

const mockNotifications = [
    { id: 1, title: '¡Nueva Oferta en Tacos El Padrino!', body: 'Disfruta de un 2x1 en tacos al pastor todos los martes.', date: 'Hace 2 días' },
    { id: 2, title: 'Boutique La Elegancia: Nueva Colección', body: 'Llegó la nueva temporada de primavera. ¡Ven a conocerla!', date: 'La semana pasada' },
    { id: 3, title: 'Clínica Dental Sonrisa Feliz te espera', body: 'Agenda tu cita de limpieza dental este mes y obtén un 15% de descuento.', date: 'Hace 2 semanas' },
];

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
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        const { error } = await supabase.from('subscriptions').delete().eq('endpoint', subscription.endpoint);
        if (error) console.error('Error unsubscribing:', error);
        setIsSubscribed(false);
        alert('Te has desuscrito de las notificaciones.');
      }
    } else {
      if (Notification.permission === 'denied') {
          alert('Has bloqueado las notificaciones. Por favor, habilítalas en la configuración de tu navegador.');
          return;
      }
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });
      
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
        return <p className="text-center text-slate-600">Este navegador no soporta notificaciones push.</p>;
    }
    
    if (isLoading) {
      return <p className="text-center text-slate-600">Cargando...</p>;
    }

    if (notificationPermission === 'denied') {
      return <p className="text-center text-red-600 font-semibold">Has bloqueado las notificaciones. Para recibirlas, debes cambiar los permisos en la configuración de tu navegador.</p>;
    }

    return (
        <button
          onClick={handleSubscriptionChange}
          className={`font-bold py-4 px-10 rounded-full text-lg transition-transform transform hover:scale-105 duration-300 inline-flex items-center justify-center shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${isSubscribed ? 'bg-slate-700 hover:bg-slate-800 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}`}
        >
          {isSubscribed ? 'Desactivar Notificaciones' : 'Activar Notificaciones'}
        </button>
    );
  };

  return (
    <div className="animate-fade-in max-w-7xl mx-auto space-y-12">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center border border-slate-200">
        <BellIcon className="w-16 h-16 text-red-500 mx-auto mb-6" />
        <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Mantente Conectado</h1>
        <p className="text-xl text-slate-600 mb-8">Activa las notificaciones para recibir ofertas exclusivas y ser el primero en conocer los nuevos negocios en Izcalli.</p>
        {renderSubscriptionButton()}
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8 border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Últimas Notificaciones</h2>
        <div className="space-y-4 max-w-2xl mx-auto">
          {mockNotifications.map(notif => (
            <div key={notif.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex justify-between items-start">
                <p className="font-semibold text-slate-800">{notif.title}</p>
                <span className="text-xs text-slate-400 flex-shrink-0 ml-4">{notif.date}</span>
              </div>
              <p className="text-slate-600 mt-1">{notif.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};