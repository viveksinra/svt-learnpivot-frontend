"use client";
import { useEffect, useState, useRef } from "react";
import "./enquiryStyle.css";
import {Container, Grid, Typography,TextField,RadioGroup,FormControlLabel,Radio,Autocomplete ,Fab,MenuItem,InputAdornment,CircularProgress,Alert, Divider } from '@mui/material/';
import { allStates } from "../StaticData";
import { FcFeedback,FcApproval } from "react-icons/fc";
import Link from 'next/link';
import {authService} from "../../services/index";
import axios from "axios";
import { sendGAEvent } from '@next/third-parties/google'

const Enquiry = () => {
  const [enquiryFor, setEnquiryFor]=useState("self");
  const [firstName,setFName] = useState("");
  const [lastName, setLName] = useState("");
  const [email, setEmail]=useState("");
  const [mobile, setMobile]=useState("");
  const [address, setAddress]=useState("");

  const [marketing, setMarketing]=useState("");
  const [message,setMsg]=useState("");
  const [submitted,setSubmitted] = useState(false)

  
  const handleEnquiry= async (e)=>{
    e.preventDefault();
    let user = {enquiryFor,firstName,lastName,email,mobile,address,marketing,message};
    try {
      let res = await authService.post(`api/v1/public/enquiry`,user);
      if(res.variant ==="success"){
        setSubmitted(true);
        setEnquiryFor("self");

        setFName("");
        setLName("");
        setEmail("");
        setMobile("");
        setAddress("");
       
        setMarketing("");
        setMsg("");
      }else alert(res.message)  
    } catch (error) {
      console.log(error);
      alert("Something went wrong. Please try again.")
    }
  }

  const allMarketing = ["Web Search / Google", "Friend or colleague Recommendation", "Social Media","Direct Mailer","Family Member", "Email","Blog or Publication"];
  return (
    <section className="enquryBg" id="enquiry">
        <Container maxWidth="xl">
            <Grid container spacing={2}>
                <Grid item xs={12} lg={6}>
                  <Grid container spacing={2} sx={{marginTop:{md:"50px"},width:"100%"}}>
                    <Grid item xs={12} sx={{display:"flex",alignItems:"center",flexDirection:"column"}}>
                    <Typography color="#082952" gutterBottom sx={{fontSize:{xs:"18px",md:"30px"},  paddingLeft:"10px", lineHeight:"1.2", fontWeight:300, fontFamily: "Adequate,Helvetica,\"sans-serif\""}}>Request More Information</Typography> 
                    <Typography sx={{fontSize:{xs:"14px"}}}>Have a doubt? Need some information? Reach us by E-mail</Typography>
                    <br/> 
                    </Grid>
                 
                    <Grid item xs={12} md={12} lg={12} sx={{display:"flex",alignItems:"center",flexDirection:"column"}}>
                    <div className="enquiryCard">
                    <img src="https://res.cloudinary.com/oasismanors/image/upload/v1708190847/Email_z6afpk.png" alt="CustomerCall" />
                    <Typography gutterBottom color="#333" sx={{fontSize:"20px"}}>Reach us by E-mail</Typography>
                    <Divider light sx={{maxWidth:"200px",marginBottom:"10px"}}/> 
                    <Typography color="#333" sx={{fontSize:"14px"}}>Write to us at</Typography>
                    <Link href="mailto:info@chelmsford11plus.com"><Typography color="#007bff" sx={{fontSize:"14px"}}>info@chelmsford11plus.com</Typography></Link> 
                    </div>
                    </Grid> 
                
                  </Grid>
                </Grid>
                <Grid item xs={12} lg={6}>
                  <form onSubmit={e=>handleEnquiry(e)} id="enquiryForm">
                  <Grid container spacing={2}>
                        <Grid item xs={12}>
                      <Alert icon={<FcApproval fontSize="inherit" />} severity="info">
                      Protecting your privacy: Your Data is safe with us
                    </Alert>
                        </Grid>
                        {submitted ? <Grid item xs={12} className="center" sx={{flexDirection:"column"}}>
                          <div id="thanks"/>
                          <Typography color="teal" sx={{fontSize:{xs:"14px",md:"18px"}}}>Your message has been sent. We will get back to you very shortly.</Typography>
                          <br/>
                          <Fab variant="extended" size="medium" color="primary" onClick={()=>setSubmitted(false)} aria-label="Thank">
                          <FcFeedback style={{fontSize:24,marginRight:10}} sx={{ mr: 1 }} />
                         New Enquiry ?
                        </Fab>
                           </Grid> : 
                        <> 
                      
                        <Grid item xs={12} md={6}>
                        <TextField fullWidth value={firstName} required onChange={e=>setFName(e.target.value)} label="First Name" placeholder="First Name..." variant="outlined" />
                        </Grid>
                        <Grid item xs={12} md={6}>
                        <TextField fullWidth value={lastName} required onChange={e=>setLName(e.target.value)} label="Last Name" placeholder="Last Name..." variant="outlined" />
                        </Grid>
                        <Grid item xs={12} md={6}> 
                        <TextField fullWidth value={email} required type="email" onChange={e=>setEmail(e.target.value)} label="Email" placeholder="Enter your Email" variant="outlined" />
                        </Grid>
                        <Grid item xs={12} md={6}> 
                        <TextField fullWidth value={mobile}  onChange={e=>setMobile(e.target.value)} label="Mobile No" type="number" placeholder="Enter your Mobile No" variant="outlined" />
                        </Grid>
                        <Grid item xs={12} md={12}> 
                        <TextField fullWidth value={address} onChange={e=>setAddress(e.target.value)} label="Address" placeholder="Enter your Address" variant="outlined" />
                        </Grid>
          
                                          <Grid item xs={12}> 
                                          <TextField fullWidth value={marketing} select onChange={e=>setMarketing(e.target.value)} label="How did you hear about us ?" placeholder="State" variant="outlined" >
                                          {allMarketing.map((option) => (
                              <MenuItem key={option} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                        <Grid item xs={12}> 
                        <TextField fullWidth value={message} onChange={e=>setMsg(e.target.value)} label="Your Message"  multiline minRows={4} placeholder="Please write your message..." variant="outlined" />
                        </Grid>
                        <Grid item xs={12} style={{display:"flex",justifyContent:"center"}}> 
                        <Fab variant="extended" size="medium" color="primary" aria-label="add" type="submit">
                          <FcFeedback style={{fontSize:24,marginRight:10}} sx={{ mr: 1 }} />
                          Send Enquiry
                        </Fab>
                        </Grid>

                        </> }
                        
                    </Grid>
                  </form>
                    
                </Grid>
            </Grid>
        </Container>
    </section>
  )
}

export default Enquiry