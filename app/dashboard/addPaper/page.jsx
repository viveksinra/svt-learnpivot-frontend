"use client";
import "../addCourse/prospectStyle.css";
import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { AppBar, Toolbar, Button, Tooltip, Typography, styled, Fab, Grid, CircularProgress, Chip, Table, TableBody, TableCell, TableHead, TableRow, TablePagination, IconButton, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { FiCheck, FiFileMinus } from "react-icons/fi";
import { FaUserPlus } from "react-icons/fa";
import { BsTable } from "react-icons/bs";
import { FcOk, FcNoIdea, FcOrgUnit, FcTimeline } from "react-icons/fc";
import { MdModeEdit, MdOutlineClose } from "react-icons/md";
import { TabContext, TabList } from '@mui/lab/';
import Loading from "../../Components/Loading/Loading";
import NoResult from "@/app/Components/NoResult/NoResult";
import Search from "../../Components/Search";
import { paperService } from "../../services";

const EntryArea = lazy(() => import("./EntryArea"));

function AddPaper() {
  const [viewTabular, toggleView] = useState(true);
  const [id, setId] = useState("");
  const entryRef = useRef();

  const updateToggle = () => {
    if (!viewTabular) {
      entryRef.current.handleClear();
    }
    toggleView(!viewTabular);
  };

  const handleSaveSuccess = () => {
    toggleView(true);
  };

  return (
    <main>
      {viewTabular ? (
        <Suspense fallback={<Loading/>}>
          <SearchArea handleEdit={(id)=>{toggleView(false); setId(id)}} />
        </Suspense>
      ) : (
        <Suspense fallback={<Loading />}>
          <EntryArea ref={entryRef} id={id} setId={(v)=>setId(v)} onSaveSuccess={handleSaveSuccess} />
        </Suspense>
      )}
      <AppBar position="fixed" sx={{ top: 'auto', bottom: 0, background: "#d6f9f7" }}>
        <Toolbar variant="dense">
          <span style={{ flexGrow: 0.2 }} />
          {!viewTabular && (
            <Button variant="contained" onClick={() => entryRef.current.handleClear()} startIcon={<FiFileMinus />} size='small' color="info">Clear</Button>
          )}
          <span style={{ flexGrow: 0.3 }} />
          <Tooltip arrow title={viewTabular ? "Add Paper Set" : "Show All"}>
            <ToggleFab onClick={() => updateToggle()} color="secondary" size="medium">
              {viewTabular ? <FaUserPlus style={{ fontSize: 24 }} /> : <BsTable style={{ fontSize: 24 }} />}
            </ToggleFab>
          </Tooltip>
          <span style={{ flexGrow: 0.3 }} />
          {!viewTabular && (
            <Button variant="contained" onClick={() => entryRef.current.handleSubmit()} startIcon={<FiCheck />} size='small' color="success">
              {id ? "Update" : "Save"}
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </main>
  );
}

export const ToggleFab = styled(Fab)({ position: 'absolute', zIndex: 1, top: -25, left: 0, right: 0, margin: '0 auto' });

export default AddPaper;

export function SearchArea({ handleEdit }) {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [tabular, setView] = useState(false);
  const sortOptions = [
    { label: "New First", value: "newToOld" },
    { label: "Published", value: "isPublished" },
    { label: "Old First", value: "oldToNew" }
  ];
  const [sortBy, setSort] = useState("newToOld");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    async function fetchAllData() {
      setLoading(true);
      const response = await paperService.getAll(`${sortBy}/${rowsPerPage}/${page}/${searchText}`);
      if (response.variant === "success") {
        setRows(response.data);
        setTotalCount(response.totalCount);
      }
      setLoading(false);
    }
    fetchAllData();
  }, [rowsPerPage, page, searchText, sortBy]);

  return (
    <main style={{ background: "#fff", boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px", borderRadius: 8, padding: 10 }}>
      <Grid container>
        <Grid item xs={0} md={5} />
        <Grid item xs={12} md={2}>
          <Typography color="slateblue" style={{ fontFamily: 'Courgette' }} variant='h6' align='center'>All Paper Sets</Typography>
        </Grid>
        <Grid item xs={12} md={5} sx={{ display: "flex", justifyContent: "end", marginBottom: "20px" }}>
          <Search onChange={e=>setSearchText(e.target.value)} value={searchText} fullWidth endAdornment={<IconButton size="small" sx={{ display: searchText ? "block" : "none" }} onClick={()=>setSearchText("")}> <MdOutlineClose /></IconButton>} />
          <ToggleButtonGroup aria-label="ViewMode" sx={{ display: { xs: "none", md: "block" }, marginLeft: "10px", marginRight: "10px" }}>
            <Tooltip arrow title="Grid View">
              <ToggleButton value="grid" onClick={()=>setView(!tabular)} aria-label="gridView">
                <FcOrgUnit/>
              </ToggleButton>
            </Tooltip>
            <Tooltip arrow title="List View">
              <ToggleButton value="list" onClick={()=>setView(!tabular)} aria-label="listView">
                <FcTimeline />
              </ToggleButton>
            </Tooltip>
          </ToggleButtonGroup>
        </Grid>
        <Grid item xs={12} sx={{ maxWidth: { xs: 350, sm: 480, md: 700 }, marginBottom: "10px" }}>
          <TabContext value={sortBy} variant="scrollable" allowScrollButtonsMobile scrollButtons>
            <TabList onChange={(e, v) => setSort(v)} aria-label="Sort Tabs" variant="scrollable" scrollButtons="auto" allowScrollButtonsMobile>
              {sortOptions.map((t, i) => <Button key={i} value={t.value} onClick={()=>setSort(t.value)} sx={{ mr: 1 }} size="small" variant={sortBy === t.value ? 'contained' : 'outlined'}>{t.label}</Button>)}
            </TabList>
          </TabContext>
        </Grid>
      </Grid>

      {loading ? (
        <div className="center" style={{ flexDirection: "column", padding: "40px" }}>
          <CircularProgress size={40} sx={{ color: '#00c853' }}/>
          <Typography color="primary" sx={{ mt: 2, fontFamily: 'Courgette', fontSize: '1.2rem' }}>Loading Paper Sets...</Typography>
        </div>
      ) : rows.length === 0 ? (
        <NoResult label="No Paper Sets Available"/>
      ) : tabular ? (
        <Table size="small" sx={{ display: { xs: "none", md: "block" } }} aria-label="Paper sets table">
          <TableHead>
            <TableRow>
              <TableCell align="left" padding="none">Status</TableCell>
              <TableCell align="left">Set Title</TableCell>
              <TableCell align="left">Class & Subject</TableCell>
              <TableCell align="left">One Paper Price</TableCell>
              <TableCell align="left">Papers</TableCell>
              <TableCell align="left">Sort Date</TableCell>
              <TableCell align="left">Stripe</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows && rows.map((r) => (
              <TableRow key={r._id} sx={{ backgroundColor: r.isPublished ? 'rgba(227, 255, 234, 0.1)' : 'rgba(255, 255, 230, 0.1)' }}>
                <TableCell align="left" padding="none">
                  <Chip size="small" icon={r.isPublished ? <FcOk /> : <FcNoIdea />} label={r.isPublished ? "Published" : "Draft"} color={r.isPublished ? "success" : "warning"} variant="outlined" />
                </TableCell>
                <TableCell align="left">{r.setTitle}</TableCell>
                <TableCell align="left">
                  <Typography variant="body2">{r.classLevel?.label}</Typography>
                  <Typography variant="caption" color="text.secondary">{r.subject?.label}</Typography>
                </TableCell>
                <TableCell align="left">£{r.onePaperPrice}</TableCell>
                <TableCell align="left">{r.papers?.length || 0}</TableCell>
                <TableCell align="left">{r.sortDate ? new Date(r.sortDate).toLocaleDateString() : 'Not set'}</TableCell>
                <TableCell align="left">{r.stripeAccount?.label || '-'}</TableCell>
                <TableCell align="center">
                  <Button onClick={()=>handleEdit(r._id)} variant="text" startIcon={<MdModeEdit />}>Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Grid container spacing={2}>
          {rows && rows.map((c, i) => (
            <Grid item key={i} xs={12} md={4}>
              <div className="course-card" style={{ backgroundColor: c.isPublished ? '#f8fff9' : '#fffef7', borderRadius: '12px', padding: '24px', boxShadow: c.isPublished ? 'rgba(0, 200, 83, 0.1) 0px 4px 12px' : 'rgba(255, 191, 0, 0.1) 0px 4px 12px', transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden', border: `1px solid ${c.isPublished ? '#e0e7e1' : '#e7e6df'}` }}>
                <div style={{ position: 'absolute', top: '0', right: '0', padding: '8px 16px', borderRadius: '0 0 0 12px', backgroundColor: c.isPublished ? '#e3ffea' : '#ffffe6' }}>
                  <Chip icon={c.isPublished ? <FcOk /> : <FcNoIdea />} label={c.isPublished ? "Published" : "Draft"} size="small" color={c.isPublished ? "success" : "warning"} variant="outlined" />
                </div>
                <Typography color="primary" variant="h6" sx={{ mb: 1, fontWeight: 600, fontSize: '1.2rem', pr: 8 }}>{c.setTitle}</Typography>
                <Grid container spacing={1} sx={{ mb: 2 }}>
                  {c.classLevel?.label && (<Grid item><Chip label={c.classLevel.label} size="small" color="primary" /></Grid>)}
                  {c.subject?.label && (<Grid item><Chip label={c.subject.label} size="small" variant="outlined" /></Grid>)}
                </Grid>
                {c.shortDescription && (
                  <Typography variant="body2" sx={{ mb: 2, p: 1, backgroundColor: '#f0f7ff', borderRadius: '4px', color: 'text.secondary', fontStyle: 'italic' }}>{c.shortDescription}</Typography>
                )}
                <div style={{ background: '#f5f5f5', borderRadius: '8px', padding: '12px', marginBottom: '16px' }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}><Typography variant="caption" color="text.secondary">One Paper Price</Typography><Typography variant="body2" fontWeight={500}>£{c.onePaperPrice}</Typography></Grid>
                    <Grid item xs={6}><Typography variant="caption" color="text.secondary">Papers</Typography><Typography variant="body2" fontWeight={500}>{c.papers?.length || 0}</Typography></Grid>
                    <Grid item xs={6}><Typography variant="caption" color="text.secondary">Sort Date</Typography><Typography variant="body2" fontWeight={500}>{c.sortDate ? new Date(c.sortDate).toLocaleDateString() : 'Not set'}</Typography></Grid>
                    {c.stripeAccount?.label && (<Grid item xs={6}><Typography variant="caption" color="text.secondary">Stripe</Typography><Typography variant="body2" fontWeight={500}>{c.stripeAccount.label}</Typography></Grid>)}
                  </Grid>
                </div>
                <Button fullWidth onClick={()=>handleEdit(c._id)} variant="contained" startIcon={<MdModeEdit />} sx={{ textTransform: 'none', borderRadius: '8px', backgroundColor: c.isPublished ? '#00c853' : '#ffc107', '&:hover': { backgroundColor: c.isPublished ? '#00a844' : '#ffb300' } }}>Edit Paper Set</Button>
              </div>
            </Grid>
          ))}
          <Grid item xs={12}></Grid>
        </Grid>
      )}
      <br/>
      <TablePagination rowsPerPageOptions={[5,10,15,100]} component="div" count={totalCount} sx={{ overflowX: "hidden" }} rowsPerPage={rowsPerPage} page={page} onPageChange={(e,v)=>setPage(v)} onRowsPerPageChange={e=>{ setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }} />
      <br/> <br/> <br/>
    </main>
  );
}





