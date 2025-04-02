"use client";
import React, { useState } from 'react';
import { 
  Box,
  Button,
  Typography,
  TextField,
  InputAdornment,
  Tooltip,
  Chip,
  IconButton,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { DataGrid, GridToolbar, GridToolbarExport } from '@mui/x-data-grid';
import { format } from 'date-fns';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const MockTestTable = ({ data, exportFileName = 'grid-export' }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const columns = [
    { 
      field: 'title', 
      headerName: 'Title', 
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span>{params.value}</span>
        </Tooltip>
      )
    },
    { 
      field: 'batchDate', 
      headerName: 'Date',
      flex: 1,
      minWidth: 40,
      valueFormatter: (params) => format(new Date(params.value), 'dd MMM yyyy')
    },
    { 
      field: 'batchTime', 
      headerName: 'Time', 
      flex: 1,
      minWidth: 40 
    },
    { 
      field: 'totalSeat', 
      headerName: 'Total Seats',
      flex: 1,
      minWidth: 40,
      renderCell: (params) => (
        <Chip 
          label={params.value}
          color="primary"
          variant="outlined"
          size={isMobile ? "small" : "medium"}
        />
      )
    },
    { 
      field: 'filledSeat', 
      headerName: 'Booked Seats',
      flex: 1,
      minWidth: 40,
      renderCell: (params) => (
        <Chip 
          label={params.value}
          color="secondary"
          variant="outlined"
          size={isMobile ? "small" : "medium"}
        />
      )
    },
    { 
      field: 'remainingSeat', 
      headerName: 'Available Seats',
      flex: 1,
      minWidth: 40,
      renderCell: (params) => (
        <Chip 
          label={params.value}
          color={params.value > 0 ? "success" : "error"}
          variant="outlined"
          size={isMobile ? "small" : "medium"}
        />
      )
    }
  ];

  // Select columns to display based on screen size
  const visibleColumns = isMobile 
    ? columns.filter(col => ['title', 'batchDate', 'remainingSeat'].includes(col.field))
    : columns;

  // Custom export toolbar component
  const CustomExportButton = () => (
    <GridToolbarExport 
      csvOptions={{
        fileName: exportFileName,
        delimiter: ',',
        utf8WithBom: true,
      }}
      printOptions={{
        hideFooter: true,
        hideToolbar: true,
      }}
      startIcon={<FileDownloadIcon />}
    />
  );

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Typography variant={isMobile ? "h6" : "h5"} sx={{ fontWeight: 600 }}>
          Mock Batch Report
        </Typography>
      </Box>
      <DataGrid
        rows={data.map((row, index) => ({...row, id: index}))}
        columns={visibleColumns}
        autoHeight
        density={isMobile ? "compact" : "standard"}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: isMobile ? 10 : 25 },
          },
          sorting: {
            sortModel: [{ field: 'batchDate', sort: 'asc' }],
          },
        }}
        slots={{ 
          toolbar: GridToolbar,
        }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
            csvOptions: { 
              fileName: exportFileName,
              delimiter: ',',
              utf8WithBom: true,
            },
            printOptions: {
              disableToolbarButton: false,
              hideFooter: true,
              hideToolbar: true,
            },
          },
        }}
        pageSizeOptions={isMobile ? [5, 10, 25] : [10, 25, 50, 100]}
        sx={{
          '& .MuiDataGrid-cell': {
            py: 1.5
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: 'action.hover',
          },
          '@media print': {
            '.MuiDataGrid-toolbarContainer': {
              display: 'none'
            }
          },
          // Mobile-specific styles
          ...(isMobile && {
            '& .MuiDataGrid-columnHeaders': {
              fontSize: '0.75rem',
            },
            '& .MuiDataGrid-cell': {
              py: 1,
              px: 0.5,
              fontSize: '0.75rem',
            },
            '& .MuiDataGrid-toolbarContainer': {
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 1,
              p: 1
            }
          })
        }}
      />
    </Box>
  );
};

export default MockTestTable;