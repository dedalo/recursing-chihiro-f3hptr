import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Chart } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

const BandwidthUsageChart = () => {
  // Updated sample data with more variation up to day 18
  const dailyUsage = [10, 40, 20, 60, 35, 45, 55, 20, 75, 30, 90, 25, 100, 50, 70, 35, 120, 40]; // Up to day 18
  const currentDay = 18; // Today is the 18th
  const threshold = 600; // Set a lower limit for available bandwidth

  // Calculate cumulative usage
  let cumulativeUsage = [];
  let currentTotal = 0;
  for (let i = 0; i < currentDay; i++) {
    currentTotal += dailyUsage[i];
    cumulativeUsage.push(currentTotal);
  }

  // Calculate predictive usage based on the average daily consumption until day 18
  const averageUsage = currentTotal / currentDay;
  const predictiveUsage = [...dailyUsage];
  for (let i = currentDay; i < 30; i++) {
    predictiveUsage.push(averageUsage);
    currentTotal += averageUsage;
    cumulativeUsage.push(currentTotal);
  }

  // Determine the fill colors based on the threshold
  const areaColors = cumulativeUsage.map((value, index) => {
    if (index >= currentDay) {
      return 'rgba(0, 0, 0, 0.1)'; // Faded color for predictive data
    }
    return value > threshold ? 'rgba(255, 0, 0, 0.2)' : 'rgba(0, 255, 0, 0.2)'; // Red if over threshold, green if below
  });

  // Define chart data
  const data = {
    labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
    datasets: [
      {
        type: 'bar',
        label: 'Daily Usage',
        data: predictiveUsage,
        backgroundColor: predictiveUsage.map((_, i) =>
          i < currentDay ? 'rgba(0, 123, 255, 0.7)' : 'rgba(0, 123, 255, 0.1)' // Light color for predictive data
        ),
        borderColor: predictiveUsage.map((_, i) =>
          i < currentDay ? 'rgba(0, 123, 255, 1)' : 'rgba(0, 123, 255, 0.5)' // Use a faded border for predictive data
        ),
        borderWidth: 1,
        borderDash: predictiveUsage.map((_, i) => (i >= currentDay ? [5, 5] : [])), // Dashed border for predictive columns
      },
      {
        type: 'line',
        label: 'Cumulative Usage - Below Threshold',
        data: cumulativeUsage,
        borderColor: 'blue',
        backgroundColor: areaColors,
        fill: true,
        pointRadius: 0,
        segment: {
          borderColor: (ctx) => {
            return cumulativeUsage[ctx.p0DataIndex] > threshold ? 'red' : 'blue';
          },
          backgroundColor: (ctx) => {
            if (ctx.p0DataIndex >= currentDay) return 'rgba(0, 0, 0, 0.1)'; // Predictive data in faded color
            return cumulativeUsage[ctx.p0DataIndex] > threshold ? 'rgba(255, 0, 0, 0.2)' : 'rgba(0, 255, 0, 0.2)';
          },
          borderDash: (ctx) => {
            return ctx.p0DataIndex >= currentDay ? [5, 5] : [];
          },
        },
      },
      {
        type: 'line',
        label: 'Threshold',
        data: Array(30).fill(threshold),
        borderColor: 'rgba(255, 0, 0, 0.5)',
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Dates',
        },
      },
      y: {
        title: {
          display: true,
          text: 'MB',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <h2>Bandwidth Usage Chart</h2>
      <Chart type='bar' data={data} options={options} />
    </div>
  );
};

export default function App() {
  return (
    <div>
      <BandwidthUsageChart />
    </div>
  );
}
