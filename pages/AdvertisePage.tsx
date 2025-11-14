import React from 'react';
import { MegaphoneIcon, ShieldCheckIcon, UserCircleIcon } from '../components/Icons';
import { View } from '../types';

interface AdvertisePageProps {
    setActiveView: (view: View) => void;
}

const BenefitCard: React.FC<{ icon: React.FC<any>, title: string, children: React.ReactNode }> = ({ icon: Icon, title, children }) => (
    <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 text-center md:text-left">
        <div className="flex flex-col md:flex-row items-center mb-3">
            <div className="flex-shrink-0 bg-red-100 p-3 rounded-full mb-3 md:mb-0 md:mr-4">
                <Icon className="w-6 h-6 text-red-600"/>
            </div>
            <h3 className="text-xl font-bold text-slate-800">{title}</h3>
        </div>
        <p className="text-slate-600">{children}</p>
    </div>
);

export const AdvertisePage: React.FC<AdvertisePageProps> = ({ setActiveView }) => {
  return (
    <div className="animate-fade-in max-w-7xl mx-auto space-y-12">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center border border-slate-200">
        <MegaphoneIcon className="w-16 h-16 text-red-500 mx-auto mb-6" />
        <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Haz Crecer Tu Negocio en Izcalli</h1>
        <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">Únete a Enlace Izcalli y conecta con miles de clientes potenciales en tu comunidad.</p>
        <a 
          href="mailto:ventas@enlaceizcalli.com?subject=Interesado en anunciarme"
          className="inline-block bg-red-600 text-white font-bold py-4 px-10 rounded-full text-lg transition-transform transform hover:scale-105 duration-300 shadow-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          ¡Contáctanos Ahora!
        </a>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-8 border border-slate-200">
        <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Nuestros Beneficios</h2>
        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
            <BenefitCard icon={UserCircleIcon} title="Visibilidad Local">
                Llega directamente a los residentes de Cuautitlán Izcalli que buscan activamente productos y servicios como los tuyos.
            </BenefitCard>
            <BenefitCard icon={MegaphoneIcon} title="Promociones Efectivas">
                Destaca tus ofertas y promociones especiales en nuestra sección de 'Destacados' para atraer más clientes.
            </BenefitCard>
            <BenefitCard icon={ShieldCheckIcon} title="Confianza y Credibilidad">
                Forma parte de un directorio confiable y bien establecido en la comunidad, aumentando la confianza en tu marca.
            </BenefitCard>
        </div>
      </div>
    </div>
  );
};

// This export is needed to solve a weird issue with the bundler
// that happens when there is only one export in the file.
export const _placeholder = {};