'use client';
import "./buildingStyle.css";
import React, { useState,useEffect,useRef,lazy, Suspense} from 'react'
import {Grid,Typography,IconButton,TextField,Button,Breadcrumbs,ButtonGroup, Input, List,ListSubheader,ListItemButton,ListItemText, CircularProgress, Dialog,DialogTitle,DialogContent,DialogActions,InputAdornment } from '@mui/material/';
import { FcCheckmark,FcHome,FcFullTrash,FcNext, FcTemplate } from "react-icons/fc";
import {MdEditNote} from "react-icons/md";
import MySnackbar from "../../Components/MySnackbar/MySnackbar";
import { prospectService } from "../../services";
import clsx from 'clsx';

const AddCommunity = lazy(() => import("./AddCommunity"));

function BuildingLayout() {
    const [comDialog, setComDialog]= useState({open:false,_id:""});
    const [community, setCommunity] = useState([]);
    const [floor, setFloor] = useState([]);
    const [seat, setSeat] = useState([]);
    const [actCommunity, setActCom]= useState({});
    const [actFloor, setActFloor]= useState({});
 
    const [loadingFloor, setLoadingFloor] = useState(false)

    const snackRef = useRef();

    const getCommunity = async () => {
      let res = await prospectService.getScheduleLeave("api/v1/main/community/getCommunity/getAll");
      if(res.variant ==="success"){
        setCommunity(res.data)

      }
    }
    useEffect(() => {
      getCommunity()
    },[comDialog])

    const getFloor = async ()=>{
      setLoadingFloor(true)
      let res = await prospectService.moveToResident("api/v1/main/seat/getSeat/get/floor", "",{communityId:actCommunity?._id});
      if(res.variant ==="success"){
        setLoadingFloor(false)
        setFloor(res.data)
   
      }else {
        setLoadingFloor(false)
        if(res.data){
        setFloor(res.data)
        }
      }     
      }
    useEffect(() => {
        if(actCommunity){
          getFloor()
        }
    }, [actCommunity])


    const handleCommunity = (i)=>{  
      let newArr =  community.map((obj, j)=> {
        if(i === j){
          setActCom(obj);
          setActFloor({});
  
          return { ...obj, active:true}
        } else {
          return {...obj,active:false}
        }
      })
      setCommunity(newArr);
    }

    const handleFloor = (i, action)=>{  
      let newArr =  floor.map((obj, j)=> {
        if(i === j){
          setActFloor(obj)
          if(action === "edit"){
            obj.edit = !obj.edit;
          }
          return { ...obj, active:true}
        } else {
          return {...obj,active:false,edit:false}
        }
      })
      setFloor(newArr);
    }
    

    
    const handleObjChange=(e,i,p)=>{
      if(p === "houseNo"){
        let newArr = [...community]; // copying the old building array
        newArr[i].houseNo = e
        setCommunity(newArr)
      } else if(p === "floor"){
        let newArr = [...floor]; // copying the old floor array
        newArr[i].label = e
        setFloor(newArr)
      } 
      }
      const handleAdd = async (place,i,b)=>{
        if(place ==="floor"){
          let Arr1 = [...floor]
          if(Arr1.length === 0 || Arr1[Arr1.length-1].label){
            Arr1.map(a=> {a.active = false; a.edit = false} )
            let newArr=[...Arr1,{label:"",_id:"", active:true, edit:true}]
            setFloor(newArr);
          }else snackRef.current.handleSnack({message:"Provide name to the current Floor, First.", variant:"warning"});
        } 
    }

    const handleSave = async (name, i, b)=>{
     if(name ==="floor"){
        if(b.label){
          try {
            let acti = floor.filter(f=>f.active)
            let res = await prospectService.moveToResident(`api/v1/main/seat/addSeat/save/floor`, b._id, {communityId:actCommunity._id, floor:acti[0]});
            if(res.variant==="success"){
              snackRef.current.handleSnack(res);
              getFloor();
              setActFloor({})
         
            }else{
              snackRef.current.handleSnack(res);
            }
          } catch (error) {
            console.log(error);
          }
        }else {
          let Arr1 = [...floor];
          Arr1.pop();
          setFloor(Arr1);
          snackRef.current.handleSnack({message:"You didn't Provide name to the Floor, Hence Floor Removed.", variant:"info"})
        }
      }
    }
    const handleDelete = async (name, i, b)=>{
      let Arr1 = [...seat]
        if(name === "community"){
          Arr1 = [...community]
          if(b?._id){
            if(Arr1.length >0){
              let y = confirm(`Are you sure to Permanently Delete : ${b.communityName} ?`)
              if(y){
                try {
                  let res = await prospectService.deleteLeave(`api/v1/publicMaster/filterTag/addFilterTag/deleteOne/${b._id}`);
                  if(res.variant ==="success"){
                    snackRef.current.handleSnack(res);
                    getcommunity()
                  }else{
                    snackRef.current.handleSnack(res);
                  }
                } catch (error) {
                  console.log(error)
                  snackRef.current.handleSnack({message:"Failed to fetch Data. " + error.res.data.message, variant:"error"});
                }
              } 
            }else {
              alert("Not Allowed to delete the last One. You may Rename it.")
            }
          }

        } else if(name === "floor"){
          Arr1 = [...floor]
        }
        if(b.label){
          if (Arr1.length > 0) {
            let y = confirm(`Are you sure to Permanently Delete : ${b.label} ?`)
            if(y){
              try {
                let res = await prospectService.deleteLeave(`api/v1/main/seat/addSeat/deleteOne/${b._id}`);
                if(res.variant ==="success"){
                  snackRef.current.handleSnack(res);
                  if(name === "floor"){
                    getFloor();
                    setActFloor({});
               
                  }
           
                }else{
                  snackRef.current.handleSnack(res);
                }
              } catch (error) {
                console.log(error)
                snackRef.current.handleSnack({message:"Failed to fetch Data. " + error.res.data.message, variant:"error"});
              }
            }
            } else {
                  alert("Not Allowed to delete the last One. You may Rename it.")
            }
        }else {
          Arr1.pop();
          if(name === "floor"){
            setFloor(Arr1);
            getFloor()
            snackRef.current.handleSnack({message:"Removed Successfully.", variant:"info"})
          }
        }     
    }

    return (
    <main style={{background:"#fff",boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px", borderRadius:8,padding:10}}>
    <Grid container spacing={2}>
    <Grid item xs={12} className='center'>
    <Typography color="secondary" style={{fontFamily: 'Courgette'}} variant='h6' align='center'>Create Filter Tags</Typography>
    </Grid>
    <Grid item xs={12}>
    <Breadcrumbs separator={<FcNext fontSize="small" />} aria-label="breadcrumb">
    <Typography variant="caption" color="teal" className='headingText'>Filter Names</Typography>
    <Button variant="outlined" onClick={()=>setComDialog({open:true,_id:""})} size="small" startIcon={<FcHome />}>
            Add FILTER NAME
          </Button>
    </Breadcrumbs>
    </Grid>
     
    <Grid item xs={12} sx={{marginBottom:"20px"}} className="center">
      <Grid container spacing={2}>
      {community && community.map((b,i)=><Grid item xs={12} md={3} lg={2} key={i} className="center">
        <div className={clsx("buildingBox", "center", b?.active && "activeCard")} onClick={()=>handleCommunity(i)}>
        <IconButton className="deleteBtn" size="small" onClick={()=>handleDelete("community",i,b)}> <FcFullTrash/> </IconButton>
        <div> <Typography align="center">{b.communityName}</Typography><Typography align="center">{b.buildingNumber}</Typography> </div>
        <IconButton className="editBtn" onClick={()=>setComDialog({open:true, ...b})}><MdEditNote/></IconButton>
        </div>
        </Grid>)}
      </Grid>
    </Grid>
    <Grid item xs={12} >
    <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
        {actCommunity?.communityName && <section> 
          <Breadcrumbs separator={<FcNext fontSize="small" />} aria-label="breadcrumb">
          <Typography variant="caption" color="teal" className='headingText'>{`Floors in ${actCommunity?.communityName ? actCommunity?.communityName : ""}`}</Typography>
          <Button variant="text" onClick={()=> handleAdd("floor")} size="small" startIcon={<FcTemplate />}>
              Add Floor
            </Button>
          </Breadcrumbs>
              <List sx={{ width: '100%',bgcolor: 'background.paper' }} component="nav" aria-labelledby="Select your Floor" subheader={<ListSubheader component="div" id="nested-list-subheader">
              Select your Floor
            </ListSubheader>
          }
        > 
        {loadingFloor ? <div className="center"> <CircularProgress size={25}/> </div> : floor && floor.map((f,i)=> 
          f.edit ? <ListItemButton key={i} selected={f.active}> <Input value={f.label} placeholder="Type Floor Name" onChange={e=>handleObjChange(e.target.value,i,"floor")} inputProps={{maxLength: "20"}}  fullWidth /> <IconButton onClick={()=>handleSave("floor", i,f )}> <FcCheckmark/> </IconButton> </ListItemButton> :  <ListItemButton key={i} onClick={()=>handleFloor(i)} selected={f.active}> <ListItemText primary={f.label} />
          <ButtonGroup variant="outlined" aria-label="outlined button group">
          <IconButton size="small" onClick={()=>handleFloor(i,"edit")} > <MdEditNote /></IconButton>
          <IconButton size="small" onClick={()=>handleDelete("floor", i, f)}> <FcFullTrash /></IconButton>
          </ButtonGroup> </ListItemButton>
          )}
        </List>
        </section>}
        </Grid> 

     

      </Grid>
     </Grid>   
    </Grid>
    <Suspense fallback={<CircularProgress/>}><AddCommunity comDialog={comDialog} setComDialog={()=>setComDialog({open:false,_id:""})} />  </Suspense> 
    <MySnackbar ref={snackRef} />
    </main>
  )
}

export default BuildingLayout