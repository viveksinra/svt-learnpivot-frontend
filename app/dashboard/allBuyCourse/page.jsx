'use client';
import "./addCourseStyle.css";
import React, { lazy, Suspense, useEffect, useState, useRef } from 'react';
import {
  Typography, Fab, styled, CircularProgress, Tab, Grid, ButtonGroup, AppBar, Toolbar,
  Button, Tooltip, Chip, Table, TableRow, TableCell, TableBody, TableHead,
  IconButton, TablePagination, Checkbox, Badge,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material/';
import { MdModeEdit, MdOutlineMail, MdOutlineClose } from "react-icons/md";
import { FcOk, FcNoIdea, FcOrgUnit, FcTimeline } from "react-icons/fc";
import { BsTable } from "react-icons/bs";
import Loading from "../../Components/Loading/Loading";
import NoResult from "@/app/Components/NoResult/NoResult";
import Search from "../../Components/Search";
import LiveAvatar from "@/app/Components/Common/LiveAvatar";
import { registrationService } from "@/app/services";
import { formatDateToShortMonth } from "@/app/utils/dateFormat";
import MulSelCom from "./MulSelCom";
import { TabContext, TabList } from "@mui/lab";

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

export function SearchArea({ handleEdit, selectedItems, setSelectedItems }) {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [tabular, setView] = useState(true);
  const sortOptions = [{ label: "New First", value: "newToOld" }, { label: "Old First", value: "oldToNew" }];
  const [sortBy, setSort] = useState("newToOld");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [successOnly, setSuccessOnly] = useState(true);

  const handleSelectItem = (row) => {
    setSelectedItems((prevState) => {
      const exists = prevState.find(item => item._id === row._id);
      if (exists) {
        return prevState.filter(item => item._id !== row._id);
      } else {
        return [...prevState, row];
      }
    });
  };

  useEffect(() => {
    async function fetchAllData() {
      setLoading(true);
      let response = await registrationService.getBuyCourseWithFilter({ sortBy, rowsPerPage, page, searchText, selectedCourses, selectedBatches, successOnly });
      if (response.variant === "success") {
        setRows(response.data);
        setTotalCount(response.totalCount);
      }
      setLoading(false);
    }
    fetchAllData();
  }, [rowsPerPage, page, searchText, sortBy, selectedCourses, selectedBatches, successOnly]);

  return (
    <main style={{ background: "#fff", boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px", borderRadius: 8, padding: 10 }}>
      <Grid container>
        <Grid item xs={0} md={5} />
        <Grid item xs={12} md={2}>
          <Typography color="slateblue" style={{ fontFamily: 'Courgette' }} variant='h6' align='center'>All Buy Courses</Typography>
        </Grid>
        <Grid item xs={12} md={5} sx={{ display: "flex", justifyContent: "end", marginBottom: "20px" }}>
          <Search onChange={e => setSearchText(e.target.value)} value={searchText} fullWidth endAdornment={<IconButton size="small" sx={{ display: searchText ? "block" : "none" }} onClick={() => setSearchText("")}><MdOutlineClose /></IconButton>} />
          <ToggleButtonGroup aria-label="ViewMode" sx={{ display: { xs: "none", md: "block" }, marginLeft: "10px", marginRight: "10px" }}>
            <Tooltip arrow title="Grid View">
              <ToggleButton value="grid" onClick={() => setView(!tabular)} aria-label="gridView">
                <FcOrgUnit />
              </ToggleButton>
            </Tooltip>
            <Tooltip arrow title="List View">
              <ToggleButton value="list" onClick={() => setView(!tabular)} aria-label="listView">
                <FcTimeline />
              </ToggleButton>
            </Tooltip>
          </ToggleButtonGroup>
        </Grid>
        <Grid item xs={12} sx={{ maxWidth: { xs: 350, sm: 480, md: 1000 }, marginBottom: "10px" }}>
          <MulSelCom selectedCourses={selectedCourses} setSelectedCourses={setSelectedCourses} selectedBatches={selectedBatches} setSelectedBatches={setSelectedBatches} successOnly={successOnly} setSuccessOnly={setSuccessOnly} />
        </Grid>
        <Grid item xs={12} sx={{ maxWidth: { xs: 350, sm: 480, md: 700 }, marginBottom: "10px" }}>
          <TabContext value={sortBy} variant="scrollable" allowScrollButtonsMobile scrollButtons>
            <TabList onChange={(e, v) => setSort(v)} aria-label="Sort Tabs" variant="scrollable" scrollButtons="auto" allowScrollButtonsMobile>
              {sortOptions.map((t, i) => <Tab key={i} iconPosition="bottom" value={t?.value} label={t?.label} />)}
            </TabList>
          </TabContext>
        </Grid>
      </Grid>
      {loading ? (
        <div className="center" style={{ flexDirection: "column" }}>
          <CircularProgress size={30} />
          <Typography color="slateblue" style={{ fontFamily: 'Courgette' }} variant='h6' align='center'>Loading MyCourse...</Typography>
        </div>
      ) : rows.length === 0 ? (
        <NoResult label="No MyCourse Available" />
      ) : tabular ? (
        <Table size="small" sx={{ display: { xs: "none", md: "block" } }} aria-label="MyCourse data Table">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selectedItems.length > 0 && selectedItems.length < rows.length}
                  checked={rows.length > 0 && selectedItems.length === rows.length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedItems(rows);
                    } else {
                      setSelectedItems([]);
                    }
                  }}
                />
              </TableCell>
              <TableCell align="left">Course Title</TableCell>
              <TableCell align="left">Name</TableCell>
              <TableCell align="left">Email</TableCell>
              <TableCell align="left">Child Name</TableCell>
              <TableCell align="left">Amount</TableCell>
              <TableCell align="left">Date</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r._id} selected={selectedItems.find(item => item._id === r._id)}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={!!selectedItems.find(item => item._id === r._id)}
                    onChange={() => handleSelectItem(r)}
                  />
                </TableCell>
                <TableCell align="left">
                  <Tooltip title={`Batch Dates - ${r.selectedDates.join(", ")} || Batch Times - ${r.selectedDates.join(", ")}`}>
                    <Badge color="primary" variant="dot" invisible={r.status !== "succeeded"}>
                      <LiveAvatar isLive={r.status === "succeeded"} alt={r.courseId.courseTitle} src={r.courseId.url} />
                    </Badge>
                    {r.courseId.courseTitle}
                  </Tooltip>
                </TableCell>
                <TableCell align="left">{r.user?.firstName + " " + r.user?.lastName}</TableCell>
                <TableCell align="left">{r.user.email}</TableCell>
                <TableCell align="left">{r.childId.childName}</TableCell>
                <TableCell align="left">{r.amount}</TableCell>
                <TableCell align="left">{formatDateToShortMonth(r.date)}</TableCell>
                <TableCell align="center"><Chip label={r.status} variant="outlined" size="small" /></TableCell>
                <TableCell align="center">
                  <ButtonGroup variant="text">
                    <Button onClick={() => handleEdit(r._id)} variant="text" startIcon={<MdModeEdit />}>Edit</Button>
                  </ButtonGroup>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Grid container spacing={2}>
          {rows.map((c) => (
            <Grid item key={c._id} xs={12} md={4} className="center">
              <div className="prospectCard" style={c.status === "succeeded" ? { backgroundColor: "#e3ffea" } : { backgroundColor: "#ffffe6" }}>
                <LiveAvatar isLive={c.status === "succeeded"} alt={c.courseId.courseTitle} src={c.courseId.url} sx={{ width: "100px", height: "100px", position: "absolute", boxShadow: "rgba(0, 0, 0, 0.3) 0px 4px 12px", marginTop: "-20px" }} />
                <Checkbox checked={!!selectedItems.find(item => item._id === c._id)} onChange={() => handleSelectItem(c)} style={{ position: "absolute", top: "10px", right: "10px" }} />
                <Typography color="teal" variant="h6" sx={{ paddingLeft: "120px" }}>{c.courseId.courseTitle}</Typography>
                <Grid container sx={{ paddingLeft: "120px" }}>
                  <Grid item xs={10}>
                    <Typography color="grey" variant="subtitle2">{c.selectedDates.join(", ")}</Typography>
                  </Grid>
                  <Grid item xs={2}>{c.status === "succeeded" ? <FcOk sx={{ fontSize: 50 }} /> : <FcNoIdea sx={{ fontSize: 50 }} />}</Grid>
                </Grid>
                <Table size="small" sx={{ minHeight: '180px' }} aria-label="MyCourse data Table">
                  <TableBody>
                    <TableRow>
                      <TableCell align="left" sx={{ width: "100px" }}>Full Name</TableCell>
                      <TableCell align="right" sx={{ width: "120px" }}>{c.user?.firstName + " " + c.user?.lastName}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align="left">Total Amount</TableCell>
                      <TableCell align="right">{c.amount}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align="left">Payment Date</TableCell>
                      <TableCell align="right"><Typography variant="caption">{formatDateToShortMonth(c.date)}</Typography></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align="left">Payment Status</TableCell>
                      <TableCell align="right"><Typography variant="caption">{c.status}</Typography></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <div style={{ display: "flex", justifyContent: "space-evenly", marginTop: "20px" }}>
                  <Button size="small" onClick={() => handleEdit(c._id)} variant="outlined" startIcon={<MdModeEdit />}>
                    Edit
                  </Button>
                </div>
              </div>
            </Grid>
          ))}
          <Grid item xs={12}></Grid>
        </Grid>
      )}
      <TablePagination
        rowsPerPageOptions={[5, 10, 15, 100]}
        component="div"
        count={totalCount}
        sx={{ overflowX: "hidden" }}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(e, v) => setPage(v)}
        onRowsPerPageChange={e => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />
      <br /><br /><br />
    </main>
  );
}

export default MyCourse;
