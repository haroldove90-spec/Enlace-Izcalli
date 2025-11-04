import React from 'react';

interface ChartData {
  name: string;
  value: number;
}

interface SimpleBarChartProps {
  data: ChartData[];
  barColor?: string;
  formatAsCurrency?: boolean;
}

export const SimpleBarChart: React.FC<SimpleBarChartProps> = ({ data, barColor = 'bg-blue-500', formatAsCurrency = false }) => {
  const maxValue = Math.max(...data.map(item => item.value));

  const formatValue = (value: number) => {
    if (formatAsCurrency) {
      return `$${(value / 1000).toFixed(0)}k`;
    }
    return value.toString();
  };

  return (
    <div className="w-full h-64 flex items-end justify-around space-x-2 pt-4">
      {data.map((item, index) => (
        <div key={index} className="flex-1 flex flex-col items-center h-full">
          <div 
            className="w-full flex items-end justify-center"
            style={{ height: 'calc(100% - 1.5rem)' }}
          >
            <div
              className={`w-3/4 rounded-t-md ${barColor} hover:opacity-80 transition-opacity`}
              style={{ height: `${(item.value / maxValue) * 100}%` }}
              title={`${formatAsCurrency ? '$' : ''}${item.value.toLocaleString()}`}
            ></div>
          </div>
          <span className="text-xs font-medium text-gray-500 mt-2">{item.name}</span>
        </div>
      ))}
    </div>
  );
};