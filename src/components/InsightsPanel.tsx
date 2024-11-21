import React from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, Calendar } from 'lucide-react';

interface InsightsPanelProps {
  data: {
    averageAccuracy: number;
    trend: 'up' | 'down' | 'stable';
    trendPercentage: number;
    seasonalityFactors: string[];
    anomalies: number;
  };
}

function InsightsPanel({ data }: InsightsPanelProps) {
  const getTrendIcon = () => {
    switch (data.trend) {
      case 'up':
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-5 w-5 text-red-500" />;
      default:
        return <TrendingUp className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium mb-4">Forecast Analysis</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-indigo-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Model Accuracy</p>
              <p className="text-2xl font-semibold text-indigo-600">
                {data.averageAccuracy}%
              </p>
            </div>
            <Calendar className="h-8 w-8 text-indigo-500" />
          </div>
        </div>

        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Overall Trend</p>
              <div className="flex items-center space-x-2">
                {getTrendIcon()}
                <p className="text-2xl font-semibold text-green-600">
                  {data.trendPercentage}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Seasonality Patterns
          </h4>
          <div className="flex flex-wrap gap-2">
            {data.seasonalityFactors.map((factor, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {factor}
              </span>
            ))}
          </div>
        </div>

        {data.anomalies > 0 && (
          <div className="flex items-center space-x-2 text-amber-600">
            <AlertTriangle className="h-5 w-5" />
            <p className="text-sm">
              Detected {data.anomalies} anomalies in the forecast period
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default InsightsPanel;