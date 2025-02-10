'use client';
import "./addMockTestStyle.css";
import React, { lazy, Suspense, useEffect, useState, useRef, useCallback } from 'react';
import { debounce, max, set } from 'lodash';
import {
  Typography, 
  Fab, 
  styled, 
  CircularProgress, 
  Grid, 
  AppBar, 
  Toolbar,
  Tooltip, 
  IconButton,
  Tab,
  ButtonGroup,
  ToggleButtonGroup,
  ToggleButton,
  Chip,
  Button,
  Slider,
  Box,
} from '@mui/material/';
import { 
  DataGrid, 
  GridToolbar,
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
  gridClasses
} from '@mui/x-data-grid';
import { MdModeEdit, MdOutlineMail, MdOutlineClose, MdRestartAlt, MdRemove, MdAdd } from "react-icons/md";
import { FcOk, FcNoIdea, FcOrgUnit, FcTimeline } from "react-icons/fc";
import { BsTable } from "react-icons/bs";
import Loading from "../../Components/Loading/Loading";
import NoResult from "@/app/Components/NoResult/NoResult";
import Search from "../../Components/Search";
import { registrationService } from "@/app/services";
import { formatDateToShortMonth } from "@/app/utils/dateFormat";
import MulSelCom from "./MulSelCom";
import { TabContext, TabList } from "@mui/lab";
import EmptyContent from '@/app/Components/EmptyContent';

const SendEmailCom = lazy(() => import("./SendEmailCom"));

// Custom Pagination Component


// Custom Toolbar Component
function CustomToolbar({ setFilterButtonEl }) {
  return (
    <GridToolbar 
      sx={{
        p: 2,
        display: 'flex',
        gap: 1,
        flexWrap: 'wrap',
        '& .MuiButtonBase-root': {
          borderRadius: 1,
          px: 2,
        },
      }}
    />
  );
}

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

const ToggleFab = styled(Fab)({
  position: 'absolute',
  zIndex: 1,
  top: -25,
  left: 0,
  right: 0,
  margin: '0 auto',
});

const StyledCard = styled('div')(({ status }) => ({
  backgroundColor: status === 'succeeded' ? '#e3ffea' : '#ffffe6',
  borderRadius: '8px',
  padding: '20px',
  position: 'relative',
  marginBottom: '20px',
  boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
}));

function MyMockTest() {
  const [viewTabular, toggleView] = useState(true);
  const [id, setId] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const entryRef = useRef();

   useEffect(() => { 
  console.log("selectedItems", selectedItems);
    

  }, [selectedItems])
  

  return (
    <main>
      {viewTabular ? (
        <Suspense fallback={<Loading />}>
          <SearchArea 
            selectedItems={selectedItems} 
            setSelectedItems={setSelectedItems} 
            handleEdit={(id) => { 
              toggleView(false); 
              setId(id); 
            }} 
          />
        </Suspense>
      ) : (
        <Suspense fallback={null}>
          <SendEmailCom 
            selectedItems={selectedItems} 
            ref={entryRef} 
            id={id} 
            setId={setId} 
          />
        </Suspense>
      )}
      <AppBar position="fixed" sx={{ top: 'auto', bottom: 0, background: "#d6f9f7" }}>
        <Toolbar variant="dense">
          <span style={{ flexGrow: 0.2 }} />
          <span style={{ flexGrow: 0.3 }} />
          {selectedItems.length >= 1 && (
            <Tooltip arrow title={viewTabular ? "Send Email to selected" : "Show List"}>
              <ToggleFab onClick={() => toggleView(!viewTabular)} color="secondary" size="medium">
                {viewTabular ? <MdOutlineMail style={{ fontSize: 24 }} /> : <BsTable style={{ fontSize: 24 }} />}
              </ToggleFab>
            </Tooltip>
          )}
          <span style={{ flexGrow: 0.3 }} />
        </Toolbar>
      </AppBar>
    </main>
  );
}

function SearchArea({ handleEdit, selectedItems, setSelectedItems }) {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [tabular, setView] = useState(true);
  const sortOptions = [
    { label: "New First", value: "newToOld" }, 
    { label: "Old First", value: "oldToNew" }
  ];
  const [sortBy, setSort] = useState("newToOld");
  const [searchText, setSearchText] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [selectedMockTests, setSelectedMockTests] = useState([]);
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [successOnly, setSuccessOnly] = useState(true);
  const [containerWidth, setContainerWidth] = useState(1250);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [filterButtonEl, setFilterButtonEl] = useState(null);

  function CustomPagination() {
    const pageCount = totalCount / pageSize;
    const handleChangeRowsPerPage = (event) => {
      const newPageSize = parseInt(event.target.value, 10);
      setPageSize(newPageSize);
      setPage(0);
    };
  
    return (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2,
        padding: '8px'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ mr: 2 }}>Rows per page:</Typography>
          <select
            value={pageSize}
            onChange={handleChangeRowsPerPage}
            style={{
              padding: '4px 8px',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
          >
            {[ 10, 25, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </Box>
        <ButtonGroup variant="outlined" size="small">
          <Button
            onClick={() => setPage(0)}
            disabled={page === 0}
          >
            First
          </Button>
          <Button
            onClick={() => setPage(Math.max(page - 1, 0))}
            disabled={page === 0}
          >
            Previous
          </Button>
          <Button disabled>
            Page {page + 1} of {Math.ceil(pageCount)}
          </Button>
          <Button
            onClick={() => setPage(Math.min(page + 1, pageCount))}
            disabled={page >= Math.ceil(pageCount) - 1}
          >
            Next
          </Button>
          <Button
            onClick={() => setPage(Math.ceil(pageCount) - 1)}
            disabled={page >= Math.ceil(pageCount) - 1}
          >
            Last
          </Button>
        </ButtonGroup>
      </Box>
    );
  }



  const handleWidthReset = () => {
    setContainerWidth(1250);
  };

  const incrementWidth = () => {
    setContainerWidth(prev => Math.min(prev + 50, 2000));
  };

  const decrementWidth = () => {
    setContainerWidth(prev => Math.max(prev - 50, 1000));
  };

  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    address: false,
    mobileNo: false
  });

  const columns = [
    {
      field: 'mockTestTitle',
      headerName: 'Mock Test Title',
      width: 200,
      valueGetter: (params) => params?.row?.mockTestId?.mockTestTitle,
      filterable: true,
    },
    {
      field: 'parentName',
      headerName: 'Parent Name',
      width: 150,
      valueGetter: (params) => `${params?.row?.user?.firstName} ${params?.row?.user?.lastName}`,
      filterable: true,
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 200,
      valueGetter: (params) => params?.row?.user?.email,
      filterable: true,
    },
    {
      field: 'childName',
      headerName: 'Child Name',
      width: 150,
      valueGetter: (params) => params?.row?.childId?.childName,
      filterable: true,
    },
    {
      field: 'childGender',
      headerName: 'Child Gender',
      width: 120,
      valueGetter: (params) => params?.row?.childId?.childGender,
      filterable: true,
    },
    {
      field: 'batchDates',
      headerName: 'Batch Dates',
      width: 120,
      valueGetter: (params) => formatDateToShortMonth(params?.row?.selectedBatch?.date),
      filterable: true,
    },
    {
      field: 'batchTimes',
      headerName: 'Batch Times',
      width: 150,
      valueGetter: (params) => `${params?.row?.selectedBatch?.startTime}-${params?.row?.selectedBatch?.endTime}`,
      filterable: true,
    },
    {
      field: 'bookingDate',
      headerName: 'Booking Date',
      width: 120,
      valueGetter: (params) => {
        // Store the original date for sorting
        const originalDate = new Date(params?.row?.date);
        return {
          sort: originalDate.getTime(), // Use timestamp for sorting
          formatted: formatDateToShortMonth(params?.row?.date) // Use formatted date for display
        };
      },
      valueFormatter: (params) => params?.value?.formatted, // Display the formatted date
      sortComparator: (v1, v2) => v1.sort - v2.sort, // Compare using timestamps
      filterable: true,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params?.row?.status}
          color={params?.row?.status === 'succeeded' ? 'success' : 'default'}
          variant="outlined"
          size="small"
        />
      ),
      filterable: true,
      sortable: true,
    },

    {
      field: 'mobileNo',
      headerName: 'Mobile Number',
      width: 150,
      valueGetter: (params) => params?.row?.user?.mobile,
      filterable: true,
    },

    {
      field: 'address',
      headerName: 'Address',
      width: 420,
      valueGetter: (params) => params?.row?.user?.address,
      filterable: true,
    },
  ];

  useEffect(() => {
    async function fetchAllData() {
      setLoading(true);
      try {
        let response = await registrationService.getMockWithFilter({ 
          sortBy, 
          rowsPerPage: pageSize, 
          page: page + 1, // backend expects 1-based page numbers
          searchText, 
          selectedMockTests, 
          selectedBatches, 
          successOnly 
        });
        if (response.variant === "success") {
          setRows(response.data);
          setTotalCount(response.totalCount);
          
          // Update selectedItems to maintain selection after data refresh
          const currentSelectedIds = selectedItems.map(item => item._id);
          const updatedSelectedItems = response.data.filter(row => 
            currentSelectedIds.includes(row._id)
          );
          setSelectedItems(updatedSelectedItems);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchAllData();
  }, [page, pageSize, searchText, sortBy, selectedMockTests, selectedBatches, successOnly]);

  const handleSelectionChange = (newSelectionModel) => {
    console.log("newSelectionModel", newSelectionModel);
    const selectedRows = rows.filter(row => 
      newSelectionModel.includes(row._id)
    );
    setSelectedItems(selectedRows);
  };

  // Function to get toggleable columns
  const getTogglableColumns = useCallback(() => {
    return columns.filter(column => column.field !== 'actions');
  }, []);

  return (
    <main style={{ 
      background: "#fff", 
      boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px", 
      borderRadius: 8, 
      padding: 20,
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "center",
      marginRight: 20,
      maxWidth: containerWidth,
    }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          backgroundColor: '#f5f5f5',
          padding: '8px',
          borderRadius: '4px',
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
        <Grid item xs={12} md={6}>
          <Typography 
            color="primary" 
            variant='h5' 
            gutterBottom
          >
            All Mock Tests
          </Typography>
        </Grid>
       
        <Grid item xs={12}>
          <MulSelCom 
            selectedMockTests={selectedMockTests} 
            setSelectedMockTests={setSelectedMockTests} 
            selectedBatches={selectedBatches} 
            setSelectedBatches={setSelectedBatches} 
            successOnly={successOnly} 
            setSuccessOnly={setSuccessOnly} 
          />
        </Grid>
        <Grid item xs={12}>
          <TabContext value={sortBy}>
            <TabList 
              onChange={(e, v) => setSort(v)} 
              aria-label="Sort options"
            >
              {sortOptions.map((option) => (
                <Tab 
                  key={option.value}
                  label={option.label}
                  value={option.value}
                />
              ))}
            </TabList>
          </TabContext>
        </Grid>
      </Grid>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
          <CircularProgress />
        </div>
      ) : rows.length === 0 ? (
        <NoResult label="No Mock Tests Available" />
      ) : (
        <div style={{  width: '99.9%', marginTop: 20 }}>
          <Grid container>
            <Grid item xs={12} style={{ overflowX: 'auto' }}>
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
                pageSizeOptions={[ 10, 25, 50, 100]}
                checkboxSelection
  disableRowSelectionOnClick // updated from disableSelectionOnClick
  rowSelectionModel={selectedItems.map(item => item._id)} // updated from selectionModel
  onRowSelectionModelChange={handleSelectionChange} 
                loading={loading}
                initialState={{
                  columns: {
                    columnVisibilityModel: {
                      address: false,
                      mobileNo: false,
                    }
                  }
                }}
                columnVisibilityModel={columnVisibilityModel}
                onColumnVisibilityModelChange={(newModel) => {
                  setColumnVisibilityModel(newModel);
                }}
                components={{
                  Toolbar: CustomToolbar,
                  Pagination: CustomPagination,
                  noRowsOverlay: () => <EmptyContent title="No Mock Tests Available" />,
                  noResultsOverlay: () => <EmptyContent title="No results found" />,
                }}
                componentsProps={{
                  toolbar: { setFilterButtonEl },
                  panel: { anchorEl: filterButtonEl },
                  columnsManagement: { getTogglableColumns },
                }}
                getRowClassName={(params) => `status-${params?.row?.status}`}
                autoHeight
                disableExtendRowFullWidth={false}
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
                }}
            
              />
            </Grid>
          </Grid>
        </div>
      )}
    </main>
  );
}

export default MyMockTest;