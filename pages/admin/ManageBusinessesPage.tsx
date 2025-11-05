import React, { useState, useMemo } from 'react';
import { Business } from '../../types';
import { View } from '../../App';
import { SearchIcon, ChevronDownIcon, BriefcaseIcon, ShoppingIcon } from '../../components/Icons';

interface ManageBusinessesPageProps {
  businesses: Business[];
  onToggleStatus: (businessId: number, currentStatus: boolean) => void;
  onEditBusiness: (business: Business) => void;
  setActiveView: (view: View) => void;
}

export const ManageBusinessesPage: React.FC<ManageBusinessesPageProps> = ({ businesses, onToggleStatus, onEditBusiness, setActiveView }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredBusinesses = useMemo(() => {
    let result = businesses;
    if (searchTerm) {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      result = result.filter(b => b.name.toLowerCase().includes(lowercasedSearchTerm));
    }
    return result.sort((a, b) => new Date(b.promotionEndDate).getTime() - new Date(a.promotionEndDate).getTime());
  }, [businesses, searchTerm]);
  
  return (
    <div className="animate-fade-in max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Connect to a Business</h1>
        <p className="text-gray-400 mt-1">You can manage existing Businesses from this team, or create a new one and connect it to this project.</p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <div className="relative w-full md:flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search provider or business..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-neutral-700 rounded-md focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-shadow bg-neutral-900 text-white placeholder-gray-500"
          />
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button className="flex items-center justify-center gap-2 w-full md:w-auto px-4 py-2 border border-neutral-700 rounded-md bg-neutral-900 hover:bg-neutral-800 text-sm">
            <SearchIcon className="h-4 w-4 text-gray-400" />
            All
            <ChevronDownIcon className="h-4 w-4 text-gray-400" />
          </button>
          <button 
            onClick={() => setActiveView('adminAddBusiness')}
            className="w-full md:w-auto px-4 py-2 bg-white text-black font-semibold rounded-md hover:bg-gray-200 text-sm transition-colors"
          >
            Create Business
          </button>
        </div>
      </div>
      
      <div className="flex flex-col border border-neutral-800 rounded-lg overflow-hidden">
        {filteredBusinesses.map((business, index) => (
          <div key={business.id} className={`bg-neutral-900 ${index > 0 ? 'border-t border-neutral-800' : ''}`}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex-shrink-0">
                    {business.isFeatured ? <ShoppingIcon className="w-8 h-8 text-blue-400"/> : <BriefcaseIcon className="w-8 h-8 text-gray-400"/>}
                  </div>
                  <div className="flex-1">
                      <p className="font-semibold text-white">{business.name}</p>
                      <p className="text-sm text-gray-400">Business</p>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    {business.isActive ? (
                        <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    ) : (
                        <span className="h-2 w-2 rounded-full bg-red-500"></span>
                    )}
                    <span>
                      {business.isActive ? 'Active until' : 'Expired on'} {new Date(business.promotionEndDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 w-full md:w-auto">
                      <button 
                          onClick={() => onEditBusiness(business)} 
                          className="w-1/2 md:w-auto px-4 py-1.5 bg-neutral-800 text-white border border-neutral-700 rounded-md hover:bg-neutral-700 text-sm transition-colors"
                      >
                          Edit
                      </button>
                      <button 
                          onClick={() => onToggleStatus(business.id, business.isActive)} 
                          className="w-1/2 md:w-auto px-4 py-1.5 bg-white text-black font-semibold rounded-md hover:bg-gray-200 text-sm transition-colors"
                      >
                          {business.isActive ? 'Deactivate' : 'Reactivate'}
                      </button>
                  </div>
                </div>
            </div>
          </div>
        ))}
        {filteredBusinesses.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>No businesses found.</p>
          </div>
        )}
      </div>
    </div>
  );
};