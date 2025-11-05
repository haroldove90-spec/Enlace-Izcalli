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
  const maxValue = Math.max(1, ...data.map(item => item.value)); // Ensure maxValue is at least 1 to avoid division by zero

  const formatValue = (value: number) => {
    if (formatAsCurrency) {
      return `$${(value / 1000).toFixed(0)}k`;
    }
    return value.toString();
  };
  
  // Ensure each bar has a minimum width to be legible, forcing horizontal scroll on small screens.
  // 4rem (64px) per bar should be sufficient space.
  const minChartWidth = data.length * 4;


  return (
    <div 
        className="h-64 grid items-end gap-x-2 pt-4"
        style={{ 
          gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))`,
          minWidth: `${minChartWidth}rem`
        }}
    >
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center h-full text-center">
          <div 
            className="w-full flex items-end justify-center"
            style={{ height: 'calc(100% - 1.5rem)' }}
          >
            <div
              className={`w-3/4 max-w-[50px] rounded-t-md ${barColor} hover:opacity-80 transition-opacity`}
              style={{ height: `${(item.value / maxValue) * 100}%` }}
              title={`${item.name}: ${formatAsCurrency ? '$' : ''}${item.value.toLocaleString()}`}
            ></div>
          </div>
          <span className="text-xs font-medium text-gray-500 mt-2 truncate w-full">{item.name}</span>
        </div>
      ))}
    </div>
  );
};