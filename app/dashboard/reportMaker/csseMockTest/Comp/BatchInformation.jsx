import {
  Box,
  Typography,
  Grid,
  Card,
  Divider,
  Chip,
  useMediaQuery,
  useTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const BatchInformation = ({ selectedBatch, availableBatches }) => {
  const theme = useTheme();
  
  // Find the selected batch data
  const selectedBatchData = availableBatches.find(batch => batch._id === selectedBatch);
  
  if (!selectedBatchData) return null;
  
  // Calculate student information
  const hasChildren = selectedBatchData.children && selectedBatchData.children.length > 0;
  const childCount = hasChildren ? selectedBatchData.children.length : 0;
  
  return (
    <Card elevation={3} sx={{ mb: 4, borderRadius: 3, p: { xs: 2, sm: 3 }, bgcolor: 'rgba(236, 242, 255, 0.7)' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <InfoOutlinedIcon color="info" sx={{ mr: 1 }} />
        <Typography variant="h6" fontWeight="bold" color="text.primary">
          Selected Batch Information
        </Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ p: 1.5, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">Date</Typography>
            <Typography variant="body1" fontWeight="medium">
              {new Date(selectedBatchData.date).toLocaleDateString()}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ p: 1.5, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">Time</Typography>
            <Typography variant="body1" fontWeight="medium">
              {selectedBatchData.startTime} - {selectedBatchData.endTime}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ p: 1.5, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">Students</Typography>
            <Typography variant="body1" fontWeight="medium" sx={{ display: 'flex', alignItems: 'center' }}>
              {childCount}
              <Chip 
                label={childCount > 0 ? "Has Students" : "No Students"} 
                color={childCount > 0 ? "success" : "warning"}
                size="small"
                sx={{ ml: 1, fontSize: '0.7rem' }}
              />
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ p: 1.5, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">Status</Typography>
            <Chip 
              label={selectedBatchData.filled ? "Filled" : "Available"} 
              color={selectedBatchData.filled ? "error" : "success"}
              size="small"
              sx={{ mt: 0.5 }}
            />
          </Box>
        </Grid>
      </Grid>
      
      {/* Debug Information */}
      <Accordion 
        elevation={0} 
        sx={{ 
          mt: 2, 
          bgcolor: 'transparent',
          '&:before': { display: 'none' },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{ p: 0 }}
        >
          <Typography variant="caption" color="text.secondary">
            Debug Information
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <Alert severity="info" sx={{ mt: 1 }}>
            <Typography variant="caption">
              <strong>Batch ID:</strong> {selectedBatchData._id}
            </Typography>
            <br />
            <Typography variant="caption">
              <strong>Expected Students:</strong> {hasChildren ? childCount : "No children data available"}
            </Typography>
            <br />
            <Typography variant="caption">
              <strong>Total Seats:</strong> {selectedBatchData.totalSeat}
            </Typography>
          </Alert>
        </AccordionDetails>
      </Accordion>
    </Card>
  );
};

export default BatchInformation; 