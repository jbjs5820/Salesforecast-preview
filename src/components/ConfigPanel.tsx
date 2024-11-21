import React from 'react';
import { Calendar, BarChart2 } from 'lucide-react';

interface ConfigPanelProps {
  config: {
    forecastPeriod: number;
    weeklySeasonality: boolean;
    yearlySeasonality: boolean;
  };
  setConfig: React.Dispatch<React.SetStateAction<{
    forecastPeriod: number;
    weeklySeasonality: boolean;
    yearlySeasonality: boolean;
  }>>;
}

function ConfigPanel({ config, setConfig }: ConfigPanelProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Forecast Period (days)
        </label>
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <input
            type="number"
            value={config.forecastPeriod}
            onChange={(e) => setConfig(prev => ({
              ...prev,
              forecastPeriod: parseInt(e.target.value)
            }))}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            min="1"
            max="365"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Seasonality
        </label>
        <div className="flex items-center space-x-2">
          <BarChart2 className="h-4 w-4 text-gray-400" />
          <div className="space-y-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={config.weeklySeasonality}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  weeklySeasonality: e.target.checked
                }))}
                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-600">Weekly Pattern</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={config.yearlySeasonality}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  yearlySeasonality: e.target.checked
                }))}
                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-600">Yearly Pattern</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfigPanel;