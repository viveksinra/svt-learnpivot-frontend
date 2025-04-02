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
import { format } from 'date-fns';

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
        'Child Name': row.childName || 'N/A',
        'Gender': row.childGender || 'N/A',
        'Year Group': row.childYear || 'N/A',
        'Date of Birth': row.childDob ? format(new Date(row.childDob), 'dd MMM yyyy') : 'N/A',
        'Parent Name': row.parent ? `${row.parent.firstName} ${row.parent.lastName}` : 'N/A',
        'Parent Email': row.parent?.email || 'N/A',
        'Parent Mobile': row.parent?.mobile || 'N/A',
        'Child Added Date': row.date ? format(new Date(row.date), 'dd MMM yyyy') : 'N/A'
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
          <Grid item xs={12} sm={6} md={4} lg={3} key={child._id || index}>
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
                      bgcolor: getAvatarColor(child.childName),
                      fontSize: { xs: '0.75rem', sm: '0.875rem' }
                    }}
                  >
                    {getInitials(child.childName)}
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
                    title={child.childName}
                  >
                    {child.childName}
                  </Typography>
                }
                subheader={
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {child.parent ? `${child.parent.firstName} ${child.parent.lastName}` : 'No parent info'}
                  </Typography>
                }
                sx={{ pb: 0 }}
              />
              <CardContent sx={{ pt: 1, pb: 2, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Gender:
                    </Typography>
                    <Chip 
                      label={child.childGender || 'N/A'}
                      color={child.childGender === 'Boy' ? 'primary' : 'secondary'}
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Year Group:
                    </Typography>
                    <Typography variant="body2">
                      {child.childYear || 'N/A'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Date of Birth:
                    </Typography>
                    <Typography variant="body2">
                      {child.childDob ? format(new Date(child.childDob), 'dd MMM yyyy') : 'N/A'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Parent Email:
                    </Typography>
                    <Typography variant="body2" noWrap sx={{ maxWidth: '65%', textAlign: 'right' }} title={child.parent?.email}>
                      {child.parent?.email || 'N/A'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Parent Mobile:
                    </Typography>
                    <Typography variant="body2">
                      {child.parent?.mobile || 'N/A'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Added Date:
                    </Typography>
                    <Typography variant="body2">
                      {child.date ? format(new Date(child.date), 'dd MMM yyyy') : 'N/A'}
                    </Typography>
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

export default ChildTestGrid; 