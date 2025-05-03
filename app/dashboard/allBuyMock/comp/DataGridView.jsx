import React from 'react';
import { styled, Grid, IconButton, Typography, Tooltip } from '@mui/material';
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
  return (
    <GridToolbar 
      sx={{
        p: 1,
        display: 'flex',
        gap: 1,
        flexWrap: 'wrap',
        '& .MuiButton-root': {
          color: 'primary.main',
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
  return (
    <div style={{ width: '99.9%', marginTop: 20, overflowX: 'auto' }}>
      <Grid container>
        <Grid item xs={12}>
          <Grid item xs={12} sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            backgroundColor: '#f5f5f5',
            padding: '8px',
            borderRadius: '4px',
            marginBottom: 2
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
          </Grid>
          <StyledDataGrid
            rows={rows}
            columns={columns}
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
                display: 'inline-flex' 
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#f5f5f5',
              },
              '& .MuiDataGrid-cell:focus': {
                outline: 'none',
              },
              width: '99.9%',
              '& .MuiDataGrid-root': {
                maxWidth: '99.9%',
              },
              '& .MuiDataGrid-virtualScroller': {
                minHeight: 200,
              },
              '& .MuiDataGrid-footerContainer': {
                borderTop: '1px solid rgba(224, 224, 224, 1)',
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
                padding: '8px',
                gap: '8px',
              }
            }}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default DataGridView; 