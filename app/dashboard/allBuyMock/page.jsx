'use client';
import "./addMockTestStyle.css";
import React, { lazy, Suspense, useEffect, useState, useRef } from 'react';
import {
  Typography, 
  Fab, 
  styled, 
  CircularProgress, 
  AppBar, 
  Toolbar,
  Tooltip, 
  Box,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material/';
import { 
  MdModeEdit, 
  MdOutlineMail, 
  MdOutlineClose
} from "react-icons/md";
import { BsTable } from "react-icons/bs";
import Loading from "../../Components/Loading/Loading";
import NoResult from "@/app/Components/NoResult/NoResult";
import { registrationService } from "@/app/services";
import { formatDateToShortMonth } from "@/app/utils/dateFormat";

// Import components
import DataGridView from './comp/DataGridView';
import CardView from './comp/CardView';
import FilterControls from './comp/FilterControls';
import CustomPagination from './comp/CustomPagination';

const SendEmailCom = lazy(() => import("./SendEmailCom"));

// Styled Components
const ToggleFab = styled(Fab)({
  position: 'absolute',
  zIndex: 1,
  top: -25,
  left: 0,
  right: 0,
  margin: '0 auto',
});

function MyMockTest() {
  const [viewTabular, toggleView] = useState(true);
  const [id, setId] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const entryRef = useRef();

  useEffect(() => { 
    console.log("selectedItems", selectedItems);
  }, [selectedItems]);

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
  const [sortBy, setSort] = useState("newToOld");
  const [searchText, setSearchText] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [selectedMockTests, setSelectedMockTests] = useState([]);
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [successOnly, setSuccessOnly] = useState(true);
  const [containerWidth, setContainerWidth] = useState(1250);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    email: false,
    bookingDate: false,
    status: false,
    address: false,
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const handleWidthReset = () => {
    setContainerWidth(1250);
  };

  const incrementWidth = () => {
    setContainerWidth(prev => Math.min(prev + 50, 2000));
  };

  const decrementWidth = () => {
    setContainerWidth(prev => Math.max(prev - 50, 1000));
  };

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

  // Create pagination component instance for reuse
  const PaginationComponent = () => (
    <CustomPagination
      page={page}
      setPage={setPage}
      pageSize={pageSize}
      setPageSize={setPageSize}
      totalCount={totalCount}
    />
  );

  return (
    <Box
      sx={{
        background: "#fff",
        boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
        borderRadius: 2,
        p: { xs: 1, sm: 2, md: 3 },
        width: "100%",
        maxWidth: tabular ? containerWidth : "100%",
        mx: "auto",
        overflow: "hidden"
      }}
    >
      {/* Filter Controls */}
      <FilterControls
        tabular={tabular}
        setView={setView}
        sortBy={sortBy}
        setSort={setSort}
        selectedMockTests={selectedMockTests}
        setSelectedMockTests={setSelectedMockTests}
        selectedBatches={selectedBatches}
        setSelectedBatches={setSelectedBatches}
        successOnly={successOnly}
        setSuccessOnly={setSuccessOnly}
      />

      {loading ? (
        <Box className="center" sx={{ flexDirection: "column", p: 5 }}>
          <CircularProgress size={40} sx={{ color: '#00c853' }} />
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
        </Box>
      ) : rows.length === 0 ? (
        <NoResult label="No Mock Tests Available" />
      ) : tabular ? (
        <DataGridView
          rows={rows}
          columns={columns}
          loading={loading}
          page={page}
          setPage={setPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
          totalCount={totalCount}
          selectedItems={selectedItems}
          handleSelectionChange={handleSelectionChange}
          containerWidth={containerWidth}
          incrementWidth={incrementWidth}
          decrementWidth={decrementWidth}
          handleWidthReset={handleWidthReset}
          columnVisibilityModel={columnVisibilityModel}
          setColumnVisibilityModel={setColumnVisibilityModel}
          CustomPagination={PaginationComponent}
        />
      ) : (
        <>
          <CardView
            rows={rows}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
          />
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              p: 1,
              background: '#f5f5f5',
              borderRadius: 1
            }}>
              <PaginationComponent />
            </Box>
          </Box>
        </>
      )}
      <Box sx={{ height: 60 }} /> {/* Space for AppBar */}
    </Box>
  );
}

export default MyMockTest;