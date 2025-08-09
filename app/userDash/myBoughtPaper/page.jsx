"use client";
import React, { useEffect, useMemo, useState } from "react";
import { paperService } from "@/app/services";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  CircularProgress,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { MdRemove, MdAdd, MdRestartAlt, MdPerson, MdDateRange, MdAttachMoney, MdDescription, MdCheckCircle, MdPending } from "react-icons/md";
import { FcOrgUnit, FcTimeline, FcOk, FcDocument, FcCalendar, FcMoneyTransfer } from "react-icons/fc";
import ChildSelectorDropDown from "@/app/Components/Common/ChildSelectorDropDown";
import Search from "@/app/Components/Search";
import { formatDateToShortMonth } from "@/app/utils/dateFormat";

export default function MyBoughtPaperPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedChild, setSelectedChild] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [tabular, setView] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [containerWidth, setContainerWidth] = useState(1250);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const res = await paperService.getMine();
        if (mounted) setItems((res?.data || []).sort((a, b) => new Date(b.date) - new Date(a.date)));
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const term = searchText.trim().toLowerCase();
    return (items || [])
      .filter((it) => selectedChild === "all" || it.childId?._id === selectedChild)
      .filter((it) => {
        if (!term) return true;
        const fields = [
          it.paperSetId?.setTitle,
          it.childId?.childName,
          it.invoiceNumber,
          it.status,
          ...(it.selectedPapers || []).map((p) => p.title),
        ]
          .filter(Boolean)
          .map((v) => String(v).toLowerCase());
        return fields.some((f) => f.includes(term));
      });
  }, [items, selectedChild, searchText]);

  const handleWidthReset = () => setContainerWidth(1250);
  const incrementWidth = () => setContainerWidth((prev) => Math.min(prev + 50, 2000));
  const decrementWidth = () => setContainerWidth((prev) => Math.max(prev - 50, 1000));

  const columns = [
    {
      field: "setTitle",
      headerName: "Set Title",
      width: 220,
      valueGetter: (params) => params?.row?.paperSetId?.setTitle,
      filterable: true,
    },
    {
      field: "childName",
      headerName: "Child",
      width: 160,
      valueGetter: (params) => params?.row?.childId?.childName,
      filterable: true,
    },
    {
      field: "papers",
      headerName: "Papers",
      width: 240,
      valueGetter: (params) => (params?.row?.selectedPapers || []).map((p) => p.title).join(", "),
      filterable: true,
    },
    {
      field: "amount",
      headerName: "Amount",
      width: 120,
      valueGetter: (params) => `£${Number(params?.row?.amount || 0).toFixed(2)}`,
      filterable: true,
    },
    {
      field: "invoice",
      headerName: "Invoice",
      width: 140,
      valueGetter: (params) => params?.row?.invoiceNumber || "-",
      filterable: true,
    },
    {
      field: "bookingDate",
      headerName: "Purchased",
      width: 140,
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
        <Chip label={params?.row?.status} color={params?.row?.status === "succeeded" ? "success" : "default"} size="small" variant="outlined" />
      ),
      filterable: true,
    },
  ];

  return (
    <Box
      sx={{
        background: "#fff",
        boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
        borderRadius: 2,
        p: { xs: 1, md: 2 },
        m: { xs: 1, md: 2 },
        maxWidth: tabular ? containerWidth : "100%",
        minHeight: "100vh",
      }}
    >
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={6}>
          <Typography color="primary" variant="h5" sx={{ fontFamily: "Courgette" }}>
            My Bought Papers
          </Typography>
        </Grid>
        <Grid item xs={12} md={6} sx={{ display: "flex", justifyContent: "end", gap: 2, flexWrap: "wrap" }}>
          <ChildSelectorDropDown selectedChild={selectedChild} setSelectedChild={setSelectedChild} />
          <Search
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
            fullWidth
          />
          <ToggleButtonGroup aria-label="ViewMode" sx={{ ml: 1 }}>
            <ToggleButton value="grid" selected={!tabular} onClick={() => setView(false)} aria-label="gridView">
              <FcOrgUnit />
            </ToggleButton>
            <ToggleButton value="list" selected={tabular} onClick={() => setView(true)} aria-label="listView">
              <FcTimeline />
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
      </Grid>

      {loading ? (
        <Stack alignItems="center" sx={{ py: 5 }}>
          <CircularProgress />
          <Typography variant="body2" sx={{ mt: 2 }}>
            Loading your purchases...
          </Typography>
        </Stack>
      ) : filtered.length === 0 ? (
        <Card sx={{ p: 3, mt: 2 }}>
          <Typography variant="body1">No purchases found.</Typography>
        </Card>
      ) : tabular ? (
        <Box sx={{ width: "100%", mt: 2, overflowX: "auto" }}>
          <Box sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            backgroundColor: "#f5f5f5",
            p: 1,
            borderRadius: 1,
            mb: 2,
          }}>
            <IconButton onClick={decrementWidth} disabled={containerWidth <= 1000} size="small">
              <MdRemove />
            </IconButton>
            <Typography variant="body2" sx={{ mx: 1, minWidth: 80 }}>
              {containerWidth}px
            </Typography>
            <IconButton onClick={incrementWidth} disabled={containerWidth >= 2000} size="small">
              <MdAdd />
            </IconButton>
            <IconButton onClick={handleWidthReset} color="primary" size="small">
              <MdRestartAlt />
            </IconButton>
          </Box>

          <DataGrid
            rows={filtered}
            columns={columns}
            getRowId={(row) => row._id}
            pagination
            paginationMode="client"
            rowCount={filtered.length}
            page={page}
            onPageChange={(newPage) => setPage(newPage)}
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => {
              setPageSize(newPageSize);
              setPage(0);
            }}
            pageSizeOptions={[10, 25, 50, 100, 1000]}
            disableRowSelectionOnClick
            autoHeight
            sx={{
              width: "99.9%",
              "& .MuiDataGrid-columnHeaders": { backgroundColor: "#f5f5f5" },
            }}
          />
        </Box>
      ) : (
        // Grid View
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {filtered.map((bp) => (
            <Grid item key={bp._id} xs={12} sm={6} md={4} lg={3}>
              <Card 
                sx={{ 
                  borderRadius: 3,
                  height: '100%',
                  position: 'relative',
                  background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                  border: '1px solid',
                  borderColor: bp.status === "succeeded" ? 'success.light' : 'grey.200',
                  boxShadow: bp.status === "succeeded" 
                    ? '0 4px 20px rgba(76, 175, 80, 0.1)' 
                    : '0 2px 12px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: bp.status === "succeeded" 
                      ? '0 8px 30px rgba(76, 175, 80, 0.15)' 
                      : '0 8px 25px rgba(0, 0, 0, 0.12)',
                  }
                }}
              >
                {/* Status indicator at top */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    backgroundColor: bp.status === "succeeded" ? 'success.main' : 'warning.main',
                    color: 'white',
                    px: 2,
                    py: 0.5,
                    borderBottomLeftRadius: 12,
                    borderTopRightRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                >
                  {bp.status === "succeeded" ? <MdCheckCircle size={14} /> : <MdPending size={14} />}
                  <Typography variant="caption" fontWeight={600}>
                    {bp.status === "succeeded" ? "Completed" : "Pending"}
                  </Typography>
                </Box>

                <CardContent sx={{ p: 2.5, pb: 2 }}>
                  <Stack spacing={2}>
                    {/* Title Section */}
                    <Box sx={{ pt: 1 }}>
                      <Stack direction="row" alignItems="flex-start" spacing={1}>
                        <FcDocument size={20} style={{ marginTop: 2, flexShrink: 0 }} />
                        <Typography 
                          variant="h6" 
                          fontWeight={700} 
                          color="primary"
                          sx={{ 
                            fontSize: '1.1rem',
                            lineHeight: 1.3,
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 2,
                            overflow: 'hidden'
                          }}
                        >
                          {bp.paperSetId?.setTitle}
                        </Typography>
                      </Stack>
                    </Box>

                    {/* Child Info */}
                    <Box sx={{ 
                      backgroundColor: 'rgba(25, 118, 210, 0.05)', 
                      borderRadius: 2, 
                      p: 1.5,
                      border: '1px solid rgba(25, 118, 210, 0.1)'
                    }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <MdPerson color="#1976d2" size={18} />
                        <Typography variant="body2" color="primary" fontWeight={600}>
                          {bp.childId?.childName}
                        </Typography>
                      </Stack>
                    </Box>

                    {/* Date and Invoice */}
                    <Stack spacing={1}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <FcCalendar size={16} />
                        <Typography variant="body2" color="text.secondary">
                          {formatDateToShortMonth(bp.date)}
                        </Typography>
                      </Stack>
                      {bp.invoiceNumber && (
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <MdDescription color="#666" size={16} />
                          <Typography variant="body2" color="text.secondary">
                            Invoice: {bp.invoiceNumber}
                          </Typography>
                        </Stack>
                      )}
                    </Stack>

                    {/* Papers List */}
                    <Box>
                      <Typography variant="body2" fontWeight={600} color="text.primary" sx={{ mb: 1 }}>
                        Papers Included:
                      </Typography>
                      <Box sx={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.02)', 
                        borderRadius: 2, 
                        p: 1.5,
                        border: '1px solid rgba(0, 0, 0, 0.05)'
                      }}>
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.4 }}>
                          {(bp.selectedPapers || []).map((p) => p.title).join(", ") || "No papers specified"}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Extras */}
                    {(bp.selectedPapers || []).some(sp => sp.extras?.checking || sp.extras?.oneOnOne) && (
                      <Box>
                        <Typography variant="body2" fontWeight={600} color="text.primary" sx={{ mb: 1 }}>
                          Additional Services:
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {(bp.selectedPapers || []).map((sp, idx) => {
                            const extras = [];
                            if (sp.extras?.checking) extras.push(`Checking +£${sp.extras?.checkingPrice || 0}`);
                            if (sp.extras?.oneOnOne) extras.push(`1:1 +£${sp.extras?.oneOnOnePrice || 0}`);
                            return extras.length ? (
                              <Chip 
                                key={idx} 
                                label={extras.join(" | ")} 
                                size="small" 
                                variant="outlined"
                                color="info"
                                sx={{ 
                                  backgroundColor: 'rgba(2, 136, 209, 0.08)',
                                  borderColor: 'info.light'
                                }}
                              />
                            ) : null;
                          })}
                        </Stack>
                      </Box>
                    )}

                    {/* Amount */}
                    <Box sx={{ 
                      backgroundColor: 'rgba(76, 175, 80, 0.08)', 
                      borderRadius: 2, 
                      p: 1.5,
                      border: '1px solid rgba(76, 175, 80, 0.2)',
                      mt: 'auto'
                    }}>
                      <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
                        <FcMoneyTransfer size={20} />
                        <Typography variant="h6" fontWeight={700} color="success.dark">
                          £{Number(bp.amount || 0).toFixed(2)}
                        </Typography>
                      </Stack>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}


