'use client';
import React,{useState,useEffect,lazy,Suspense} from 'react'
import "./dashboardStyle.css"
import {Button, Chip, Grid,DialogActions,CircularProgress,Typography,Dialog,Table,TableBody,TableRow,TableCell, Tooltip, Divider, Avatar,List,ListItem,ListItemText,ListItemAvatar} from '@mui/material/';
import { dashboardService } from '../services';
import { subDays } from 'date-fns';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import Link from 'next/link';
const ProspectChart = lazy(() => import("../Components/Charts/ProspectChart"));
const CareChart = lazy(() => import("../Components/Charts/CareChart"));
const MedsChart = lazy(() => import("../Components/Charts/MedChart"));
import { useRouter } from 'next/navigation';


function   UserDashCom () {
  const [showDate, setShowData] = useState(false)
  const router = useRouter();
  const [totalCount, setTCount] = useState([{label:"Payment", number:"$0", bgColor:"#f08ff7",link:"/dashboard/payment", icon: "https://res.cloudinary.com/oasismanors/image/upload/v1693075190/paymentSVG_enp0ca.svg"},
                                            {label:"Receipt", number:"$0", bgColor:"#a9fcc0",link:"/dashboard/receipt", icon: "https://res.cloudinary.com/oasismanors/image/upload/v1693075277/receiptSVG_wtg3b7.svg"},
                                            {label:"Prospect", number:"0", bgColor:"#9155FD",link:"/dashboard/prospect", icon: "https://res.cloudinary.com/oasismanors/image/upload/v1693075342/prospectSVG_u807w7.svg" }, 
                                            {label:"Residents", number:"0", bgColor:"#56CA00",link:"/dashboard/residents",icon: "https://res.cloudinary.com/oasismanors/image/upload/v1693075437/ResidentSVG_zefqhd.svg" },
                                            {label:"Employee", number:"0", bgColor:"#b5eeff",link:"/dashboard/employee",icon: "https://res.cloudinary.com/oasismanors/image/upload/v1693075501/EmpSVG_r8xfre.svg"},
                                            {label:"Tasks", number:"0", bgColor:"#FFB400",link:"/dashboard/task", icon: "https://res.cloudinary.com/oasismanors/image/upload/v1693075578/TaskSVG_x8zgef.svg"},
                                          ]) 
  const [date, setDate] = useState([{
      startDate: subDays(new Date(), 365),
      endDate: new Date(),
      key: 'selection'
    }]);
  const [heading, setHeading] = useState({msg: "Welcome",taskCount: 0,subMsg: "Congratulation, You have 0 pending task",firstName: "Guest",lastName: "",designation:"Role"})
  const [task, setTask]= useState([])
  const [receipt,setReceipt]= useState([])
  const [payment,setPayment]= useState([])
  
  useEffect(() => {
     // Getting Heading Data
     async function getHeading(){
      let res = await dashboardService.getData(`api/v1/dashboard/getDashboard/welcomeMsg`);
      if(res.variant === "success"){
        setHeading(res.data)
      }else {
      };    
     }
     getHeading()
   }, [])

  useEffect(() => {
    // Getting all summary Data
    async function getSummary(){
      let res = await dashboardService.saveData(`api/v1/dashboard/getDashboard/summaryData`,"", date[0]);
      if(res.variant === "success"){
        setTCount(res.data)
        }else {};    
      }
     getSummary()
   }, [date])

   useEffect(() => {
    // Getting Last 5 Task Data
    async function getTask(){
      let res = await dashboardService.getData(`api/v1/dashboard/getDashboard/pendingTask`);
      if(res.variant === "success"){
        setTask(res.data)
      }else {};    
     }
     getTask()
   }, [])

   useEffect(() => {
    // Getting Last 4 Receipt / Payment Data
    async function getResPay(){
      let res = await dashboardService.getData(`api/v1/dashboard/getDashboard/someReceiptAndPayment`);
      if(res.variant === "success"){
        setReceipt(res?.data?.someReceipt)
        setPayment(res?.data?.somePayment)
      }else {};    
     }
     getResPay()
   }, [])
 
  return (
    <main>
      <Grid container spacing={2} sx={{marginTop:{xs:"8px",md:"-20px"}}}>
        <Grid item xs={12} md={4} sx={{marginLeft:{xs:"8px",md:"0px"},marginRight:{xs:"8px", md:"0px"}}}>
          <div style={{height:"170px", padding:"20px", boxShadow:"rgba(58, 53, 65, 0.1) 0px 2px 10px 0px", width:"100%",backgroundColor:"#fff",borderRadius:"10px",overflow:"hidden"}} id="topBoxBg">
            <Typography variant="h6" color="teal" className='headingText'>{`Welcome, ${heading?.firstName}!`}</Typography>
            <Typography variant="subtitle2" color="darkviolet">{heading.designation}</Typography>
            <div id="trophy"/>
            <Typography variant="caption" gutterBottom color="grey">{heading?.subMsg}</Typography>
            <div style={{display:"flex",marginTop:"10px"}}>
            <Typography variant="h5" gutterBottom color="darkviolet">{heading?.taskCount} </Typography>
            <Link href="/dashboard/invoice"> <Button size='small' sx={{marginLeft:"20px"}} variant="outlined">View Invoices</Button></Link> 
            </div>
          </div>
        </Grid>
        <Grid item xs={12} md={8} sx={{marginLeft:{xs:"8px",md:"0px"},marginRight:{xs:"8px", md:"0px"}}}>
        <div style={{minHeight:"170px",boxShadow:"rgba(58, 53, 65, 0.1) 0px 2px 10px 0px",backgroundColor:"#fff", padding:"20px", borderRadius:"10px"}}>
          <Grid container>
            <Grid item xs={12} sx={{display:"flex", justifyContent:"space-between"}}>
             <Typography variant="caption" color="teal" className='headingText'>Summary Data</Typography> <br/>
             <Chip label="Filter By Date" size="small" onClick={()=>setShowData(!showDate)} color="primary" variant="outlined" sx={{cursor:"pointer"}}/>
            </Grid>
            <Grid item xs={12}>
            <Typography variant="caption" gutterBottom color="grey">You can Filter <b>Payment</b> and <b>Receipt</b> by Date Range.</Typography> 
            </Grid>
            <Grid item xs={12}>
              <Grid container sx={{display:"flex", justifyContent:"space-evenly", marginTop:{xs:"0px",lg:"20px"}}}>
              {totalCount.map((t,i)=> <Grid key={i} style={{minWidth:"120px"}}>
              <Link href={t.link}>
                <Grid container>
                <Grid item xs={5} className='center'>
                <div className='iconBox' style={{backgroundColor:t.bgColor}}><img src={t?.icon} alt={t?.label} style={{width: "30px", height: "30px"}} /> </div>
                </Grid>
                <Grid item xs={7} sx={{paddingLeft:"5px"}}> 
                <Typography variant="caption" color="teal">{t.label}</Typography>
                <Typography variant="h6" color="darkviolet" sx={{marginTop:"-4px"}}>{t.number}</Typography>
                </Grid>
                </Grid> 
              </Link> 
               </Grid> )}
              </Grid>
            </Grid>
          </Grid>
        </div>
        </Grid>

      <Grid item xs={12} md={4} sx={{marginLeft:{xs:"8px",md:"0px"}, marginRight:{xs:"8px", md:"0px"}, height:{xs:"100%", md:"220px"}}}>
         <div style={{padding:"20px", boxShadow:"rgba(58, 53, 65, 0.1) 0px 2px 10px 0px",backgroundColor:"#fff", borderRadius:"10px", overflow:"hidden"}}>
          <div style={{display:"flex",justifyContent:"space-between"}}>
          <Typography variant="caption" color="teal" className='headingText'>Task (Pending)</Typography>
          <Link href="/dashboard/task"><Typography variant="body2" color="teal">View All</Typography></Link>
          </div>
          {task.length === 0 ? <div className="center"> <img src="https://res.cloudinary.com/oasismanors/image/upload/v1694205596/Zero_Task_hmvwcm.svg" style={{maxHeight:"175px"}} alt="Zero Task"/> <Typography color="teal">No Pending Task!</Typography> </div> : 
        <>
        <Table size="small" aria-label="task Table" sx={{display:{xs:"none", md:"inline-table"}}}>
         <TableBody>
          {task.map((t,i)=> <TableRow
              key={i}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
               <TableCell component="th" scope="row" >
               <Typography variant='caption'>{t?.task}</Typography> 
                </TableCell>
                <TableCell component="th" scope="row" padding="none">
                <Typography variant='caption'>{t?.taskType}</Typography>
                </TableCell>
                <TableCell component="th" scope="row" padding="none" >
                  <Tooltip title="Task Due Date" arrow>
                  <Typography variant='caption' color="blueviolet" sx={{marginLeft:"10px"}}>{t?.taskDueDate}</Typography>
                  </Tooltip>
                </TableCell>
            </TableRow> )}
          </TableBody>
         </Table>
        <List sx={{width:'100%',bgcolor:'background.paper',display:{xs:"block", md:"none"}}} component="nav" aria-labelledby="Nested List Items">
          {task.map((t,i)=><ListItemText sx={{borderBottom:"1px solid lightgrey"}} key={i} primary={<Typography variant="subtitle2">{t.task}</Typography> } secondary={`${t.taskType}, Due Date: ${t.taskDueDate}`}/>)}
        </List>
        </>
        }
          </div>
      </Grid>
      <Grid item xs={12} md={8} sx={{marginLeft:{xs:"8px",md:"0px"},marginRight:{xs:"8px", md:"0px"},height:{xs:"100%", md:"220px"}}}>
         <div style={{padding:"20px", boxShadow:"rgba(58, 53, 65, 0.1) 0px 2px 10px 0px",backgroundColor:"#fff", borderRadius:"10px", overflow:"hidden"}}>
          <Grid container>
            <Grid item xs={12} md={5.5}>
              <div style={{display:"flex",justifyContent:"space-between"}}>
              <Typography variant="caption" color="teal" className='headingText'>Receipt</Typography> <br/> 
              <Link href="/dashboard/receipt"><Typography variant="body2" color="teal">View All</Typography></Link>
              </div>
              {receipt.length === 0 ? <div className='center'><img src="https://res.cloudinary.com/oasismanors/image/upload/v1694206857/Zero_Receipt_mply4b.svg" alt="Zero Receipt" style={{maxHeight:"190px"}} /><Typography color="teal">No Receipt!</Typography></div> : 
              <>
              <Table size="small" aria-label="Receipt Table" sx={{display:{xs:"none", md:"inline-table"}}}>
                <TableBody>
                  {receipt.map((t,i)=> <TableRow
                      key={i}
                      hover
                      onClick={()=>router.push(`/dashboard/receipt/${t.voucher}`)}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 },cursor:"pointer" }}
                    >
                      <TableCell align="left" padding="none">
                       <Avatar alt={t.ledger} src={t.ledgerImage}  sx={{ width: 28, height: 28 }} />
                        </TableCell>
                      <TableCell component="th" scope="row">
                        <Typography variant='caption'>{t.ledger}</Typography>
                        </TableCell>
                        <TableCell component="th" scope="row">
                        <Typography variant='caption'>{t.mode}</Typography>
                        </TableCell>
                        <TableCell component="th" scope="row">
                          <Tooltip title="Amount" arrow>
                          <Typography variant="subtitle1" color="green">$ {t.amount}</Typography>
                          </Tooltip>
                        </TableCell>
                    </TableRow> )}
                  </TableBody>
                </Table> 
              <List sx={{width:'100%',bgcolor:'background.paper',display:{xs:"block", md:"none"}}} component="nav" aria-labelledby="Nested Receipt Items">
                {receipt.map((t,i)=><ListItem key={i} disableGutters onClick={()=>router.push(`/dashboard/receipt/${t.voucher}`)}>
                <Avatar
                  alt={t.ledger}
                  sx={{width: 32, height: 32, marginRight:"10px" }}
                  src={t.ledgerImage}
                />
                  <ListItemText sx={{borderBottom:"1px solid lightgrey"}} primary={<Typography variant="subtitle2">{t.ledger}</Typography> } secondary={`Mode : ${t.mode}`}/>
                  <Typography color="teal">$ {t.amount}</Typography>
                   </ListItem>)
                  }
              </List>
              </>
              }
            </Grid>
            <Grid item xs={12} md={1} className='center'><Divider orientation="vertical" light/></Grid>
            <Grid item xs={12} md={5.5}>
            <div style={{display:"flex",justifyContent:"space-between"}}>
              <Typography variant="caption" color="tomato" className='headingText'>Payment</Typography> <br/> 
              <Link href="/dashboard/payment"><Typography variant="body2" color="teal">View All</Typography></Link>
            </div>
            {payment.length === 0 ? <div className='center'><img src="https://res.cloudinary.com/oasismanors/image/upload/v1694207392/Payment_qfkhmv.svg" alt="Zero Payment" style={{maxHeight:"180px"}} /><Typography color="teal">No Payment</Typography></div> : 
            <>
            <Table size="small" aria-label="Payment Table" sx={{display:{xs:"none", md:"inline-table"}}}>
                <TableBody>
                  {payment.map((t,i)=> <TableRow
                      key={i}
                      hover
                      onClick={()=>router.push(`/dashboard/payment/${t.voucher}`)}
                      sx={{'&:last-child td, &:last-child th': { border: 0 },cursor:"pointer"}}
                    >
                       <TableCell align="left" padding="none">
                       <Avatar alt={t.ledger} src={t.ledgerImage}  sx={{ width: 28, height: 28 }} />
                        </TableCell>
                      <TableCell component="th" scope="row">
                        <Typography variant='caption'>{t.ledger}</Typography>
                        </TableCell>
                        <TableCell component="th" scope="row">
                        <Typography variant='caption'>{t.mode}</Typography>
                        </TableCell>
                        <TableCell component="th" scope="row">
                          <Tooltip title="Task Due Date" arrow>
                          <Typography variant="subtitle1" color="red">$ {t.amount}</Typography>
                          </Tooltip>
                        </TableCell>
                    </TableRow> )}
                  </TableBody>
                </Table> 
                <List sx={{width:'100%',bgcolor:'background.paper', display:{xs:"block", md:"none"}}} component="nav" aria-labelledby="Nested Payment Items">
                {payment.map((t,i)=><ListItem key={i} disableGutters onClick={()=>router.push(`/dashboard/payment/${t.voucher}`)}>
                <Avatar
                  alt={t.ledger}
                  sx={{width: 32, height: 32, marginRight:"10px" }}
                  src={t.ledgerImage}
                />
                  <ListItemText sx={{borderBottom:"1px solid lightgrey"}} primary={<Typography variant="subtitle2">{t.ledger}</Typography> } secondary={`Mode : ${t.mode}`}/>
                  <Typography color="tomato">$ {t.amount}</Typography>
                   </ListItem>)
                  }
              </List>
            </>
            }
            </Grid>
          </Grid>
        </div>
      </Grid>
      </Grid>
     
      <br/> 
        <Dialog onClose={()=>setShowData(false)} maxWidth="md" open={showDate}>
        <Suspense fallback={<div className='center'><CircularProgress /></div>}>
          <DateRangePicker
          onChange={item => {setDate([item.selection])}}
          showSelectionPreview={true}
          moveRangeOnFirstSelection={false}
          months={2}
          ranges={date}
          direction="horizontal"
          />
          <DialogActions>
          <Button variant="text" color="inherit" onClick={()=>setShowData(false)}>Cancel</Button>
          <span style={{flexGrow:0.1}}/>
          <Button variant="contained" color="success" onClick={()=>setShowData(false)}>Filter Now</Button>
          <span style={{flexGrow:0.1}}/>
          </DialogActions>
          </Suspense>
        </Dialog>
    </main>
  )
}



export default UserDashCom;