import React from 'react';
import { styled, Grid, IconButton, Typography, Tooltip, Box, useTheme, useMediaQuery } from '@mui/material';
import { DataGrid, GridToolbar, gridClasses } from '@mui/x-data-grid';
import { MdRemove, MdAdd, MdRestartAlt } from "react-icons/md";
import EmptyContent from '@/app/Components/EmptyContent';

// Styled Components
const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  '& .status-succeeded': {
    backgroundColor: '#e8f5e9',
    '&:hover': {
      backgroundColor: '#c8e6c9',
    },
  },
  '& .status-pending': {
    backgroundColor: '#fff3e0',
    '&:hover': {
      backgroundColor: '#ffe0b2',
    },
  },
  // Add horizontal scroll
  '& .MuiDataGrid-main': {
    overflow: 'auto',
  },
  '& .MuiDataGrid-virtualScroller': {
    overflow: 'auto',
  },
  // Optional: Add some styling for better scroll appearance
  '& ::-webkit-scrollbar': {
    height: '8px',
    width: '8px',
  },
  '& ::-webkit-scrollbar-track': {
    background: '#f1f1f1',
  },
  '& ::-webkit-scrollbar-thumb': {
    background: '#888',
    borderRadius: '4px',
  },
  '& ::-webkit-scrollbar-thumb:hover': {
    background: '#555',
  },
}));

function CustomToolbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <GridToolbar 
      sx={{
        p: isMobile ? 0.5 : 1,
        display: 'flex',
        gap: 0.5,
        flexWrap: 'wrap',
        '& .MuiButton-root': {
          color: 'primary.main',
          fontSize: isMobile ? '0.75rem' : 'inherit',
          padding: isMobile ? '4px 8px' : 'inherit',
          minWidth: isMobile ? 'unset' : 'inherit',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        },
      }}
    />
  );
}

const DataGridView = ({ 
  rows, 
  columns, 
  loading, 
  page, 
  setPage, 
  pageSize, 
  setPageSize,
  totalCount, 
  selectedItems, 
  handleSelectionChange,
  containerWidth,
  incrementWidth,
  decrementWidth,
  handleWidthReset,
  columnVisibilityModel,
  setColumnVisibilityModel,
  CustomPagination
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Responsive columns - adjust column widths for mobile
  const responsiveColumns = columns.map(column => ({
    ...column,
    width: isMobile ? Math.min(column.width, 120) : column.width,
    flex: isMobile ? (column.field === 'mockTestTitle' ? 1 : undefined) : undefined
  }));

  return (
    <Box sx={{ width: '100%', mt: 2, overflowX: 'auto' }}>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 0.5,
          backgroundColor: '#f5f5f5',
          p: { xs: 1, sm: 1.5 },
          borderRadius: 1,
          mb: 2,
          flexWrap: 'wrap'
        }}>
          <Tooltip title="Decrease width">
            <IconButton 
              onClick={decrementWidth}
              disabled={containerWidth <= 1000}
              size="small"
            >
              <MdRemove />
            </IconButton>
          </Tooltip>
          <Typography variant="body2" sx={{ mx: 1, minWidth: 80 }}>
            {containerWidth}px
          </Typography>
          <Tooltip title="Increase width">
            <IconButton 
              onClick={incrementWidth}
              disabled={containerWidth >= 2000}
              size="small"
            >
              <MdAdd />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reset width">
            <IconButton 
              onClick={handleWidthReset}
              color="primary"
              size="small"
            >
              <MdRestartAlt />
            </IconButton>
          </Tooltip>
        </Box>

        <StyledDataGrid
          rows={rows}
          columns={responsiveColumns}
          getRowId={(row) => row._id}
          pagination
          paginationMode="server"
          rowCount={totalCount}
          page={page}
          onPageChange={(newPage) => setPage(newPage)}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => {
            setPageSize(newPageSize);
            setPage(0);
          }}
          pageSizeOptions={[10, 25, 50, 100, 1000]}
          checkboxSelection
          disableRowSelectionOnClick
          rowSelectionModel={selectedItems.map(item => item._id)}
          onRowSelectionModelChange={handleSelectionChange}
          loading={loading}
          initialState={{
            filter: {
              filterModel: {
                items: [],
              },
            },
            columns: {
              columnVisibilityModel: {
                email: false,
                bookingDate: false,
                status: false,
                address: false,
              }
            }
          }}
          columnVisibilityModel={columnVisibilityModel}
          onColumnVisibilityModelChange={(newModel) => {
            setColumnVisibilityModel(newModel);
          }}
          components={{
            noRowsOverlay: () => <EmptyContent title="No Mock Tests Available" />,
            noResultsOverlay: () => <EmptyContent title="No results found" />,
          }}
          slots={{ 
            toolbar: CustomToolbar,
            pagination: CustomPagination,
          }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          getRowClassName={(params) => `status-${params?.row?.status}`}
          autoHeight
          disableExtendRowFullWidth={false}
          filterMode="client"
          sortingMode="client"
          disableColumnFilter={false}
          disableColumnSelector={false}
          disableDensitySelector={false}
          sx={{
            [`& .${gridClasses.cell}`]: { 
              alignItems: 'center', 
              display: 'inline-flex',
              fontSize: isMobile ? '0.8rem' : 'inherit'
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f5f5f5',
              fontSize: isMobile ? '0.8rem' : 'inherit'
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              fontWeight: 'bold',
              fontSize: isMobile ? '0.8rem' : 'inherit'
            },
            '& .MuiDataGrid-cell:focus': {
              outline: 'none',
            },
            width: '100%',
            '& .MuiDataGrid-root': {
              maxWidth: '100%',
            },
            '& .MuiDataGrid-virtualScroller': {
              minHeight: 200,
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: '1px solid rgba(224, 224, 224, 1)',
              '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                fontSize: isMobile ? '0.8rem' : 'inherit'
              }
            },
            '& .MuiDataGrid-row': {
              '&:nth-of-type(odd)': {
                backgroundColor: 'rgba(0, 0, 0, 0.02)',
              },
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            },
            borderRadius: 2,
            border: '1px solid rgba(224, 224, 224, 1)',
            '& .MuiDataGrid-filterIcon': {
              color: 'primary.main',
            },
            '& .MuiDataGrid-columnHeaderTitleContainer': {
              padding: '0 8px',
            },
            '& .MuiDataGrid-toolbarContainer': {
              padding: isMobile ? '4px' : '8px',
              gap: isMobile ? '4px' : '8px',
            }
          }}
        />
      </Box>
    </Box>
  );
};

export default DataGridView; 