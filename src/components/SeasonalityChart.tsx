import React from 'react';
import { TrendingUp } from 'lucide-react';

interface SeasonalityChartProps {
  data: {
    monthly: {
      labels: string[];
      values: number[];
    };
    quarterly: string[];
  };
}

function SeasonalityChart({ data }: SeasonalityChartProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center space-x-2 mb-4">
        <TrendingUp className="h-5 w-5 text-pink-600" />
        <h3 className="text-lg font-medium">Seasonal Trends</h3>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          {data.quarterly.map((quarter, index) => (
            <div
              key={quarter}
              className="p-3 bg-pink-50 rounded-lg text-center"
            >
              <div className="text-xs text-pink-600 font-medium">Q{index + 1}</div>
              <div className="text-sm text-gray-800 mt-1">{quarter}</div>
            </div>
          ))}
        </div>

        <div className="pt-4">
          <div className="flex items-center space-x-2">
            {data.monthly.labels.map((month, index) => (
              <div key={month} className="flex-1">
                <div className="h-20 relative">
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-pink-200 rounded-t-lg"
                    style={{
                      height: `${(data.monthly.values[index] / Math.max(...data.monthly.values)) * 100}%`
                    }}
                  />
                </div>
                <div className="text-xs text-gray-600 text-center mt-1">{month}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SeasonalityChart;