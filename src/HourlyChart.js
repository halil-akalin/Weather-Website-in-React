// src/components/HourlyChart.js
import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const HourlyChart = ({ hourlyData }) => {
  const hours = hourlyData.map(data => new Date(data.time).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }));
  const temperatures = hourlyData.map(data => data.temp_c);

  const data = {
    labels: hours,
    datasets: [
      {
        label: 'Sıcaklık (°C)',
        data: temperatures,
        borderColor: 'rgba(255, 206, 86, 1)',
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        fill: true,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: false,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default HourlyChart;
