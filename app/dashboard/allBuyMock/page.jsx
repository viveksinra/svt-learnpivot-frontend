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
  TablePagination,
} from '@mui/material/';
import { 
  DataGrid, 
  GridToolbar,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
  gridClasses
} from '@mui/x-data-grid';
import { MdModeEdit, MdOutlineMail, MdOutlineClose, MdRestartAlt, MdRemove, MdAdd, MdSearch } from "react-icons/md";
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


// Updated Custom Toolbar Component
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
  const [tabular, setView] = useState(false);
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
  const [pageSize, setPageSize] = useState(100000);
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
            {[ 10, 25, 50, 100,1000,10000,50000].map((size) => (
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
    email: false,
    bookingDate: false,
    status: false,
    address: false,
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
      valueGetter: (params) => params.row.date, // Return raw date value
      valueFormatter: (params) => formatDateToShortMonth(params.value), // Format display
      sortComparator: (v1, v2) => new Date(v1) - new Date(v2), // Compare actual dates
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
      field: 'address2',
      headerName: 'Print Add',
      width: 420,
      valueGetter: (params) => params?.row?.user?.address,
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
      padding: {xs: 10, md: 20},
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "center",
      margin: {xs: "0 10px", md: "0 20px"},
      maxWidth: tabular ? containerWidth : "100%",
    }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography 
            color="primary" 
            variant='h5' 
            gutterBottom
            sx={{ fontFamily: 'Courgette', fontSize: { xs: '1.5rem', md: '2rem' } }}
          >
            All Mock Tests
          </Typography>
        </Grid>
        <Grid item xs={12} md={6} sx={{display:"flex", justifyContent:"end", marginBottom:"20px", flexWrap: "wrap"}}>
          <Search 
            onChange={e=>setSearchText(e.target.value)} 
            value={searchText} 
            fullWidth 
            endAdornment={
              <IconButton 
                size="small" 
                sx={{display: searchText ? "block": "none"}} 
                onClick={()=>setSearchText("")}
              > 
                <MdOutlineClose />
              </IconButton>
            } 
          />
          <ToggleButtonGroup 
            aria-label="ViewMode" 
            sx={{display: "flex", marginLeft:"10px", marginRight:"10px"}}
          >
            <Tooltip arrow title="Grid View">
              <ToggleButton 
                value="grid" 
                selected={!tabular}
                onClick={()=>setView(false)} 
                aria-label="gridView"
              >
                <FcOrgUnit/>
              </ToggleButton>
            </Tooltip>
            <Tooltip arrow title="Table View">
              <ToggleButton 
                value="list" 
                selected={tabular}
                onClick={()=>setView(true)} 
                aria-label="listView"
              >
                <FcTimeline />
              </ToggleButton>
            </Tooltip>
          </ToggleButtonGroup>
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
        <Grid item xs={12} sx={{maxWidth: { xs: 350, sm: 480, md: 700 }, marginBottom:"10px"}}>
          <TabContext value={sortBy}>
            <TabList 
              onChange={(e, v) => setSort(v)} 
              aria-label="Sort options"
              variant="scrollable" 
              scrollButtons="auto" 
              allowScrollButtonsMobile
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
        <div className="center" style={{flexDirection:"column", padding: "40px"}}>
          <CircularProgress size={40} sx={{ color: '#00c853' }}/>
          <Typography 
            color="primary" 
            sx={{ 
              mt: 2,
              fontFamily: 'Courgette',
              fontSize: '1.2rem'
            }}
          >
            Loading Mock Tests...
          </Typography>
        </div>
      ) : rows.length === 0 ? (
        <NoResult label="No Mock Tests Available" />
      ) : tabular ? (
        <div style={{ width: '99.9%', marginTop: 20, overflowX: 'auto' }}>
          <Grid container>
            <Grid item xs={12}>
              {tabular && (
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
              )}
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
                pageSizeOptions={[ 10, 100, 1000, 10000, 100000 ]}
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
      ) : (
        // Grid View
        <Grid container spacing={2}>
          {rows && rows.map((mockTest, i) => {
            // Check if this mock test is currently selected
            const isSelected = selectedItems.some(item => item._id === mockTest._id);
            
            return (
              <Grid item key={i} xs={12} sm={6} md={4} lg={3}>
                <div className="mock-test-card" style={{
                  backgroundColor: isSelected ? '#e8f4ff' : (mockTest.status === 'succeeded' ? '#f8fff9' : '#fffef7'),
                  borderRadius: '12px',
                  padding: '24px',
                  boxShadow: isSelected ? 
                    'rgba(25, 118, 210, 0.25) 0px 4px 12px, rgba(25, 118, 210, 0.5) 0px 0px 0px 2px' : 
                    (mockTest.status === 'succeeded' ? 
                      'rgba(0, 200, 83, 0.1) 0px 4px 12px' : 
                      'rgba(255, 191, 0, 0.1) 0px 4px 12px'),
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  border: isSelected ? 
                    '2px solid #1976d2' : 
                    `1px solid ${mockTest.status === 'succeeded' ? '#e0e7e1' : '#e7e6df'}`
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '0',
                    right: '0',
                    padding: '8px 16px',
                    borderRadius: '0 0 0 12px',
                    backgroundColor: mockTest.status === 'succeeded' ? '#e3ffea' : '#ffffe6',
                    zIndex: 2
                  }}>
                    <Chip 
                      icon={mockTest.status === 'succeeded' ? <FcOk /> : <FcNoIdea />}
                      label={mockTest.status} 
                      size="small"
                      color={mockTest.status === 'succeeded' ? "success" : "warning"}
                      variant="outlined"
                    />
                  </div>

                  <Typography 
                    color="primary" 
                    variant="h6" 
                    sx={{
                      mb: 1,
                      fontWeight: 600,
                      fontSize: '1.1rem',
                      pr: 12, // Increased padding to avoid overlap with status chip
                      pl: isSelected ? 4 : 0, // Add left padding when selected
                      position: 'relative',
                      zIndex: 1
                    }}
                  >
                    {mockTest.mockTestId?.mockTestTitle}
                  </Typography>

                  <Grid container spacing={1} sx={{ mb: 2 }}>
                    <Grid item>
                      <Chip 
                        label={`${mockTest.childId?.childName}`} 
                        size="small" 
                        color="primary" 
                      />
                    </Grid>
                    <Grid item>
                      <Chip 
                        label={mockTest.childId?.childGender} 
                        size="small" 
                        variant="outlined" 
                      />
                    </Grid>
                  </Grid>

                  <div style={{ 
                    background: '#f5f5f5', 
                    borderRadius: '8px', 
                    padding: '12px',
                    marginBottom: '16px' 
                  }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary">Parent</Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {`${mockTest.user?.firstName} ${mockTest.user?.lastName}`}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary">Contact</Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {mockTest.user?.mobile}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          {mockTest.user?.email}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary">Batch Details</Typography>
                        <Typography variant="body2" fontWeight={500}>
                          📅 {formatDateToShortMonth(mockTest.selectedBatch?.date)}
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                          ⏰ {mockTest.selectedBatch?.startTime} - {mockTest.selectedBatch?.endTime}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary">Booking Date</Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {formatDateToShortMonth(mockTest.date)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </div>

                  <Button
                    fullWidth
                    onClick={() => {
                      if (isSelected) {
                        // Remove from selection if already selected
                        setSelectedItems(selectedItems.filter(item => item._id !== mockTest._id));
                      } else {
                        // Add to selection
                        setSelectedItems([...selectedItems, mockTest]);
                      }
                    }}
                    variant={isSelected ? "contained" : "outlined"}
                    startIcon={isSelected ? <MdOutlineClose /> : <MdOutlineMail />}
                    color={isSelected ? "error" : "secondary"}
                    sx={{
                      textTransform: 'none',
                      borderRadius: '8px',
                      mb: 1
                    }}
                  >
                    {isSelected ? "Remove Selection" : "Select for Email"}
                  </Button>
                  
    
                  
                  {/* Show selected indicator */}
                  {isSelected && (
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      backgroundColor: '#1976d2',
                      borderRadius: '50%',
                      width: '26px',
                      height: '26px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      zIndex: 3,
                      border: '2px solid white'
                    }}>
                      ✓
                    </div>
                  )}
                </div>
              </Grid>
            );
          })}
        </Grid>
      )}
      <TablePagination
        rowsPerPageOptions={[10, 100, 1000, 10000, 100000]}
        component="div"
        count={totalCount}
        sx={{overflowX: "hidden"}}
        rowsPerPage={pageSize}
        page={page}
        onPageChange={(e, v) => setPage(v)}
        onRowsPerPageChange={e => {
          setPageSize(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />
      <br/> <br/> <br/>
    </main>
  );
}

export default MyMockTest;