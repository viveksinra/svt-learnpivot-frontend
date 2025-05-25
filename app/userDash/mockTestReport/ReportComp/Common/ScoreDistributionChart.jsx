import React from 'react';
import { Box, Typography } from '@mui/material';
import { Chart } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ScoreDistributionChart = ({ boysRanking, girlsRanking, englishMaxScore, mathsMaxScore }) => {
  // Combine all students and calculate total scores
  const allStudents = [...(boysRanking || []), ...(girlsRanking || [])];
  const totalMaxScore = englishMaxScore + mathsMaxScore;
  
  // Create score ranges (bins)
  const scoreRanges = [];
  const binSize = Math.ceil(totalMaxScore / 10); // Create 10 bins
  
  for (let i = 0; i < totalMaxScore; i += binSize) {
    scoreRanges.push({
      min: i,
      max: Math.min(i + binSize - 1, totalMaxScore),
      label: `${i}-${Math.min(i + binSize - 1, totalMaxScore)}`,
      boys: 0,
      girls: 0
    });
  }
  
  // Count students in each range
  allStudents.forEach(student => {
    const totalScore = student.englishScore + student.mathsScore;
    const rangeIndex = Math.min(Math.floor(totalScore / binSize), scoreRanges.length - 1);
    
    if (boysRanking && boysRanking.includes(student)) {
      scoreRanges[rangeIndex].boys++;
    } else {
      scoreRanges[rangeIndex].girls++;
    }
  });
  
  const chartData = {
    labels: scoreRanges.map(range => range.label),
    datasets: [
      {
        label: 'Boys',
        data: scoreRanges.map(range => range.boys),
        backgroundColor: 'rgba(33, 150, 243, 0.6)',
        borderColor: 'rgba(33, 150, 243, 1)',
        borderWidth: 1
      },
      {
        label: 'Girls',
        data: scoreRanges.map(range => range.girls),
        backgroundColor: 'rgba(233, 30, 99, 0.6)',
        borderColor: 'rgba(233, 30, 99, 1)',
        borderWidth: 1
      }
    ]
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Score Distribution by Gender'
      },
      tooltip: {
        callbacks: {
          afterLabel: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed.y / total) * 100).toFixed(1);
            return `${percentage}% of ${context.dataset.label.toLowerCase()}`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Score Range'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Number of Students'
        },
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };
  
  if (allStudents.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 3 }}>
        <Typography variant="body1" color="text.secondary">
          No data available for score distribution
        </Typography>
      </Box>
    );
  }
  
  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <Chart type="bar" data={chartData} options={chartOptions} />
    </Box>
  );
};

export default ScoreDistributionChart; 