'use client';
import "./prospectStyle.css";
import React, { lazy, Suspense, useEffect } from 'react'
import {Typography, Fab,styled,Avatar,CircularProgress,Rating,Badge,ToggleButtonGroup,ToggleButton,Tab, Grid,ButtonGroup,AppBar,Toolbar, Button,Tooltip, Chip, Table,TableRow,TableCell,TableBody, TableHead, IconButton,TablePagination, Stack} from '@mui/material/';
import { useState,useRef} from 'react';
import {TabContext,TabList } from '@mui/lab/';
import { myCourseService } from "../../services";
import Link from 'next/link';
import { FiCheck,FiFileMinus } from "react-icons/fi";
import {FcOk,FcNoIdea,FcOrgUnit,FcTimeline,FcExpand} from "react-icons/fc";
import {MdModeEdit,MdSend,MdOutlineClose} from "react-icons/md";
import NoResult from "@/app/Components/NoResult/NoResult";
import Search from "../../Components/Search";
import {FaUserPlus } from "react-icons/fa";
import {BsTable } from "react-icons/bs";
import Loading from "../../Components/Loading/Loading";
import LiveAvatar from "@/app/Components/Common/LiveAvatar";
const EntryArea = lazy(() => import("./EntryArea"));

function MyCourse() {
  const [viewTabular, toggleView] = useState(true);
  const [id, setId] = useState("");
  const entryRef = useRef();
  
  const updateToggle = () => {
    if(!viewTabular) {
      entryRef.current.handleClear();
    }
    toggleView(!viewTabular);
  }

  const handleSaveSuccess = () => {
    toggleView(true); // Toggle back to list view after successful save
  }

  return (
    <main> 
      {viewTabular ? 
        <Suspense fallback={<Loading/>}>
          <SearchArea handleEdit={(id)=>{toggleView(false); setId(id)}} />  
        </Suspense> : 
        <Suspense fallback={null}>
          <EntryArea 
            ref={entryRef} 
            id={id} 
            setId={id=>setId(id)} 
            onSaveSuccess={handleSaveSuccess}
          />
        </Suspense>
      }
      <AppBar position="fixed" sx={{ top: 'auto', bottom: 0,background:"#d6f9f7"}}>
      <Toolbar variant="dense">
        <span style={{flexGrow:0.2}}/>
        {!viewTabular &&  <Button variant="contained" onClick={() => entryRef.current.handleClear()} startIcon={<FiFileMinus />} size='small' color="info" >
            Clear
          </Button> }
        <span style={{flexGrow:0.3}}/>
        <Tooltip arrow title={viewTabular ? "Add MyCourse" : "Show All"}>
        <ToggleFab onClick={()=> updateToggle()} color="secondary" size="medium">
        {viewTabular ?   <FaUserPlus style={{fontSize:24}}/> : <BsTable style={{fontSize:24}}/>}
        </ToggleFab>
        </Tooltip>
          <span style={{flexGrow:0.3}}/>
          {!viewTabular && <Button variant="contained" onClick={() => entryRef.current.handleSubmit()} startIcon={<FiCheck />} size='small' color="success" >
            { id ? "Update" : "Save"}
          </Button>}
      </Toolbar>         
      </AppBar>
       </main>
  )
}

export const ToggleFab = styled(Fab)({
  position: 'absolute',
  zIndex: 1,
  top: -25,
  left: 0,
  right: 0,
  margin: '0 auto',
});

export function SearchArea({handleEdit}) {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [tabular, setView] = useState(false);
  const sortOptions = [{label:"New First",value:"newToOld"},{label:"Published",value:"isPublished"},{label:"Old First",value:"oldToNew"}];
  const [sortBy, setSort]= useState("newToOld");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [totalCount,setTotalCount] = useState(0)

  useEffect(() => {
    async function fetchAllData() {
      setLoading(true)
      let response = await myCourseService.getAll(`${sortBy}/${rowsPerPage}/${page}/${searchText}`);
     console.log(response)
      if(response.variant === "success"){
        setLoading(false)
        setRows(response.data)
        setTotalCount(response.totalCount)
      }else {console.log(response); setLoading(false)}
    }
    fetchAllData()
  }, [rowsPerPage,page,searchText,sortBy])
 return (
    <main style={{background:"#fff",boxShadow:"rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",borderRadius:8,padding:10}}>
        <Grid container>
          <Grid item xs={0} md={5}/>
          <Grid item xs={12} md={2}>
          <Typography color="slateblue" style={{fontFamily: 'Courgette'}} variant='h6' align='center'>All Course</Typography>
          </Grid>
          <Grid item xs={12} md={5} sx={{display:"flex", justifyContent:"end", marginBottom:"20px"}}>
          <Search onChange={e=>setSearchText(e.target.value)} value={searchText} fullWidth endAdornment={<IconButton size="small" sx={{display: searchText ? "block": "none"}} onClick={()=>setSearchText("")}> <MdOutlineClose /></IconButton> } />
          <ToggleButtonGroup aria-label="ViewMode" sx={{display:{xs:"none", md:"block"},marginLeft:"10px",marginRight:"10px"}}>
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
          <Grid item xs={12} sx={{maxWidth: { xs: 350, sm: 480,md:700 },marginBottom:"10px"}}>
          <TabContext value={sortBy} variant="scrollable" allowScrollButtonsMobile scrollButtons>
          <TabList onChange={(e,v)=>setSort(v)} aria-label="Sort Tabs" variant="scrollable" scrollButtons="auto" allowScrollButtonsMobile>
          {sortOptions.map((t,i)=> <Tab key={i} iconPosition="bottom" value={t?.value} label={t?.label} />)}
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
        <NoResult label="No Courses Available"/>
      ) : tabular ? (
        <Table size="small" sx={{display:{xs:"none", md:"block"}}} aria-label="MyCourse data Table"> 
          <TableHead>
            <TableRow>
              <TableCell align="left" padding="none">Status</TableCell>
              <TableCell align="left">Course Title</TableCell>
              <TableCell align="left">Class & Type</TableCell>
              <TableCell align="left">Duration</TableCell>
              <TableCell align="left">Price</TableCell>
              <TableCell align="left">Seats</TableCell>
              <TableCell align="left">Schedule</TableCell>
              <TableCell align="left">Sort Date</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows && rows.map((r,i)=>  <TableRow key={r._id}
              sx={{ backgroundColor: r.isPublished ? 'rgba(227, 255, 234, 0.1)' : 'rgba(255, 255, 230, 0.1)' }}
            > 
              <TableCell align="left" padding="none">
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Chip
                    size="small"
                    icon={r.isPublished ? <FcOk /> : <FcNoIdea />}
                    label={r.isPublished ? "Published" : "Draft"}
                    color={r.isPublished ? "success" : "warning"}
                    variant="outlined"
                  />
                  {r.restrictStartDateChange && (
                    <Tooltip title="Course dates are fixed and cannot be changed">
                      <Chip size="small" label="Fixed Dates" color="info" variant="outlined" />
                    </Tooltip>
                  )}
                  {r.forcefullBuyCourse && (
                    <Tooltip title="Students must enroll for the complete course">
                      <Chip size="small" label="Full Course Only" color="warning" variant="outlined" />
                    </Tooltip>
                  )}
                  {r.onlySelectedParent && (
                    <Tooltip title="Limited to selected parents only">
                      <Chip size="small" label="Selected Parents" color="secondary" variant="outlined" />
                    </Tooltip>
                  )}
                  {r.allowBackDateBuy && (
                    <Tooltip title={`Allows backdated enrollment up to ${r.backDayCount} days`}>
                      <Chip size="small" label={`${r.backDayCount}d Backdate`} color="default" variant="outlined" />
                    </Tooltip>
                  )}
                  {r.stopSkipSet && (
                    <Tooltip title="Class skipping is not allowed">
                      <Chip size="small" label="No Skip" color="error" variant="outlined" />
                    </Tooltip>
                  )}
                </Stack>
              </TableCell>
              <TableCell align="left">{r.courseTitle}</TableCell>
              <TableCell align="left">
                <Typography variant="body2">{r.courseClass?.label}</Typography>
                <Typography variant="caption" color="text.secondary">{r.courseType?.label}</Typography>
              </TableCell>
              <TableCell align="left">{r.duration?.label}</TableCell>
              <TableCell align="left">
                <Typography variant="body2">£{r.oneClassPrice}</Typography>
                {r.discountOnFullClass > 0 && (
                  <Typography variant="caption" color="success.main">-{r.discountOnFullClass}% on full course</Typography>
                )}
              </TableCell>
              <TableCell align="left">
                <Typography variant="body2">
                  {r.restrictOnTotalSeat ? (
                    <>
                      {r.filledSeat || 0}/{r.totalSeat}
                      {r.showRemaining && ` (${r.totalSeat - (r.filledSeat || 0)} left)`}
                    </>
                  ) : 'Unlimited'}
                </Typography>
              </TableCell>
              <TableCell align="left">
                <Typography variant="caption" display="block">{r.startTime} - {r.endTime}</Typography>
              </TableCell>
              <TableCell align="left">
                {r.sortDate ? new Date(r.sortDate).toLocaleDateString() : 'Not set'}
              </TableCell>
              <TableCell align="center">
                <Button onClick={()=>handleEdit(r._id)} variant="text" startIcon={<MdModeEdit />}>Edit</Button>
              </TableCell>
            </TableRow> )}
          </TableBody>
        </Table>
      ) : (
        <Grid container spacing={2}>
          {rows && rows.map((c,i)=> 
            <Grid item key={i} xs={12} md={4}>
              <div className="course-card" style={{
                backgroundColor: c.isPublished ? '#f8fff9' : '#fffef7',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: c.isPublished ? 
                  'rgba(0, 200, 83, 0.1) 0px 4px 12px' : 
                  'rgba(255, 191, 0, 0.1) 0px 4px 12px',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                border: `1px solid ${c.isPublished ? '#e0e7e1' : '#e7e6df'}`
              }}>
                <div style={{
                  position: 'absolute',
                  top: '0',
                  right: '0',
                  padding: '8px 16px',
                  borderRadius: '0 0 0 12px',
                  backgroundColor: c.isPublished ? '#e3ffea' : '#ffffe6'
                }}>
                  <Chip 
                    icon={c.isPublished ? <FcOk /> : <FcNoIdea />}
                    label={c.isPublished ? "Published" : "Draft"} 
                    size="small"
                    color={c.isPublished ? "success" : "warning"}
                    variant="outlined"
                  />
                </div>

                <Typography 
                  color="primary" 
                  variant="h6" 
                  sx={{
                    mb: 1,
                    fontWeight: 600,
                    fontSize: '1.2rem',
                    pr: 8
                  }}
                >
                  {c.courseTitle}
                </Typography>

                <Grid container spacing={1} sx={{ mb: 2 }}>
                  <Grid item>
                    <Chip label={c.courseClass?.label} size="small" color="primary" />
                  </Grid>
                  <Grid item>
                    <Chip label={c.courseType?.label} size="small" variant="outlined" />
                  </Grid>
                </Grid>

                {c.shortDescription && (
                  <Typography 
                    variant="body2" 
                    sx={{
                      mb: 2,
                      p: 1,
                      backgroundColor: '#f0f7ff',
                      borderRadius: '4px',
                      color: 'text.secondary',
                      fontStyle: 'italic'
                    }}
                  >
                    {c.shortDescription}
                  </Typography>
                )}

                <div style={{ 
                  background: '#f5f5f5', 
                  borderRadius: '8px', 
                  padding: '12px',
                  marginBottom: '16px' 
                }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">Duration</Typography>
                      <Typography variant="body2" fontWeight={500}>{c.duration?.label}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">Price</Typography>
                      <Typography variant="body2" fontWeight={500}>£{c.oneClassPrice}</Typography>
                      {c.discountOnFullClass > 0 && (
                        <Typography variant="caption" color="success.main">-{c.discountOnFullClass}% on full course</Typography>
                      )}
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">Sort Date</Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {c.sortDate ? new Date(c.sortDate).toLocaleDateString() : 'Not set'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">Parent Added</Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {c.selectedUsers ? c.selectedUsers.length : 'Not set'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="caption" color="text.secondary">Schedule</Typography>
                      <Typography variant="body2" fontWeight={500}>
                        ⏰ {c.startTime} - {c.endTime}
                      </Typography>
                    </Grid>
                   
        
                  </Grid>
                </div>

                {(c.restrictStartDateChange || c.forcefullBuyCourse || c.onlySelectedParent || c.allowBackDateBuy || c.stopSkipSet) && (
                  <Grid container spacing={1} sx={{ mb: 2 }}>
                    {c.restrictStartDateChange && (
                      <Grid item>
                        <Tooltip title="Course dates are fixed and cannot be changed">
                          <Chip label="Fixed Dates" size="small" color="info" variant="outlined" />
                        </Tooltip>
                      </Grid>
                    )}
                    {c.forcefullBuyCourse && (
                      <Grid item>
                        <Tooltip title="Students must enroll for the complete course">
                          <Chip label="Full Course Only" size="small" color="warning" variant="outlined" />
                        </Tooltip>
                      </Grid>
                    )}
                    {c.onlySelectedParent && (
                      <Grid item>
                        <Tooltip title="Limited to selected parents only">
                          <Chip label="Selected Parents" size="small" color="secondary" variant="outlined" />
                        </Tooltip>
                      </Grid>
                    )}
                    {c.allowBackDateBuy && (
                      <Grid item>
                        <Tooltip title={`Allows backdated enrollment up to ${c.backDayCount} days`}>
                          <Chip label={`${c.backDayCount}d Backdate`} size="small" color="default" variant="outlined" />
                        </Tooltip>
                      </Grid>
                    )}
                    {c.stopSkipSet && (
                      <Grid item>
                        <Tooltip title="Class skipping is not allowed">
                          <Chip label="No Skip" size="small" color="error" variant="outlined" />
                        </Tooltip>
                      </Grid>
                    )}
                  </Grid>
                )}

                <Button
                  fullWidth
                  onClick={() => handleEdit(c._id)}
                  variant="contained"
                  startIcon={<MdModeEdit />}
                  sx={{
                    textTransform: 'none',
                    borderRadius: '8px',
                    backgroundColor: c.isPublished ? '#00c853' : '#ffc107',
                    '&:hover': {
                      backgroundColor: c.isPublished ? '#00a844' : '#ffb300',
                    }
                  }}
                >
                  Edit Course
                </Button>
              </div>
            </Grid>
          )}
          <Grid item xs={12}>   
          </Grid>
        </Grid>
      )}
   <br/>
   <TablePagination
                rowsPerPageOptions={[5,10,15,100]}
                component="div"
                count={totalCount}
                sx={{overflowX:"hidden"}}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(e,v)=>setPage(v)}
                onRowsPerPageChange={e=>{
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0)
                }}
              />
    <br/> <br/> <br/>
    </main>
  )
}

export default MyCourse;