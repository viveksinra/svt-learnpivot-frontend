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

const ChildTestTable = ({ data }) => {
  const columns = [
    { 
      field: 'childName', 
      headerName: 'Child Name', 
      flex: 1,
      minWidth: 150,
    },
    { 
      field: 'childGender', 
      headerName: 'Gender', 
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Chip 
          label={params.value}
          color={params.value === 'Boy' ? 'primary' : 'secondary'}
          variant="outlined"
        />
      )
    },
    { 
      field: 'childYear', 
      headerName: 'Year Group',
      flex: 1,
      minWidth: 120,
    },
    { 
      field: 'childDob', 
      headerName: 'Date of Birth',
      flex: 1,
      minWidth: 120,
      valueFormatter: (params) => format(new Date(params.value), 'dd MMM yyyy')
    },
    { 
      field: 'parentName', 
      headerName: 'Parent Name',
      flex: 1,
      minWidth: 150,
      valueGetter: (params) => `${params.row.parent.firstName} ${params.row.parent.lastName}`
    },
    { 
      field: 'parentEmail', 
      headerName: 'Parent Email',
      flex: 1,
      minWidth: 200,
      valueGetter: (params) => params.row.parent.email,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span>{params.value}</span>
        </Tooltip>
      )
    },
    { 
      field: 'parentMobile', 
      headerName: 'Parent Mobile',
      flex: 1,
      minWidth: 120,
      valueGetter: (params) => params.row.parent.mobile
    },
    { 
      field: 'date', 
      headerName: 'Child Added Date', // Changed from 'Registration Date'
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
          All Child
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
        pageSizeOptions={[10, 25, 50, 100]}
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

export default ChildTestTable;