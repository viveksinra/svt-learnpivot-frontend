import { useState } from 'react';
import { 
  Box, 
  Typography, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Grid, 
  Card, 
  Alert, 
  Stack, 
  Tooltip, 
  Button, 
  CircularProgress, 
  useMediaQuery,
  useTheme,
  Chip
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const MockTestSelection = ({ 
  mockTests, 
  selectedMockTest, 
  selectedBatch, 
  availableBatches,
  mockTestExists,
  loading, 
  actionLoading,
  showCreateForm,
  handleMockTestChange,
  handleBatchChange,
  handleCreateNew
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Card elevation={4} sx={{ mb: 4, borderRadius: 3, p: { xs: 2, sm: 3 } }}>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} md={6}>
          <FormControl fullWidth variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
            <InputLabel>Select Mock Test</InputLabel>
            <Select
              value={selectedMockTest}
              onChange={handleMockTestChange}
              label="Select Mock Test"
              disabled={loading || actionLoading}
              sx={{ minHeight: 56 }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {loading ? (
                <MenuItem disabled>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Loading...
                </MenuItem>
              ) : mockTests.length === 0 ? (
                <MenuItem disabled>No mock tests available.</MenuItem>
              ) : (
                mockTests.map((test) => (
                  <MenuItem key={test._id} value={test._id}>
                    {test.mockTestTitle}
                  </MenuItem>
                ))
              )}
            </Select>
            {!loading && mockTests.length === 0 && (
              <Typography variant="caption" sx={{ mt: 1, ml: 2, color: 'text.secondary' }}>
                Consider creating a new mock test if none are listed.
              </Typography>
            )}
          </FormControl>
        </Grid>
        
        {selectedMockTest && (
          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
              <InputLabel>Select Batch Date</InputLabel>
              <Select
                value={selectedBatch}
                onChange={handleBatchChange}
                label="Select Batch Date"
                disabled={loading || actionLoading || availableBatches.length === 0}
                sx={{ minHeight: 56 }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {availableBatches.length === 0 ? (
                  <MenuItem disabled>No past batches available.</MenuItem>
                ) : (
                  availableBatches.map((batch) => (
                    <MenuItem key={batch._id} value={batch._id}>
                      {new Date(batch.date).toLocaleDateString()} ({batch.startTime} - {batch.endTime})
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          </Grid>
        )}
        
        {selectedBatch && (
          <Grid item xs={12} md={6}>
            {mockTestExists ? (
              <Alert
                severity="info"
                variant="outlined"
                icon={<InfoOutlinedIcon fontSize="inherit" />}
                sx={{ borderRadius: 2, width: '100%' }}
              >
                This mock test already exists. You can edit the scores.
              </Alert>
            ) : (
              <Stack direction={isMobile ? 'column' : 'row'} spacing={2} sx={{ width: '100%' }}>
                <Alert
                  severity="warning"
                  variant="outlined"
                  icon={<InfoOutlinedIcon fontSize="inherit" />}
                  sx={{ borderRadius: 2, width: '100%' }}
                >
                  This mock test doesn't exist yet.
                </Alert>
                <Tooltip title="Create a new mock test with the selected ID">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCreateNew}
                    disabled={actionLoading || showCreateForm}
                    startIcon={<AddCircleIcon />}
                    sx={{
                      height: isMobile ? 'auto' : '100%',
                      borderRadius: 2,
                      px: 3,
                      boxShadow: 3,
                      whiteSpace: 'nowrap',
                      fontWeight: 'bold',
                    }}
                  >
                    CREATE NEW
                  </Button>
                </Tooltip>
              </Stack>
            )}
          </Grid>
        )}
      </Grid>
    </Card>
  );
};

export default MockTestSelection; 