"use client";
import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardHeader,
  Button,
  Chip,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
  IconButton
} from '@mui/material';
import { format } from 'date-fns';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import * as XLSX from 'xlsx';

const CourseTestGrid = ({ data, exportFileName = 'course-batch-report' }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState(null);
  
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "CourseBatchReport");
    XLSX.writeFile(workbook, `${exportFileName}.xlsx`);
    handleClose();
  };

  const exportToCSV = () => {
    const csvData = data.map(row => {
      return {
        Title: row.title,
        Date: format(new Date(row.batchDate), 'dd MMM yyyy'),
        Time: row.batchTime,
        'Total Seats': row.totalSeat,
        'Booked Seats': row.filledSeat,
        'Available Seats': row.remainingSeat
      };
    });
    
    const worksheet = XLSX.utils.json_to_sheet(csvData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "CourseBatchReport");
    XLSX.writeFile(workbook, `${exportFileName}.csv`, { bookType: 'csv' });
    handleClose();
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        flexWrap: 'wrap',
        gap: 1
      }}>
        <Typography variant={isMobile ? "h6" : "h5"} sx={{ fontWeight: 600 }}>
          Course Batch Report
        </Typography>
        <Box>
          <IconButton
            aria-label="export options"
            aria-controls="export-menu"
            aria-haspopup="true"
            onClick={handleMenuClick}
          >
            <FileDownloadIcon />
          </IconButton>
          <Menu
            id="export-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={exportToExcel}>Export as Excel</MenuItem>
            <MenuItem onClick={exportToCSV}>Export as CSV</MenuItem>
          </Menu>
        </Box>
      </Box>
      
      <Grid container spacing={2}>
        {data.map((batch, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Card 
              elevation={2} 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6
                }
              }}
            >
              <CardHeader
                title={
                  <Typography 
                    variant="subtitle1" 
                    noWrap 
                    sx={{ 
                      fontWeight: 'bold',
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    }}
                    title={batch.title}
                  >
                    {batch.title}
                  </Typography>
                }
                subheader={
                  <Box sx={{ display: 'flex', flexDirection: 'column', mt: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      {format(new Date(batch.batchDate), 'dd MMM yyyy')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {batch.batchTime}
                    </Typography>
                  </Box>
                }
                sx={{ pb: 0 }}
              />
              <CardContent sx={{ pt: 1, pb: 2, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Total Seats:
                    </Typography>
                    <Chip 
                      label={batch.totalSeat}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Booked Seats:
                    </Typography>
                    <Chip 
                      label={batch.filledSeat}
                      color="secondary"
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Available:
                    </Typography>
                    <Chip 
                      label={batch.remainingSeat}
                      color={batch.remainingSeat > 0 ? "success" : "error"}
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CourseTestGrid; 