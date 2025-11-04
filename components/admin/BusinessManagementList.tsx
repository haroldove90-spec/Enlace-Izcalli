
import React from 'react';
import { Business } from '../../types';

interface BusinessManagementListProps {
    businesses: Business[];
    onEdit: (business: Business) => void;
    onDelete: (id: number) => void;
}
// This is a placeholder component.
// The app structure suggests a page for managing businesses might exist.
// This component would list businesses with options to edit or delete.
export const BusinessManagementList: React.FC<BusinessManagementListProps> = ({ businesses, onEdit, onDelete }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Edit</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {businesses.map((business) => (
            <tr key={business.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{business.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{business.categoryId}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button onClick={() => onEdit(business)} className="text-indigo-600 hover:text-indigo-900 mr-4">Editar</button>
                <button onClick={() => onDelete(business.id)} className="text-red-600 hover:text-red-900">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
