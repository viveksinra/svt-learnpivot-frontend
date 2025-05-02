"use client";
import React from 'react';
import { 
  Box,
  Typography,
  Tooltip,
  Chip
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { format } from 'date-fns';

const UserTestTable = ({ data }) => {
  const columns = [
    { 
      field: 'firstName', 
      headerName: 'First Name', 
      flex: 1,
      minWidth: 130,
    },
    { 
      field: 'lastName', 
      headerName: 'Last Name', 
      flex: 1,
      minWidth: 130,
    },
    { 
      field: 'email', 
      headerName: 'Email',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span>{params.value}</span>
        </Tooltip>
      )
    },
    { 
      field: 'mobile', 
      headerName: 'Mobile',
      flex: 1,
      minWidth: 120,
    },
    { 
      field: 'jobRole', 
      headerName: 'Role',
      flex: 1,
      minWidth: 100,
      valueGetter: (params) => params.row.jobRole?.label,
      renderCell: (params) => (
        <Chip 
          label={params.value}
          color={params.value === 'Admin' ? 'primary' : 'default'}
          variant="outlined"
        />
      )
    },
    { 
      field: 'city', 
      headerName: 'City',
      flex: 1,
      minWidth: 120,
    },
    { 
      field: 'postcode', 
      headerName: 'Postcode',
      flex: 1,
      minWidth: 100,
    },
    { 
      field: 'children', 
      headerName: 'Children',
      flex: 1,
      minWidth: 100,
      valueGetter: (params) => params.row.children?.length || 0,
      renderCell: (params) => (
        <Chip 
          label={params.value}
          color={params.value > 0 ? 'success' : 'default'}
          variant="outlined"
        />
      )
    },
    { 
      field: 'date', 
      headerName: 'Registration Date',
      flex: 1,
      minWidth: 130,
      valueFormatter: (params) => format(new Date(params.value), 'dd MMM yyyy')
    },
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
          All User
        </Typography>
      </Box>
      <DataGrid
        rows={data.map((row) => ({...row, id: row._id}))}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 25 },
          },
          sorting: {
            sortModel: [{ field: 'date', sort: 'desc' }],
          },
        }}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        pageSizeOptions={[10, 25, 50, 100,1000]}
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

export default UserTestTable;