import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  isCurrency?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, isCurrency }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between border border-slate-200">
      <h3 className="text-sm font-medium text-slate-500">{title}</h3>
      <p className={`text-3xl font-bold mt-2 ${isCurrency ? 'text-green-600' : 'text-slate-800'}`}>
        {value}
      </p>
    </div>
  );
};