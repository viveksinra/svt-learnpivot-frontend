'use client'; 
import React, { useState,useEffect,useRef } from 'react';
import {Grid,TextField,Button, Dialog,DialogTitle,DialogContent,DialogActions } from '@mui/material/';

import Autocomplete from '@mui/material/Autocomplete';
import MySnackbar from "../../Components/MySnackbar/MySnackbar";
import { ledgerService } from "../../services";

function AddCommunity({comDialog,setComDialog}) {
    const [loadingCom, setLoadingCom] = useState(false);
    const [filterName, setFilterName]= useState("");
    const [filterType, setFilterType]= useState(null);
  const [allFilterTypeOption]= useState([
    {label:"Email",id:"sd445245"},
    {label:"Phone call",id:"sd4sds45245"},
    {label:"Tour Facility",id:"sdsdsd5245"}
  ])
   
  
    const snackRef = useRef();



    const handleClear =(d)=>{
        setLoadingCom(false);
        setFilterName(d?.filterName ?? "");
        setFilterType(d?.filterType ?? null);  
    }
       
    useEffect(() => {
        if(comDialog._id){
        handleClear(comDialog)
        }
    }, [comDialog._id])

const handleCommunity = async ()=>{
    let comData = {communityName,licenseNumber,buildingNumber,communityMobileNumber,communityAddress,communityZipCode,communityCity,communityState,}
    setLoadingCom(true);
    let response = await ledgerService.saveLedger(`api/v1/publicMaster/filterTag/addFilterTag`, comDialog._id, comData);
    if(response.variant === "success"){
        setLoadingCom(false);
        snackRef.current.handleSnack(response);
        handleClear("")
        setComDialog();
    }else {setLoadingCom(false);console.log(response); snackRef.current.handleSnack(response);}    
}
  return (
    <section>
        <Dialog maxWidth="md" open={comDialog.open}>
        <DialogTitle>Filter Names :-</DialogTitle>
        <DialogContent>
        <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
        <TextField fullWidth size="small" inputProps={{maxLength: "20"}} onChange={e=>setFilterName(e.target.value)} label="Filter Name" value={filterName} variant="standard"  />  
        </Grid>
        <Grid item xs={12} md={6}>
        <Autocomplete
            id="filterType"
            isOptionEqualToValue={(option, value) => option.id === value.id}
            options={allFilterTypeOption}
            onChange={(e, v) => {
              setFilterType(v);
            }}
            renderOption={(props, option) => {
              return (
                <li {...props} key={option.id}>
                  {option.label}
                </li>
              );
            }}
            value={filterType}
            renderInput={(params) => <TextField {...params} variant="standard" fullWidth label="Filter Type"/>}
    />
        </Grid>    

        </Grid>
        </DialogContent>
        <DialogActions>
        <Button onClick={()=> handleClear("")}  color="inherit">Clear</Button><span style={{flexGrow:0.4}}/>
        <Button onClick={()=> {handleClear("");setComDialog()}} color="error">Close</Button><span style={{flexGrow:0.4}}/>
        <Button onClick={()=> handleCommunity()} disabled={loadingCom} variant="contained">{comDialog?._id ? "Update Filter Name" : "Add Filter Name"}</Button>
        </DialogActions>
        </Dialog>
        <MySnackbar ref={snackRef} />
    </section>
  )
}

export default AddCommunity