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

const UserTestGrid = ({ data, exportFileName = 'user-report' }) => {
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "UserReport");
    XLSX.writeFile(workbook, `${exportFileName}.xlsx`);
    handleClose();
  };

  const exportToCSV = () => {
    const csvData = data.map(row => {
      return {
        'First Name': row.firstName || 'N/A',
        'Last Name': row.lastName || 'N/A',
        Email: row.email || 'N/A',
        Mobile: row.mobile || 'N/A',
        Role: row.jobRole?.label || 'N/A',
        City: row.city || 'N/A',
        Postcode: row.postcode || 'N/A',
        Children: row.children?.length || 0,
        'Registration Date': row.date ? format(new Date(row.date), 'dd MMM yyyy') : 'N/A'
      };
    });
    
    const worksheet = XLSX.utils.json_to_sheet(csvData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "UserReport");
    XLSX.writeFile(workbook, `${exportFileName}.csv`, { bookType: 'csv' });
    handleClose();
  };

  // Get initials for avatar
  const getInitials = (firstName, lastName) => {
    if (!firstName && !lastName) return '?';
    return `${firstName ? firstName[0] : ''}${lastName ? lastName[0] : ''}`.toUpperCase();
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
          User Report
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
        {data.map((user, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={user._id || index}>
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
                      bgcolor: getAvatarColor(`${user.firstName} ${user.lastName}`),
                      fontSize: { xs: '0.75rem', sm: '0.875rem' }
                    }}
                  >
                    {getInitials(user.firstName, user.lastName)}
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
                    title={`${user.firstName} ${user.lastName}`}
                  >
                    {`${user.firstName} ${user.lastName}`}
                  </Typography>
                }
                subheader={
                  <Typography variant="body2" color="text.secondary" noWrap title={user.email}>
                    {user.email}
                  </Typography>
                }
                sx={{ pb: 0 }}
              />
              <CardContent sx={{ pt: 1, pb: 2, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Mobile:
                    </Typography>
                    <Typography variant="body2">
                      {user.mobile || 'N/A'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Role:
                    </Typography>
                    <Chip 
                      label={user.jobRole?.label || 'N/A'}
                      color={user.jobRole?.label === 'Admin' ? 'primary' : 'default'}
                      variant="outlined"
                      size="small"
                    />
                  </Box>

                  {user.city && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        City:
                      </Typography>
                      <Typography variant="body2">
                        {user.city}
                      </Typography>
                    </Box>
                  )}
                  
                  {user.postcode && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        Postcode:
                      </Typography>
                      <Typography variant="body2">
                        {user.postcode}
                      </Typography>
                    </Box>
                  )}
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Children:
                    </Typography>
                    <Chip 
                      label={user.children?.length || 0}
                      color={(user.children?.length || 0) > 0 ? "success" : "default"}
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                  
                  {user.date && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        Reg. Date:
                      </Typography>
                      <Typography variant="body2">
                        {format(new Date(user.date), 'dd MMM yyyy')}
                      </Typography>
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

export default UserTestGrid; 