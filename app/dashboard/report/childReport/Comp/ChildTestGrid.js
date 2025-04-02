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
  IconButton,
  Avatar
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import * as XLSX from 'xlsx';

const ChildTestGrid = ({ data, exportFileName = 'child-report' }) => {
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "ChildReport");
    XLSX.writeFile(workbook, `${exportFileName}.xlsx`);
    handleClose();
  };

  const exportToCSV = () => {
    const csvData = data.map(row => {
      return {
        Name: row.name,
        'Parent Email': row.parentEmail || 'N/A',
        Grade: row.grade || 'N/A',
        School: row.school || 'N/A',
        Status: row.status || 'N/A'
      };
    });
    
    const worksheet = XLSX.utils.json_to_sheet(csvData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ChildReport");
    XLSX.writeFile(workbook, `${exportFileName}.csv`, { bookType: 'csv' });
    handleClose();
  };

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return '?';
    const nameParts = name.split(' ');
    return nameParts.length > 1
      ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
      : name.substring(0, 2).toUpperCase();
  };

  // Get random color for avatar based on name
  const getAvatarColor = (name) => {
    if (!name) return theme.palette.primary.main;
    const colors = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.success.main,
      theme.palette.error.main,
      theme.palette.warning.main,
      theme.palette.info.main,
    ];
    const charSum = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return colors[charSum % colors.length];
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
          Child Report
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
        {data.map((child, index) => (
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
                avatar={
                  <Avatar 
                    sx={{ 
                      bgcolor: getAvatarColor(child.name),
                      fontSize: { xs: '0.75rem', sm: '0.875rem' }
                    }}
                  >
                    {getInitials(child.name)}
                  </Avatar>
                }
                title={
                  <Typography 
                    variant="subtitle1" 
                    noWrap 
                    sx={{ 
                      fontWeight: 'bold',
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    }}
                    title={child.name}
                  >
                    {child.name}
                  </Typography>
                }
                subheader={
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {child.parentEmail || 'No parent email'}
                  </Typography>
                }
                sx={{ pb: 0 }}
              />
              <CardContent sx={{ pt: 1, pb: 2, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Grade:
                    </Typography>
                    <Chip 
                      label={child.grade || 'N/A'}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                  
                  {child.school && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        School:
                      </Typography>
                      <Typography variant="body2" sx={{ maxWidth: '65%', textAlign: 'right' }} noWrap title={child.school}>
                        {child.school}
                      </Typography>
                    </Box>
                  )}
                  
                  {child.status && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        Status:
                      </Typography>
                      <Chip 
                        label={child.status || 'N/A'}
                        color={child.status === 'Active' ? "success" : "default"}
                        variant="outlined"
                        size="small"
                      />
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ChildTestGrid; 