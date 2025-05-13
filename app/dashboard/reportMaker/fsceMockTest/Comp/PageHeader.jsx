import { Box, Typography, useMediaQuery, useTheme, Chip, CircularProgress } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import CelebrationIcon from '@mui/icons-material/Celebration';

const PageHeader = ({ actionLoading }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mb: 4,
        py: 3,
        borderRadius: 4,
        background: 'linear-gradient(90deg, #673ab7 0%, #9c27b0 100%)',
        boxShadow: 3,
        color: 'white',
        position: 'relative',
      }}
    >
      <SchoolIcon sx={{ fontSize: '2.5rem', mr: 2 }} />
      <Typography variant={isMobile ? 'h5' : 'h3'} fontWeight="bold">
        FSCE Mock Result Maker
      </Typography>
      <CelebrationIcon sx={{ fontSize: '2rem', ml: 2, opacity: 0.7 }} />
      {actionLoading && (
        <Chip
          icon={<CircularProgress size={16} />}
          label="Processing..."
          variant="filled"
          color="warning"
          sx={{ position: 'absolute', right: 24, top: 24 }}
        />
      )}
    </Box>
  );
};

export default PageHeader; 