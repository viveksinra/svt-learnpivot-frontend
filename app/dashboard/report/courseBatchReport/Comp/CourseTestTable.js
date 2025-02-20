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
  IconButton
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { format } from 'date-fns';

const CourseTestTable = ({ data }) => {


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
        />
      )
    }
  ];

  

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
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Mock Test Schedule
        </Typography>
  
      </Box>
      <DataGrid
        rows={data.map((row, index) => ({...row, id: index}))}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 25 },
          },
          sorting: {
            sortModel: [{ field: 'batchDate', sort: 'desc' }],
          },
        }}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        pageSizeOptions={[10, 25, 50]}
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
          }
        }}
      />
    </Box>
  );
};

export default CourseTestTable;