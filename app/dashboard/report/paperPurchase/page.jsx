"use client";
import React, { lazy, Suspense, useEffect, useRef, useState } from "react";
import "../../allBuyCourse/addCourseStyle.css";
import { styled } from "@mui/material/styles";
import {
  Typography,
  Fab,
  CircularProgress,
  AppBar,
  Toolbar,
  Tooltip,
  IconButton,
  Box,
  Chip,
  Grid,
  Button,
  ButtonGroup,
  ToggleButtonGroup,
  ToggleButton,
  Tab,
} from "@mui/material";
import { TabContext, TabList } from "@mui/lab";
import { DataGrid, GridToolbar, gridClasses } from "@mui/x-data-grid";
import { MdOutlineMail, MdOutlineClose, MdRemove, MdAdd, MdRestartAlt } from "react-icons/md";
import { FcOrgUnit, FcTimeline, FcOk, FcNoIdea } from "react-icons/fc";
import Loading from "@/app/Components/Loading/Loading";
import NoResult from "@/app/Components/NoResult/NoResult";
import Search from "@/app/Components/Search";
import { paperService } from "../../../services";
import { formatDateToShortMonth } from "@/app/utils/dateFormat";

const SendEmailCom = lazy(() => import("./SendEmailCom"));
const PaperFilters = lazy(() => import("./MulSelCom"));

const ToggleFab = styled(Fab)({
  position: "absolute",
  zIndex: 1,
  top: -25,
  left: 0,
  right: 0,
  margin: "0 auto",
});

function CustomToolbar() {
  return (
    <GridToolbar
      sx={{
        p: 1,
        display: "flex",
        gap: 1,
        flexWrap: "wrap",
        "& .MuiButton-root": {
          color: "primary.main",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
        },
      }}
    />
  );
}

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  "& .status-succeeded": {
    backgroundColor: "#e8f5e9",
    "&:hover": {
      backgroundColor: "#c8e6c9",
    },
  },
  "& .status-pending": {
    backgroundColor: "#fff3e0",
    "&:hover": {
      backgroundColor: "#ffe0b2",
    },
  },
  "& .MuiDataGrid-main": {
    overflow: "auto",
  },
  "& .MuiDataGrid-virtualScroller": {
    overflow: "auto",
  },
  "& ::-webkit-scrollbar": {
    height: "8px",
    width: "8px",
  },
  "& ::-webkit-scrollbar-track": {
    background: "#f1f1f1",
  },
  "& ::-webkit-scrollbar-thumb": {
    background: "#888",
    borderRadius: "4px",
  },
  "& ::-webkit-scrollbar-thumb:hover": {
    background: "#555",
  },
}));

export default function PaperPurchaseReportPage() {
  const [viewTabular, toggleView] = useState(true);
  const [id, setId] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const entryRef = useRef();

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
          <SendEmailCom selectedItems={selectedItems} ref={entryRef} id={id} setId={setId} />
        </Suspense>
      )}
      <AppBar position="fixed" sx={{ top: "auto", bottom: 0, background: "#d6f9f7" }}>
        <Toolbar variant="dense">
          <span style={{ flexGrow: 0.2 }} />
          {!viewTabular && (
            <Button variant="contained" onClick={() => entryRef.current?.handleClear()} startIcon={<MdOutlineClose />} size="small" color="info">
              Clear
            </Button>
          )}
          <span style={{ flexGrow: 0.3 }} />
          {selectedItems.length >= 1 && (
            <Tooltip arrow title={viewTabular ? "Send Email to selected" : "Show List"}>
              <ToggleFab onClick={() => toggleView(!viewTabular)} color="secondary" size="medium">
                {viewTabular ? <MdOutlineMail style={{ fontSize: 24 }} /> : <FcTimeline style={{ fontSize: 24 }} />}
              </ToggleFab>
            </Tooltip>
          )}
          <span style={{ flexGrow: 0.3 }} />
          {!viewTabular && (
            <Button variant="contained" onClick={() => entryRef.current?.handleSubmit()} startIcon={<FcOk />} size="small" color="success">
              {id ? "Update" : "Save"}
            </Button>
          )}
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
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [successOnly, setSuccessOnly] = useState(true);
  const [containerWidth, setContainerWidth] = useState(1250);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    email: false,
    mobile: false,
    bookingDate: false,
    status: false,
    invoiceNumber: false,
  });

  const columns = [
    {
      field: "setTitle",
      headerName: "Set Title",
      width: 200,
      valueGetter: (params) => params?.row?.paperSetId?.setTitle,
      filterable: true,
    },
    {
      field: "parentName",
      headerName: "Parent Name",
      width: 160,
      valueGetter: (params) => `${params?.row?.user?.firstName} ${params?.row?.user?.lastName}`,
      filterable: true,
    },
    {
      field: "email",
      headerName: "Email",
      width: 220,
      valueGetter: (params) => params?.row?.user?.email,
      filterable: true,
    },
    {
      field: "mobile",
      headerName: "Mobile",
      width: 150,
      valueGetter: (params) => params?.row?.user?.mobile,
      filterable: true,
    },
    {
      field: "childName",
      headerName: "Child Name",
      width: 150,
      valueGetter: (params) => params?.row?.childId?.childName,
      filterable: true,
    },
    {
      field: "paperList",
      headerName: "Papers",
      width: 240,
      valueGetter: (params) => (params?.row?.selectedPapers || []).map((p) => p.title).join(", "),
      filterable: true,
    },
    {
      field: "amount",
      headerName: "Amount",
      width: 120,
      valueGetter: (params) => params?.row?.amount,
      filterable: true,
    },
    {
      field: "invoiceNumber",
      headerName: "Invoice",
      width: 120,
      valueGetter: (params) => params?.row?.invoiceNumber || "-",
      filterable: true,
    },
    {
      field: "bookingDate",
      headerName: "Booking Date",
      width: 130,
      valueGetter: (params) => params.row.date,
      valueFormatter: (params) => formatDateToShortMonth(params.value),
      sortComparator: (v1, v2) => new Date(v1) - new Date(v2),
      filterable: true,
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Chip label={params?.row?.status} color={params?.row?.status === "succeeded" ? "success" : "default"} variant="outlined" size="small" />
      ),
      filterable: true,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 140,
      renderCell: (params) => (
        <Button onClick={() => handleEdit(params.row._id)} variant="text" startIcon={<MdOutlineMail />} size="small">
          Send Email
        </Button>
      ),
    },
  ];

  const handleWidthReset = () => setContainerWidth(1250);
  const incrementWidth = () => setContainerWidth((prev) => Math.min(prev + 50, 2000));
  const decrementWidth = () => setContainerWidth((prev) => Math.max(prev - 50, 1000));

  useEffect(() => {
    async function fetchAllData() {
      setLoading(true);
      try {
        const body = {
          ...(successOnly ? { status: "succeeded" } : {}),
          ...(selectedCourses?.length ? { paperSetId: { $in: selectedCourses.map((c) => c.id) } } : {}),
        };
        const response = await paperService.adminListPurchases(body);
        const data = response?.data || [];
        // Sort client-side
        const sorted = [...data].sort((a, b) =>
          sortBy === "newToOld" ? new Date(b.date) - new Date(a.date) : new Date(a.date) - new Date(b.date)
        );
        setRows(sorted);
      } finally {
        setLoading(false);
      }
    }
    fetchAllData();
  }, [sortBy, successOnly, JSON.stringify(selectedCourses)]);

  const filterRows = (rows) => {
    const search = (searchText || "").toLowerCase();
    const selectedSetIds = selectedCourses.map((s) => s.id);
    return rows.filter((row) => {
      const inSelected = selectedSetIds.length === 0 || selectedSetIds.includes(row.paperSetId?._id || row.paperSetId);
      if (!inSelected) return false;
      if (!search) return true;
      const fields = [
        row.paperSetId?.setTitle,
        `${row.user?.firstName} ${row.user?.lastName}`,
        row.user?.email,
        row.user?.mobile,
        row.childId?.childName,
        row.invoiceNumber,
        row.status,
        (row.selectedPapers || []).map((p) => p.title).join(", "),
        row.date && formatDateToShortMonth(row.date),
      ]
        .filter(Boolean)
        .map((v) => String(v).toLowerCase());
      return fields.some((f) => f.includes(search));
    });
  };

  const filteredRows = filterRows(rows);

  const handleSelectionChange = (newSelectionModel) => {
    const selectedRows = filteredRows.filter((row) => newSelectionModel.includes(row._id));
    setSelectedItems(selectedRows);
  };

  return (
    <main
      style={{
        background: "#fff",
        boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
        borderRadius: 8,
        padding: 20,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        margin: "0 20px",
        maxWidth: tabular ? containerWidth : "100%",
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography color="primary" variant="h5" gutterBottom sx={{ fontFamily: "Courgette", fontSize: { xs: "1.5rem", md: "2rem" } }}>
            All Purchased Papers
          </Typography>
        </Grid>
        <Grid item xs={12} md={6} sx={{ display: "flex", justifyContent: "end", marginBottom: "20px", flexWrap: "wrap" }}>
          <Search
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
            fullWidth
            endAdornment={
              <IconButton size="small" sx={{ display: searchText ? "block" : "none" }} onClick={() => setSearchText("")}> 
                <MdOutlineClose />
              </IconButton>
            }
          />
          <ToggleButtonGroup aria-label="ViewMode" sx={{ display: "flex", marginLeft: "10px", marginRight: "10px" }}>
            <Tooltip arrow title="Grid View">
              <ToggleButton value="grid" selected={!tabular} onClick={() => setView(false)} aria-label="gridView">
                <FcOrgUnit />
              </ToggleButton>
            </Tooltip>
            <Tooltip arrow title="Table View">
              <ToggleButton value="list" selected={tabular} onClick={() => setView(true)} aria-label="listView">
                <FcTimeline />
              </ToggleButton>
            </Tooltip>
          </ToggleButtonGroup>
        </Grid>

        <Grid item xs={12}>
          <Suspense fallback={null}>
            <PaperFilters
              selectedCourses={selectedCourses}
              setSelectedCourses={setSelectedCourses}
              selectedBatches={selectedBatches}
              setSelectedBatches={setSelectedBatches}
              successOnly={successOnly}
              setSuccessOnly={setSuccessOnly}
            />
          </Suspense>
        </Grid>
        <Grid item xs={12} sx={{ maxWidth: { xs: 350, sm: 480, md: 700 }, marginBottom: "10px" }}>
          <TabContext value={sortBy}>
            <TabList
              onChange={(e, v) => setSort(v)}
              aria-label="Sort options"
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
            >
              {[
                { label: "New First", value: "newToOld" },
                { label: "Old First", value: "oldToNew" },
              ].map((option) => (
                <Tab key={option.value} label={option.label} value={option.value} />
              ))}
            </TabList>
          </TabContext>
        </Grid>
      </Grid>

      {loading ? (
        <div className="center" style={{ flexDirection: "column", padding: "40px" }}>
          <CircularProgress size={40} sx={{ color: "#00c853" }} />
          <Typography color="primary" sx={{ mt: 2, fontFamily: "Courgette", fontSize: "1.2rem" }}>
            Loading Papers...
          </Typography>
        </div>
      ) : filteredRows.length === 0 ? (
        <NoResult label={searchText ? "No matching results found" : "No Papers Available"} />
      ) : tabular ? (
        <div style={{ width: "99.9%", marginTop: 20, overflowX: "auto" }}>
          <Grid container>
            <Grid item xs={12}>
              <Grid item xs={12} sx={{ display: "flex", alignItems: "center", gap: 1, backgroundColor: "#f5f5f5", padding: "8px", borderRadius: "4px", marginBottom: 2 }}>
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
              <StyledDataGrid
                rows={filteredRows}
                columns={columns}
                getRowId={(row) => row._id}
                pagination
                paginationMode="client"
                rowCount={filteredRows.length}
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
                rowSelectionModel={selectedItems.map((item) => item._id)}
                onRowSelectionModelChange={handleSelectionChange}
                loading={loading}
                columnVisibilityModel={columnVisibilityModel}
                onColumnVisibilityModelChange={setColumnVisibilityModel}
                slots={{
                  toolbar: CustomToolbar,
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
                  width: "99.9%",
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "#f5f5f5",
                  },
                }}
              />
            </Grid>
          </Grid>
                  </div>
      ) : (
        // Grid View
        <Grid container spacing={2}>
          {filteredRows.map((item, i) => {
            const isSelected = selectedItems.some((s) => s._id === item._id);
            return (
              <Grid item key={i} xs={12} sm={6} md={4} lg={3}>
                <div
                  style={{
                    backgroundColor: isSelected ? "#e8f4ff" : item.status === "succeeded" ? "#f8fff9" : "#fffef7",
                    borderRadius: "12px",
                    padding: "24px",
                    boxShadow: isSelected
                      ? "rgba(25, 118, 210, 0.25) 0px 4px 12px, rgba(25, 118, 210, 0.5) 0px 0px 0px 2px"
                      : item.status === "succeeded"
                      ? "rgba(0, 200, 83, 0.1) 0px 4px 12px"
                      : "rgba(255, 191, 0, 0.1) 0px 4px 12px",
                    transition: "all 0.3s ease",
                    position: "relative",
                    overflow: "hidden",
                    border: isSelected ? "2px solid #1976d2" : `1px solid ${item.status === "succeeded" ? "#e0e7e1" : "#e7e6df"}`,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "0",
                      right: "0",
                      padding: "8px 16px",
                      borderRadius: "0 0 0 12px",
                      backgroundColor: item.status === "succeeded" ? "#e3ffea" : "#ffffe6",
                      zIndex: 2,
                    }}
                  >
                    <Chip
                      icon={item.status === "succeeded" ? <FcOk /> : <FcNoIdea />}
                      label={item.status}
                      size="small"
                      color={item.status === "succeeded" ? "success" : "warning"}
                      variant="outlined"
                    />
                  </div>

                  <Typography color="primary" variant="h6" sx={{ mb: 1, fontWeight: 600, fontSize: "1.1rem", pr: 12, pl: isSelected ? 4 : 0, position: "relative", zIndex: 1 }}>
                    {item.paperSetId?.setTitle}
                  </Typography>

                  <Grid container spacing={1} sx={{ mb: 2 }}>
                    <Grid item>
                      <Chip label={`${item.childId?.childName}`} size="small" color="primary" />
                    </Grid>
                    <Grid item>
                      <Chip label={`£${item.amount}`} size="small" variant="outlined" />
                    </Grid>
                    {item.invoiceNumber && (
                      <Grid item>
                        <Chip label={`Inv: ${item.invoiceNumber}`} size="small" variant="outlined" />
                      </Grid>
                    )}
                  </Grid>

                  <div style={{ background: "#f5f5f5", borderRadius: "8px", padding: "12px", marginBottom: "16px" }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary">
                          Parent
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {`${item.user?.firstName} ${item.user?.lastName}`}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary">
                          Contact
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>{item.user?.mobile}</Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          {item.user?.email}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary">
                          Papers
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>📝 {(item.selectedPapers || []).map((p) => p.title).join(", ")}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary">
                          Booking Date
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>{formatDateToShortMonth(item.date)}</Typography>
                      </Grid>
                    </Grid>
                  </div>

                  <Button
                    fullWidth
                    onClick={() => {
                      if (isSelected) {
                        setSelectedItems(selectedItems.filter((s) => s._id !== item._id));
                      } else {
                        setSelectedItems([...selectedItems, item]);
                      }
                    }}
                    variant={isSelected ? "contained" : "outlined"}
                    startIcon={<MdOutlineMail />}
                    color={isSelected ? "error" : "secondary"}
                    sx={{ textTransform: "none", borderRadius: "8px", mb: 1 }}
                  >
                    {isSelected ? "Remove Selection" : "Select for Email"}
                  </Button>

                  {isSelected && (
                    <div
                      style={{
                        position: "absolute",
                        top: "12px",
                        left: "12px",
                        backgroundColor: "#1976d2",
                        borderRadius: "50%",
                        width: "26px",
                        height: "26px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: "bold",
                        zIndex: 3,
                        border: "2px solid white",
                      }}
                    >
                      ✓
      </div>
                  )}
    </div>
              </Grid>
            );
          })}
        </Grid>
      )}
      <br /> <br /> <br />
    </main>
  );
}





