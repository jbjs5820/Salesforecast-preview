import React from 'react';
import { Calendar } from 'lucide-react';

interface WeekdayAnalysisProps {
  data: {
    labels: string[];
    values: number[];
    performance: string[];
  };
}

function WeekdayAnalysis({ data }: WeekdayAnalysisProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Calendar className="h-5 w-5 text-pink-600" />
        <h3 className="text-lg font-medium">Weekday Performance</h3>
      </div>
      <div className="space-y-3">
        {data.labels.map((day, index) => (
          <div key={day} className="flex items-center">
            <div className="w-24 text-sm text-gray-600">{day}</div>
            <div className="flex-1">
              <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-pink-500 to-pink-600 rounded-full"
                  style={{ width: `${(data.values[index] / Math.max(...data.values)) * 100}%` }}
                />
              </div>
            </div>
            <div className="w-16 text-right text-sm font-medium text-gray-900">
              {data.performance[index]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeekdayAnalysis;