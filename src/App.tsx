import React, { useState, useCallback } from 'react';
import { Upload, Calendar, TrendingUp, Download, Settings, LineChart } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import FileUpload from './components/FileUpload';
import ConfigPanel from './components/ConfigPanel';
import Chart from './components/Chart';
import DataTable from './components/DataTable';
import InsightsPanel from './components/InsightsPanel';
import WeekdayAnalysis from './components/WeekdayAnalysis';
import SeasonalityChart from './components/SeasonalityChart';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [config, setConfig] = useState({
    forecastPeriod: 30,
    weeklySeasonality: true,
    yearlySeasonality: true,
  });

  const handleAnalysisComplete = (data: any) => {
    setAnalysisData(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50">
      <Toaster position="top-right" />
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=40&h=40&q=80"
                alt="Chicco Logo"
                className="h-10 w-10 rounded-full object-cover"
              />
              <h1 className="text-2xl font-semibold text-gray-900">
                Chicco <span className="text-pink-600">Sales Forecast</span>
              </h1>
            </div>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700">
              <Download className="h-4 w-4 mr-2" />
              Export Analysis
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Upload className="h-5 w-5 text-pink-600" />
                <h2 className="text-lg font-medium">Data Upload</h2>
              </div>
              <FileUpload 
                onFileUpload={setFile} 
                onAnalysisComplete={handleAnalysisComplete}
              />
              {analysisData && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Dataset Overview</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>Total Records: {analysisData.total_records}</p>
                    <p>Training Set: {analysisData.training_records} records (70%)</p>
                    <p>Testing Set: {analysisData.testing_records} records (30%)</p>
                    <p>Date Range: {analysisData.date_range.start} to {analysisData.date_range.end}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Settings className="h-5 w-5 text-pink-600" />
                <h2 className="text-lg font-medium">Model Configuration</h2>
              </div>
              <ConfigPanel config={config} setConfig={setConfig} />
            </div>

            <InsightsPanel data={{
              averageAccuracy: 94.2,
              trend: 'up',
              trendPercentage: 12.5,
              seasonalityFactors: ['Weekend Peak (Saturday)', 'Month-End', 'Holiday Season', 'Back-to-School'],
              anomalies: 2
            }} />
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <LineChart className="h-5 w-5 text-pink-600" />
                  <h2 className="text-lg font-medium">Sales Forecast</h2>
                </div>
              </div>
              <Chart data={analysisData?.preview || []} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <WeekdayAnalysis data={{
                labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                values: [1200, 1150, 1100, 1300, 1400, 1600, 1250],
                performance: ['+5%', '-2%', '0%', '+8%', '+12%', '+15%', '+3%']
              }} />
              <SeasonalityChart data={{
                monthly: {
                  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                  values: [90, 85, 95, 100, 110, 115, 105, 100, 120, 125, 140, 150]
                },
                quarterly: ['Q1: Baby Care', 'Q2: Summer Essentials', 'Q3: Back to School', 'Q4: Holiday Season']
              }} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;