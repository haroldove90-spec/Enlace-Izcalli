import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  isCurrency?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, isCurrency }) => {
  return (
    <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-800 flex flex-col justify-between">
      <h3 className="text-sm font-medium text-gray-400">{title}</h3>
      <p className={`text-3xl font-bold mt-2 ${isCurrency ? 'text-green-400' : 'text-white'}`}>
        {value}
      </p>
    </div>
  );
};