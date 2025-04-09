'use client';
import "./addCourseStyle.css";
import React, { lazy, Suspense, useEffect, useState, useRef } from 'react';
import {
  Typography, Fab, styled, CircularProgress, Tab, Grid, ButtonGroup, AppBar, Toolbar,
  Button, Tooltip, IconButton, Box, Chip, ToggleButtonGroup, ToggleButton, TablePagination,
} from '@mui/material/';
import { 
  DataGrid, 
  GridToolbar,
  gridClasses,
} from '@mui/x-data-grid';
import { MdModeEdit, MdOutlineMail, MdOutlineClose, MdRemove, MdAdd, MdRestartAlt, MdSearch } from "react-icons/md";
import { BsTable } from "react-icons/bs";
import { FcOk, FcNoIdea, FcOrgUnit, FcTimeline } from "react-icons/fc";
import Loading from "../../Components/Loading/Loading";
import NoResult from "@/app/Components/NoResult/NoResult";
import Search from "../../Components/Search";
import { registrationService } from "@/app/services";
import { formatDateToShortMonth } from "@/app/utils/dateFormat";
import MulSelCom from "./MulSelCom";
import { TabContext, TabList } from "@mui/lab";
import EmptyContent from '@/app/Components/EmptyContent';

const SendEmailCom = lazy(() => import("./SendEmailCom"));

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

function MyCourse() {
  const [viewTabular, toggleView] = useState(true);
  const [id, setId] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const entryRef = useRef();

  return (
    <main>
      {viewTabular ? (
        <Suspense fallback={<Loading />}>
          <SearchArea selectedItems={selectedItems} setSelectedItems={setSelectedItems} handleEdit={(id) => { toggleView(false); setId(id); }} />
        </Suspense>
      ) : (
        <Suspense fallback={null}>
          <SendEmailCom selectedItems={selectedItems} ref={entryRef} id={id} setId={setId} />
        </Suspense>
      )}
      <AppBar position="fixed" sx={{ top: 'auto', bottom: 0, background: "#d6f9f7" }}>
        <Toolbar variant="dense">
          <span style={{ flexGrow: 0.2 }} />
          {!viewTabular && (
            <Button variant="contained" onClick={() => entryRef.current.handleClear()} startIcon={<MdOutlineClose />} size='small' color="info">
              Clear
            </Button>
          )}
          <span style={{ flexGrow: 0.3 }} />
          {selectedItems.length >= 1 && (
            <Tooltip arrow title={viewTabular ? "Send Email to selected" : "Show List"}>
              <ToggleFab onClick={() => toggleView(!viewTabular)} color="secondary" size="medium">
              <MdOutlineMail style={{ fontSize: 24 }} /> 
              </ToggleFab>
            </Tooltip>
          )}
          <span style={{ flexGrow: 0.3 }} />
          {!viewTabular && (
            <Button variant="contained" onClick={() => entryRef.current.handleSubmit()} startIcon={<FcOk />} size='small' color="success">
              {id ? "Update" : "Save"}
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </main>
  );
}

export const ToggleFab = styled(Fab)({
  position: 'absolute',
  zIndex: 1,
  top: -25,
  left: 0,
  right: 0,
  margin: '0 auto',
});

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
  '& .MuiDataGrid-main': {
    overflow: 'auto',
  },
  '& .MuiDataGrid-virtualScroller': {
    overflow: 'auto',
  },
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

export function SearchArea({ handleEdit, selectedItems, setSelectedItems }) {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const sortOptions = [{ label: "New First", value: "newToOld" }, { label: "Old First", value: "oldToNew" }];
  const [sortBy, setSort] = useState("newToOld");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [successOnly, setSuccessOnly] = useState(true);
  const [containerWidth, setContainerWidth] = useState(1250);
  const [tabular, setView] = useState(true);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    email: false,
    bookingDate: false,
    status: false,
    address: false,
  });

  const columns = [
    {
      field: 'courseTitle',
      headerName: 'Course Title',
      width: 200,
      valueGetter: (params) => params?.row?.courseId?.courseTitle,
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
      field: 'amount',
      headerName: 'Amount',
      width: 120,
      valueGetter: (params) => params?.row?.amount,
      filterable: true,
    },
    {
      field: 'batchDates',
      headerName: 'Batch Dates',
      width: 150,
      valueGetter: (params) => params?.row?.selectedDates?.join(", "),
      filterable: true,
    },
    {
      field: 'bookingDate',
      headerName: 'Booking Date',
      width: 120,
      valueGetter: (params) => params.row.date,
      valueFormatter: (params) => formatDateToShortMonth(params.value),
      sortComparator: (v1, v2) => new Date(v1) - new Date(v2),
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
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <Button
          onClick={() => handleEdit(params.row._id)}
          variant="text"
          startIcon={<MdOutlineMail />}
          size="small"
        >
          Send Email
        </Button>
      ),
    },
  ];

  function CustomPagination() {
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
            onChange={(event) => setPageSize(parseInt(event.target.value, 10))}
            style={{
              padding: '4px 8px',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
          >
            {[10, 25, 50, 100, 1000, 10000, 50000].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </Box>
      </Box>
    );
  }

  const handleWidthReset = () => setContainerWidth(1250);
  const incrementWidth = () => setContainerWidth(prev => Math.min(prev + 50, 2000));
  const decrementWidth = () => setContainerWidth(prev => Math.max(prev - 50, 1000));

  useEffect(() => {
    async function fetchAllData() {
      setLoading(true);
      let response = await registrationService.getBuyCourseWithFilter({ 
        sortBy, 
        rowsPerPage: pageSize, 
        page: page,
        searchText, 
        selectedCourses, 
        selectedBatches, 
        successOnly 
      });
      if (response.variant === "success") {
        setRows(response.data);
        setTotalCount(response.totalCount);
      }
      setLoading(false);
    }
    fetchAllData();
  }, [pageSize, page, searchText, sortBy, selectedCourses, selectedBatches, successOnly]);

  const handleSelectionChange = (newSelectionModel) => {
    const selectedRows = rows.filter(row => 
      newSelectionModel.includes(row._id)
    );
    setSelectedItems(selectedRows);
  };

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
            All Courses
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
            selectedCourses={selectedCourses} 
            setSelectedCourses={setSelectedCourses} 
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
            Loading Courses...
          </Typography>
        </div>
      ) : rows.length === 0 ? (
        <NoResult label="No Courses Available" />
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
                pageSizeOptions={[ 10, 25, 50, 100, 1000, 10000, 50000 ]}
                checkboxSelection
                disableRowSelectionOnClick
                rowSelectionModel={selectedItems.map(item => item._id)}
                onRowSelectionModelChange={handleSelectionChange}
                loading={loading}
                columnVisibilityModel={columnVisibilityModel}
                onColumnVisibilityModelChange={setColumnVisibilityModel}
                slots={{
                  toolbar: CustomToolbar,
                  pagination: CustomPagination,
                  noRowsOverlay: () => <EmptyContent title="No Courses Available" />,
                  noResultsOverlay: () => <EmptyContent title="No results found" />,
                }}
                slotProps={{
                  toolbar: {
                    showQuickFilter: true,
                    quickFilterProps: { debounceMs: 500 },
                  },
                }}
                getRowClassName={(params) => `status-${params?.row?.status}`}
                autoHeight
                sx={{
                  width: '99.9%',
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: '#f5f5f5',
                  },
                }}
              />
            </Grid>
          </Grid>
        </div>
      ) : (
        // Grid View
        <Grid container spacing={2}>
          {rows && rows.map((course, i) => {
            // Check if this course is currently selected
            const isSelected = selectedItems.some(item => item._id === course._id);
            
            return (
              <Grid item key={i} xs={12} sm={6} md={4} lg={3}>
                <div style={{
                  backgroundColor: isSelected ? '#e8f4ff' : (course.status === 'succeeded' ? '#f8fff9' : '#fffef7'),
                  borderRadius: '12px',
                  padding: '24px',
                  boxShadow: isSelected ? 
                    'rgba(25, 118, 210, 0.25) 0px 4px 12px, rgba(25, 118, 210, 0.5) 0px 0px 0px 2px' : 
                    (course.status === 'succeeded' ? 
                      'rgba(0, 200, 83, 0.1) 0px 4px 12px' : 
                      'rgba(255, 191, 0, 0.1) 0px 4px 12px'),
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  border: isSelected ? 
                    '2px solid #1976d2' : 
                    `1px solid ${course.status === 'succeeded' ? '#e0e7e1' : '#e7e6df'}`
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '0',
                    right: '0',
                    padding: '8px 16px',
                    borderRadius: '0 0 0 12px',
                    backgroundColor: course.status === 'succeeded' ? '#e3ffea' : '#ffffe6',
                    zIndex: 2
                  }}>
                    <Chip 
                      icon={course.status === 'succeeded' ? <FcOk /> : <FcNoIdea />}
                      label={course.status} 
                      size="small"
                      color={course.status === 'succeeded' ? "success" : "warning"}
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
                      pr: 12,
                      pl: isSelected ? 4 : 0,
                      position: 'relative',
                      zIndex: 1
                    }}
                  >
                    {course.courseId?.courseTitle}
                  </Typography>

                  <Grid container spacing={1} sx={{ mb: 2 }}>
                    <Grid item>
                      <Chip 
                        label={`${course.childId?.childName}`} 
                        size="small" 
                        color="primary" 
                      />
                    </Grid>
                    <Grid item>
                      <Chip 
                        label={`£${course.amount}`} 
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
                          {`${course.user?.firstName} ${course.user?.lastName}`}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary">Contact</Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {course.user?.mobile}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          {course.user?.email}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary">Batch Dates</Typography>
                        <Typography variant="body2" fontWeight={500}>
                          📅 {course.selectedDates?.join(", ")}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary">Booking Date</Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {formatDateToShortMonth(course.date)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </div>

                  <Button
                    fullWidth
                    onClick={() => {
                      if (isSelected) {
                        // Remove from selection if already selected
                        setSelectedItems(selectedItems.filter(item => item._id !== course._id));
                      } else {
                        // Add to selection
                        setSelectedItems([...selectedItems, course]);
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
        rowsPerPageOptions={[10, 25, 50, 100, 1000, 10000, 50000]}
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

export default MyCourse;
