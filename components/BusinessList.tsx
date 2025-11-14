import React from 'react';
import { Business } from '../types';
import { BusinessCard } from './BusinessCard';

interface BusinessListProps {
  businesses: Business[];
  getCategoryName: (categoryId: number) => string;
  onSelectBusiness: (business: Business) => void;
}

export const BusinessList: React.FC<BusinessListProps> = ({ businesses, getCategoryName, onSelectBusiness }) => {
  if (businesses.length === 0) {
    return <p className="text-center text-gray-500 mt-12">No se encontraron negocios en esta categoría.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {businesses.map(business => (
        <BusinessCard 
          key={business.id} 
          business={business} 
          categoryName={getCategoryName(business.categoryId)}
          onSelect={onSelectBusiness}
        />
      ))}
    </div>
  );
};