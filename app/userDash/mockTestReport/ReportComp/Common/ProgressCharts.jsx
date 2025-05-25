import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { formatDateToShortMonth } from '@/app/utils/dateFormat';

const ProgressCharts = ({ mockTestReports, catchmentType }) => {
  // Function to prepare chart data from reports
  const prepareProgressChartData = () => {
    if (mockTestReports.length <= 0) return [];

    // Find the most recent report for threshold data
    const latestReport = [...mockTestReports].sort((a, b) => 
      new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt)
    )[0];
    
    // Get threshold data from the latest report
    const isGirl = latestReport?.childScore?.childGender === 'Girl';
    const thresholds = isGirl 
      ? latestReport?.girlsScoreThresholds 
      : latestReport?.boysScoreThresholds;
    
    // Extract minimum safe threshold based on selected catchment type
    let minSafeThreshold = null;
    if (thresholds) {
      Object.keys(thresholds).forEach(school => {
        const areaThreshold = thresholds[school]?.[catchmentType]?.safe;
        if (areaThreshold && (!minSafeThreshold || areaThreshold < minSafeThreshold)) {
          minSafeThreshold = areaThreshold;
        }
      });
    }

    return mockTestReports.map(report => {
      const totalScore = (report.childScore?.englishScore || 0) + (report.childScore?.mathsScore || 0);
      const maxTotalScore = (report.englishMaxScore || 0) + (report.mathsMaxScore || 0);
      const totalPercentage = maxTotalScore > 0 ? (totalScore / maxTotalScore) * 100 : 0;
      const englishPercentage = report.englishMaxScore > 0 
        ? ((report.childScore?.englishScore || 0) / report.englishMaxScore) * 100 
        : 0;
      const mathsPercentage = report.mathsMaxScore > 0 
        ? ((report.childScore?.mathsScore || 0) / report.mathsMaxScore) * 100 
        : 0;

      return {
        name: formatDateToShortMonth(report.date || report.createdAt),
        englishScore: report.childScore?.englishScore || 0,
        mathsScore: report.childScore?.mathsScore || 0,
        totalScore: totalScore,
        englishPercentage: parseFloat(englishPercentage.toFixed(1)),
        mathsPercentage: parseFloat(mathsPercentage.toFixed(1)),
        totalPercentage: parseFloat(totalPercentage.toFixed(1)),
        englishMaxScore: report.englishMaxScore || 0,
        mathsMaxScore: report.mathsMaxScore || 0,
        totalMaxScore: maxTotalScore,
        // Gender-based ranks
        genderMathRank: report.childScore?.genderMathRank || 0,
        genderEnglishRank: report.childScore?.genderEnglishRank || 0,
        genderTotalRank: report.childScore?.genderTotalRank || 0,
        // Overall ranks
        overallMathRank: report.childScore?.overallMathRank || 0,
        overallEnglishRank: report.childScore?.overallEnglishRank || 0,
        overallTotalRank: report.childScore?.overallTotalRank || 0,
        // Use the global minSafeThreshold instead of calculating per report
        minSafeThreshold: minSafeThreshold
      };
    });
  };

  const chartData = prepareProgressChartData();

  if (chartData.length < 2) {
    return (
      <Typography variant="body1" sx={{ textAlign: 'center', my: 2 }}>
        At least two test results are needed to show progress charts.
      </Typography>
    );
  }
  
  // Get the safe threshold from the first chart data point (they all have the same value now)
  const minSafeThreshold = chartData[0]?.minSafeThreshold;
  
  return (
    <Grid container spacing={3}>
      {/* Score Progress Chart */}
      <Grid item xs={12} md={6}>
        <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
          Score Progress
        </Typography>
        <Paper elevation={1} sx={{ 
          p: { xs: 1, sm: 2 },
          height: { xs: 250, sm: 300 }
        }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: { xs: 10, sm: 12 } }}
                height={40}
                angle={-15}
                textAnchor="end"
              />
              <YAxis 
                yAxisId="left" 
                orientation="left"
                tick={{ fontSize: { xs: 10, sm: 12 } }}
                width={35}
              />
              <RechartsTooltip contentStyle={{ fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px', marginTop: '10px' }} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="englishScore"
                name="English"
                stroke="#1976d2"
                activeDot={{ r: 6 }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="mathsScore"
                name="Maths"
                stroke="#2e7d32"
                activeDot={{ r: 6 }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="totalScore"
                name="Total"
                stroke="#9c27b0"
                activeDot={{ r: 6 }}
                strokeWidth={2}
              />
              {minSafeThreshold && (
                <ReferenceLine 
                  yAxisId="left" 
                  y={minSafeThreshold} 
                  stroke="#ff5722" 
                  strokeDasharray="5 5" 
                  label={{ value: "Min Safe", position: "topRight", fontSize: 10 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      {/* Percentage Progress Chart */}
      <Grid item xs={12} md={6}>
        <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
          Percentage Progress
        </Typography>
        <Paper elevation={1} sx={{ 
          p: { xs: 1, sm: 2 },
          height: { xs: 250, sm: 300 }
        }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: { xs: 10, sm: 12 } }}
                height={40}
                angle={-15}
                textAnchor="end"
              />
              <YAxis 
                yAxisId="left" 
                orientation="left"
                domain={[0, 100]}
                tick={{ fontSize: { xs: 10, sm: 12 } }}
                width={35}
              />
              <RechartsTooltip 
                contentStyle={{ fontSize: '12px' }}
                formatter={(value) => [`${value}%`, '']}
              />
              <Legend wrapperStyle={{ fontSize: '12px', marginTop: '10px' }} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="englishPercentage"
                name="English %"
                stroke="#1976d2"
                activeDot={{ r: 6 }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="mathsPercentage"
                name="Maths %"
                stroke="#2e7d32"
                activeDot={{ r: 6 }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="totalPercentage"
                name="Total %"
                stroke="#9c27b0"
                activeDot={{ r: 6 }}
                strokeWidth={2}
              />
              <ReferenceLine 
                yAxisId="left" 
                y={70} 
                stroke="#ff5722" 
                strokeDasharray="5 5" 
                label={{ value: "Target 70%", position: "topRight", fontSize: 10 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      {/* Ranking Progress Chart */}
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
          Ranking Progress
        </Typography>
        <Paper elevation={1} sx={{ 
          p: { xs: 1, sm: 2 },
          height: { xs: 300, sm: 350, md: 400 }
        }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: { xs: 10, sm: 12 } }}
                height={40}
                angle={-15}
                textAnchor="end"
              />
              <YAxis 
                reversed 
                domain={[1, dataMax => Math.max(20, Math.ceil(dataMax * 1.2))]}
                tick={{ fontSize: { xs: 10, sm: 12 } }}
                width={30}
                label={{ 
                  value: 'Rank', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { fontSize: '12px', textAnchor: 'middle' },
                  offset: -20
                }}
              />
              <RechartsTooltip 
                contentStyle={{ fontSize: '12px' }}
                labelFormatter={(label) => `Test: ${label}`}
                formatter={(value, name) => [value, name]}
              />
              <Legend wrapperStyle={{ fontSize: '12px', marginTop: '10px' }} />
              
              {/* Gender Rankings */}
              <Line
                type="monotone"
                dataKey="genderTotalRank"
                name="Gender Overall Rank"
                stroke="#9c27b0"
                activeDot={{ r: 6 }}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="genderMathRank"
                name="Gender Maths Rank"
                stroke="#2e7d32"
                activeDot={{ r: 4 }}
                strokeDasharray="5 5"
              />
              <Line
                type="monotone"
                dataKey="genderEnglishRank"
                name="Gender English Rank"
                stroke="#1976d2"
                activeDot={{ r: 4 }}
                strokeDasharray="5 5"
              />
              
              {/* Overall Rankings */}
              <Line
                type="monotone"
                dataKey="overallTotalRank"
                name="Overall Total Rank"
                stroke="#ff5722"
                activeDot={{ r: 6 }}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="overallMathRank"
                name="Overall Maths Rank"
                stroke="#ff9800"
                activeDot={{ r: 4 }}
                strokeDasharray="3 3"
              />
              <Line
                type="monotone"
                dataKey="overallEnglishRank"
                name="Overall English Rank"
                stroke="#795548"
                activeDot={{ r: 4 }}
                strokeDasharray="3 3"
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ProgressCharts; 