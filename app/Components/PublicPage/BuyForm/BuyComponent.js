"use client";
import { useEffect, useState, useRef } from "react";
import { Container, Grid } from '@mui/material/';
import SmallOneClass from "../Classes/SmallOneClass";
import StripePay from "../../courseStripePay/StripePay";
import MySnackbar from "../../MySnackbar/MySnackbar";
import CourseEnqForm from "./CourseEnqForm";

const BuyComponent = ({ data }) => {
  const snackRef = useRef();  
  const [submitted, setSubmitted] = useState(false);
  const [selectedDates, setSelectedDates] = useState([]);
  const [totalAmount, setTotalAmount] = useState("");
  const [submittedId, setSubmittedId] = useState("");
  const [selectedChild, setSelectedChild] = useState(null);

  return (
    <section style={{ backgroundColor: "#fff", marginBottom: "10px", paddingTop:"20px" }} id="enquiry">
      <Container maxWidth="xl">
        <Grid container >
     
          <Grid item xs={12} lg={6}  >
            <SmallOneClass data={data} totalAmount={totalAmount} selectedDates={selectedDates} />
          </Grid>
          <Grid item xs={12} lg={6}  >
            {submitted ? (
              <StripePay submittedId={submittedId} />
            ) : (
              <CourseEnqForm 
                data={data} 
                setSubmitted={setSubmitted}
                setSubmittedId={setSubmittedId}
                setTotalAmount={setTotalAmount}                
                totalAmount={totalAmount} 
                selectedDates={selectedDates}
                setSelectedDates={setSelectedDates}
                selectedChild={selectedChild} 
                setSelectedChild={setSelectedChild} 
              />
            )}
          </Grid>
        </Grid>
      </Container>
      <MySnackbar ref={snackRef} />
    </section>
  );
}

export default BuyComponent;
