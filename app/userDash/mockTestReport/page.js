"use client";
import { Box, Card, CardContent, Typography, Grid, Paper } from '@mui/material';
import { useRouter } from 'next/navigation';
import { styled } from '@mui/material/styles';

// Styled components for better visual appeal
const StyledCard = styled(Card)(({ theme }) => ({
  cursor: 'pointer',
  transition: 'all 0.3s ease-in-out',
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  border: '2px solid transparent',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
    borderColor: theme.palette.primary.main,
  },
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  minHeight: '200px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  fontSize: '4rem',
  marginBottom: theme.spacing(2),
  opacity: 0.8,
}));

const ReportMakerPage = () => {
  const router = useRouter();

  const handleFSCEClick = () => {
    router.push('/userDash/mockTestReport/fsce');
  };

  const handleCSSEClick = () => {
    router.push('/userDash/mockTestReport/csce');
  };

  return (
    <Box sx={{
      p: { xs: 2, sm: 3, md: 4 },
      maxWidth: '1200px',
      margin: '0 auto',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }}>
      {/* Page Header */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 3,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Typography 
          variant="h3" 
          component="h1" 
          fontWeight="bold" 
          textAlign="center"
          sx={{
            background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1
          }}
        >
          📊 Mock Test Results
        </Typography>
        <Typography 
          variant="h6" 
          textAlign="center" 
          color="text.secondary"
          fontWeight="400"
        >
          View your child's mock test performance and detailed results
        </Typography>
      </Paper>

      {/* Selection Cards */}
      <Grid container spacing={4} justifyContent="center">
        {/* FSCE Mock Test Card */}
        <Grid item xs={12} sm={6} md={5}>
          <StyledCard onClick={handleFSCEClick}>
            <StyledCardContent>
              <IconWrapper>
                🎓
              </IconWrapper>
              <Typography 
                variant="h4" 
                component="h2" 
                fontWeight="bold" 
                color="primary.main"
                mb={2}
              >
                FSCE
              </Typography>
              <Typography 
                variant="h6" 
                color="text.primary"
                mb={2}
                fontWeight="600"
              >
                Full-Scale Comprehensive Exam
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary"
                textAlign="center"
                lineHeight={1.6}
              >
                View detailed FSCE mock test results with comprehensive performance 
                analysis, section-wise scores, and ranking information.
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                <Typography variant="caption" sx={{ 
                  background: 'rgba(25, 118, 210, 0.1)', 
                  color: 'primary.main',
                  px: 1.5, 
                  py: 0.5, 
                  borderRadius: '12px',
                  fontWeight: 600
                }}>
                  Detailed Analysis
                </Typography>
                <Typography variant="caption" sx={{ 
                  background: 'rgba(25, 118, 210, 0.1)', 
                  color: 'primary.main',
                  px: 1.5, 
                  py: 0.5, 
                  borderRadius: '12px',
                  fontWeight: 600
                }}>
                  Performance Insights
                </Typography>
              </Box>
            </StyledCardContent>
          </StyledCard>
        </Grid>

        {/* CSSE Mock Test Card */}
        <Grid item xs={12} sm={6} md={5}>
          <StyledCard onClick={handleCSSEClick}>
            <StyledCardContent>
              <IconWrapper>
                📝
              </IconWrapper>
              <Typography 
                variant="h4" 
                component="h2" 
                fontWeight="bold" 
                color="secondary.main"
                mb={2}
              >
                CSSE
              </Typography>
              <Typography 
                variant="h6" 
                color="text.primary"
                mb={2}
                fontWeight="600"
              >
                Comprehensive Standard School Exam
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary"
                textAlign="center"
                lineHeight={1.6}
              >
                Access CSSE mock test results with standardized scoring, 
                comparative rankings, and comprehensive performance analytics.
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                <Typography variant="caption" sx={{ 
                  background: 'rgba(156, 39, 176, 0.1)', 
                  color: 'secondary.main',
                  px: 1.5, 
                  py: 0.5, 
                  borderRadius: '12px',
                  fontWeight: 600
                }}>
                  Score Analysis
                </Typography>
                <Typography variant="caption" sx={{ 
                  background: 'rgba(156, 39, 176, 0.1)', 
                  color: 'secondary.main',
                  px: 1.5, 
                  py: 0.5, 
                  borderRadius: '12px',
                  fontWeight: 600
                }}>
                  Ranking & Progress
                </Typography>
              </Box>
            </StyledCardContent>
          </StyledCard>
        </Grid>
      </Grid>

      {/* Footer Information */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 2, 
          mt: 4, 
          borderRadius: 2,
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(5px)',
        }}
      >
        <Typography 
          variant="body2" 
          textAlign="center" 
          color="text.secondary"
        >
          💡 <strong>Tip:</strong> Track your child's progress over time with detailed score breakdowns, 
          performance comparisons, and insights to help identify areas for improvement.
        </Typography>
      </Paper>
    </Box>
  );
};

export default ReportMakerPage;
