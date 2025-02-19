'use client';
import "./addCourseStyle.css";
import React, { lazy, Suspense, useEffect, useState, useRef } from 'react';
import {
  Typography, Fab, styled, CircularProgress, Tab, Grid, ButtonGroup, AppBar, Toolbar,
  Button, Tooltip, IconButton, Box,
} from '@mui/material/';
import { 
  DataGrid, 
  GridToolbar,
  gridClasses,
} from '@mui/x-data-grid';
import { MdModeEdit, MdOutlineMail, MdOutlineClose, MdRemove, MdAdd, MdRestartAlt } from "react-icons/md";
import { BsTable } from "react-icons/bs";
import Loading from "../../Components/Loading/Loading";
import Search from "../../Components/Search";
import { registrationService } from "@/app/services";
import { formatDateToShortMonth } from "@/app/utils/dateFormat";
import MulSelCom from "./MulSelCom";
import { TabContext, TabList } from "@mui/lab";
import EmptyContent from '@/app/Components/EmptyContent';

const SendEmailCom = lazy(() => import("./SendEmailCom"));

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
                {viewTabular ? <MdOutlineMail style={{ fontSize: 24 }} /> : <BsTable style={{ fontSize: 24 }} />}
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
  // ...other styles from MockTest
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
            {[10, 25, 50, 100].map((size) => (
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

  return (
    <main style={{ 
      background: "#fff", 
      boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px", 
      borderRadius: 8, 
      padding: 20,
      maxWidth: containerWidth,
    }}>
      {/* Width controls */}
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
            <IconButton onClick={decrementWidth} disabled={containerWidth <= 1000} size="small">
              <MdRemove />
            </IconButton>
          </Tooltip>
          <Typography variant="body2" sx={{ mx: 1, minWidth: 80 }}>
            {containerWidth}px
          </Typography>
          <Tooltip title="Increase width">
            <IconButton onClick={incrementWidth} disabled={containerWidth >= 2000} size="small">
              <MdAdd />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reset width">
            <IconButton onClick={handleWidthReset} color="primary" size="small">
              <MdRestartAlt />
            </IconButton>
          </Tooltip>
        </Grid>

        {/* Existing filter components */}
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

        {/* DataGrid */}
        <Grid item xs={12}>
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
            checkboxSelection
            disableRowSelectionOnClick
            rowSelectionModel={selectedItems.map(item => item._id)}
            onRowSelectionModelChange={(newSelection) => {
              const selectedRows = rows.filter(row => newSelection.includes(row._id));
              setSelectedItems(selectedRows);
            }}
            loading={loading}
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={setColumnVisibilityModel}
            components={{
              Toolbar: GridToolbar,
              Pagination: CustomPagination,
              NoRowsOverlay: () => <EmptyContent title="No Courses Available" />,
              NoResultsOverlay: () => <EmptyContent title="No results found" />,
            }}
            componentsProps={{
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
    </main>
  );
}

export default MyCourse;
