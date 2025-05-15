import { 
  Box, 
  Typography, 
  Card, 
  Divider, 
  Table,
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Paper,
  Grid,
  Tooltip,
  Chip
} from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend
} from 'chart.js';

// Register the required chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  Legend
);

const ResultsVisualization = ({ students, maxScores }) => {
  if (!students || students.length === 0) {
    return null;
  }

  // Calculate summary statistics
  const totalStudents = students.length;
  const mathScores = students.filter(s => s.mathScore !== '').map(s => Number(s.mathScore));
  const englishScores = students.filter(s => s.englishScore !== '').map(s => Number(s.englishScore));
  
  const avgMath = mathScores.length > 0 
    ? Math.round((mathScores.reduce((a, b) => a + b, 0) / mathScores.length) * 10) / 10 
    : 0;
  const avgEnglish = englishScores.length > 0 
    ? Math.round((englishScores.reduce((a, b) => a + b, 0) / englishScores.length) * 10) / 10 
    : 0;

  // Score distribution data (count students in each score range)
  const mathDistribution = {
    '0-20%': mathScores.filter(score => score <= maxScores.math * 0.2).length,
    '21-40%': mathScores.filter(score => score > maxScores.math * 0.2 && score <= maxScores.math * 0.4).length,
    '41-60%': mathScores.filter(score => score > maxScores.math * 0.4 && score <= maxScores.math * 0.6).length,
    '61-80%': mathScores.filter(score => score > maxScores.math * 0.6 && score <= maxScores.math * 0.8).length,
    '81-100%': mathScores.filter(score => score > maxScores.math * 0.8 && score <= maxScores.math).length,
  };

  const englishDistribution = {
    '0-20%': englishScores.filter(score => score <= maxScores.english * 0.2).length,
    '21-40%': englishScores.filter(score => score > maxScores.english * 0.2 && score <= maxScores.english * 0.4).length,
    '41-60%': englishScores.filter(score => score > maxScores.english * 0.4 && score <= maxScores.english * 0.6).length,
    '61-80%': englishScores.filter(score => score > maxScores.english * 0.6 && score <= maxScores.english * 0.8).length,
    '81-100%': englishScores.filter(score => score > maxScores.english * 0.8 && score <= maxScores.english).length,
  };

  // Chart data
  const distributionChartData = {
    labels: Object.keys(mathDistribution),
    datasets: [
      {
        label: 'Math Scores',
        data: Object.values(mathDistribution),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'English Scores',
        data: Object.values(englishDistribution),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Score Distribution',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Students'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Score Range'
        }
      }
    }
  };

  return (
    <Card elevation={2} sx={{ mb: 4, borderRadius: 3, p: { xs: 2, sm: 3 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <AssessmentIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="h6" fontWeight="bold" color="text.primary">
          Mock Test Results Summary
        </Typography>
        <Tooltip title="Overview of student performance in this mock test" placement="right">
          <InfoOutlinedIcon color="info" sx={{ ml: 1 }} />
        </Tooltip>
      </Box>
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        {/* Summary statistics */}
        <Grid item xs={12} md={4}>
          <Paper elevation={1} sx={{ p: 2, height: '100%', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Summary Statistics</Typography>
            <TableContainer>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">Total Students</TableCell>
                    <TableCell align="right">{totalStudents}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">Average Math Score</TableCell>
                    <TableCell align="right">
                      {avgMath} / {maxScores.math} 
                      <Chip 
                        size="small" 
                        label={`${Math.round(avgMath/maxScores.math*100)}%`} 
                        color="primary" 
                        variant="outlined"
                        sx={{ ml: 1 }} 
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">Average English Score</TableCell>
                    <TableCell align="right">
                      {avgEnglish} / {maxScores.english}
                      <Chip 
                        size="small" 
                        label={`${Math.round(avgEnglish/maxScores.english*100)}%`} 
                        color="secondary" 
                        variant="outlined"
                        sx={{ ml: 1 }} 
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">Average Total Score</TableCell>
                    <TableCell align="right">
                      {avgMath + avgEnglish} / {maxScores.math + maxScores.english}
                      <Chip 
                        size="small" 
                        label={`${Math.round((avgMath + avgEnglish)/(maxScores.math + maxScores.english)*100)}%`} 
                        color="success" 
                        variant="outlined"
                        sx={{ ml: 1 }} 
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Chart */}
        <Grid item xs={12} md={8}>
          <Paper elevation={1} sx={{ p: 2, height: '100%', borderRadius: 2 }}>
            <Box sx={{ height: 300 }}>
              <Bar data={distributionChartData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Card>
  );
};

export default ResultsVisualization; 