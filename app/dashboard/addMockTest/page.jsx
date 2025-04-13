'use client';
import "./addMockTestStyle.css";
import React, { lazy, Suspense, useEffect } from 'react'
import {Typography, Fab,styled,Avatar,CircularProgress,Rating,Badge,ToggleButtonGroup,ToggleButton,Tab, Grid,ButtonGroup,AppBar,Toolbar, Button,Tooltip, Chip, Table,TableRow,TableCell,TableBody, TableHead, IconButton,TablePagination} from '@mui/material/';
import { useState,useRef} from 'react';
import {TabContext,TabList } from '@mui/lab/';
import { mockTestService } from "../../services";
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
const AddMockEntryArea = lazy(() => import("./AddMockEntryArea"));

function   MyMockTest () {
  const [viewTabular,toggleView] = useState(true);
  const [id, setId] =useState("");
  const entryRef = useRef();
  return (
    <main> 
      {viewTabular ? <Suspense fallback={<Loading/>}><SearchArea handleEdit={(id)=>{toggleView(false); setId(id)}} />  </Suspense>  : <Suspense fallback={null}><AddMockEntryArea ref={entryRef} id={id} setId={id=>setId(id)} /></Suspense>}
      <AppBar position="fixed" sx={{ top: 'auto', bottom: 0,background:"#d6f9f7"}}>
      <Toolbar variant="dense">
        <span style={{flexGrow:0.2}}/>
        {!viewTabular &&  <Button variant="contained" onClick={() => entryRef.current.handleClear()} startIcon={<FiFileMinus />} size='small' color="info" >
            Clear
          </Button> }
        <span style={{flexGrow:0.3}}/>
        <Tooltip arrow title={viewTabular ? "Add MyMockTest" : "Show All"}>
        <ToggleFab onClick={()=>toggleView(!viewTabular)} color="secondary" size="medium">
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
      let response = await mockTestService.getAll(`${sortBy}/${rowsPerPage}/${page}/${searchText}`);
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
          <Typography color="slateblue" style={{fontFamily: 'Courgette'}} variant='h6' align='center'>Mock Test</Typography>
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
       
      {loading ? <div className="center" style={{flexDirection:"column"}}><CircularProgress size={30}/> <Typography color="slateblue" style={{fontFamily: 'Courgette'}} variant='h6' align='center'>Loading MyMockTest...</Typography>  </div> : rows.length === 0 ? <NoResult label="No MyMockTest Available"/> : tabular ? <Table size="small" sx={{display:{xs:"none", md:"block"}}} aria-label="MyMockTest data Table"> 
      <TableHead>
      <TableRow>
      <TableCell align="left" padding="none">Status</TableCell>
      <TableCell align="left">Test Title</TableCell>
      <TableCell align="left">Type</TableCell>
      <TableCell align="left">Location</TableCell>
      <TableCell align="left">Total Batches</TableCell>
      <TableCell align="left">Price Range</TableCell>
      <TableCell align="left">Total Seats</TableCell>
      <TableCell align="center">Action</TableCell>
      </TableRow>
      </TableHead>
      <TableBody>
      {rows && rows.map((r,i)=>  <TableRow key={r._id} 
        sx={{ backgroundColor: r.isPublished ? 'rgba(227, 255, 234, 0.1)' : 'rgba(255, 255, 230, 0.1)' }}
      > 
        <TableCell align="left" padding="none">
          <Chip
            size="small"
            icon={r.isPublished ? <FcOk /> : <FcNoIdea />}
            label={r.isPublished ? "Published" : "Draft"}
            color={r.isPublished ? "success" : "warning"}
            variant="outlined"
          />
        </TableCell>
        <TableCell align="left">{r.mockTestTitle}</TableCell>
        <TableCell align="left">{r.testType?.label}</TableCell>
        <TableCell align="left">{r.location?.label}</TableCell>
        <TableCell align="left">{r.batch?.length || 0}</TableCell>
        <TableCell align="left">
          {r.batch?.length > 0 ? `£${Math.min(...r.batch.map(b => b.oneBatchprice))} - £${Math.max(...r.batch.map(b => b.oneBatchprice))}` : 'N/A'}
        </TableCell>
        <TableCell align="left">
          {r.batch?.reduce((total, b) => total + b.totalSeat, 0) || 0}
        </TableCell>
        <TableCell align="center">
          <Button onClick={()=>handleEdit(r._id)} variant="text" startIcon={<MdModeEdit />}>Edit</Button>
        </TableCell>
      </TableRow> )}
      </TableBody>
      </Table> : <Grid container spacing={2}>
  {rows && rows.map((c,i)=> 
  <Grid item key={i} xs={12} md={6}>
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

      {/* Title and Type */}
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
        {c.mockTestTitle}
      </Typography>
      
      <Chip 
        label={c.testType?.label} 
        size="small" 
        color="primary" 
        sx={{ mb: 2 }}
      />

      {/* Highlight Text */}
      {c.highlightedText && (
        <Typography 
          variant="body2" 
          sx={{
            mb: 2,
            p: 1,
            backgroundColor: '#f0f7ff',
            borderRadius: '4px',
            color: 'primary.main',
            fontStyle: 'italic'
          }}
        >
          {c.highlightedText}
        </Typography>
      )}

      {/* Location */}
      <Typography 
        variant="body2" 
        color="text.secondary" 
        sx={{ 
          mb: 2,
          display: 'flex',
          alignItems: 'start',
          gap: 1
        }}
      >
        📍 {c.location?.label}
      </Typography>

      {/* Batch Information */}
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
        Available Batches ({c.batch?.length || 0})
      </Typography>
      <div style={{ 
        maxHeight: '150px', 
        overflowY: 'auto',
        background: '#f5f5f5',
        borderRadius: '8px',
        padding: '8px',
        marginBottom: '16px'
      }}>
        <Grid container spacing={1}>
          {c.batch?.slice(0, 4).map((batch, idx) => (
            <Grid item xs={6} key={idx}>
              <div style={{
                padding: '8px',
                backgroundColor: 'white',
                borderRadius: '6px',
                border: '1px solid #eee'
              }}>
                <Typography variant="caption" display="block" color="text.secondary">
                  📅 {batch.date}
                </Typography>
                <Typography variant="caption" display="block" color="text.secondary">
                  ⏰ {batch.startTime} - {batch.endTime}
                </Typography>
                <Typography variant="caption" display="block" color="primary" fontWeight={500}>
                  £{batch.oneBatchprice} • {batch.totalSeat} seats
                </Typography>
              </div>
            </Grid>
          ))}
          {c.batch?.length > 4 && (
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary" align="center" display="block">
                +{c.batch.length - 4} more batches available
              </Typography>
            </Grid>
          )}
        </Grid>
      </div>

      {/* Action Button - Single button only */}
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
        Edit Mock Test
      </Button>
    </div>
  </Grid>
  )}
</Grid> }
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

export default MyMockTest;