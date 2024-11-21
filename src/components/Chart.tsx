import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartProps {
  data: {
    dates?: string[];
    actual?: number[];
    predicted?: number[];
    lower_bound?: number[];
    upper_bound?: number[];
  };
}

function Chart({ data }: ChartProps) {
  if (!data.dates || !data.actual || !data.predicted) {
    return (
      <div className="h-[400px] flex items-center justify-center text-gray-500">
        Upload data to see the forecast
      </div>
    );
  }

  const chartData = {
    labels: data.dates,
    datasets: [
      {
        label: 'Actual Sales',
        data: data.actual,
        borderColor: 'rgb(79, 70, 229)',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        borderWidth: 2,
        pointRadius: 3,
      },
      {
        label: 'Predicted Sales',
        data: data.predicted,
        borderColor: 'rgb(244, 63, 94)',
        backgroundColor: 'rgba(244, 63, 94, 0.1)',
        borderWidth: 2,
        pointRadius: 3,
      },
      {
        label: 'Confidence Interval',
        data: data.upper_bound,
        borderColor: 'rgba(244, 63, 94, 0.2)',
        backgroundColor: 'rgba(244, 63, 94, 0.1)',
        borderWidth: 1,
        pointRadius: 0,
        fill: '+1',
      },
      {
        label: 'Confidence Interval',
        data: data.lower_bound,
        borderColor: 'rgba(244, 63, 94, 0.2)',
        backgroundColor: 'rgba(244, 63, 94, 0.1)',
        borderWidth: 1,
        pointRadius: 0,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Sales Volume',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
    },
  };

  return (
    <div className="w-full h-[400px]">
      <Line data={chartData} options={options} />
    </div>
  );
}

export default Chart;