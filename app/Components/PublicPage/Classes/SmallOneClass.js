import React, { useState } from "react";
import { Divider, Grid, Typography, Chip, Dialog } from "@mui/material";
import ProceedToPayButton from "./SubmitButton";
import { formatDateToShortMonth } from "@/app/utils/dateFormat";
import ImageCarousel from "../../Common/ImageCarousel";

const formateDateToMonth = (dates) => {
  return dates.map(date => new Date(date).toLocaleString('default', { month: 'short', day: 'numeric', year: 'numeric' }));
};

const SmallOneClass = ({ data, totalAmount, selectedDates, setSelectedDates }) => {
  const [open, setOpen] = useState(false); // State to manage dialog open/close

  const formattedDates = formateDateToMonth(selectedDates);

  const handleOpenDialog = () => {
    setOpen(true); // Open the dialog
  };

  const handleCloseDialog = () => {
    setOpen(false); // Close the dialog
  };

  return (
    <Grid container key={data._id} spacing={2} direction="column" >
      {/* Image Section */}
      <Grid item xs={12} lg={6} style={{maxWidth:"500px"}} sx={{ display: { xs: 'none', lg: 'block' } }}>
      <ImageCarousel
          images={data.imageUrls}
          title={data.courseTitle}
          height="300px"
          autoplayDelay={6000}
        />
      </Grid>

      {/* Dialog for image enlargement */}
      <Dialog
        open={open}
        onClose={handleCloseDialog}
        maxWidth="xl" // Set maxWidth to extra-large
        fullWidth // Allow dialog to take the full width
      >
        <img
          src={data.url}
          alt={data.courseTitle}
          style={{
            width: "100%", // Take full width of the dialog
            height: "auto", // Maintain aspect ratio
            maxHeight: "90vh", // Ensure it doesn't exceed the viewport height
          }}
        />
      </Dialog>

      <Grid item xs={12}>
        <Typography
          color="#082952"
          gutterBottom
          sx={{
            fontSize: { xs: "16px", md: "20px" },
            fontWeight: 600,
            lineHeight: "24px",
            fontFamily: "Adequate, Helvetica Neue, Helvetica, sans-serif",
            textAlign: { xs: "center", md: "left" },
          }}
        >
          {data.courseTitle}
        </Typography>
      </Grid>

      <Grid item xs={12} lg={6} sx={{ display: { xs: 'none', lg: 'block' } }}>
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", marginTop: "10px", marginBottom: "10px" }}>
          <Chip
            label={`Class: ${data.courseClass?.label}`}
            color="primary"
            variant="contained"
            sx={{ marginRight: "8px", marginBottom: "8px" }}
          />
          <Chip
            label={`Type: ${data.courseType?.label}`}
            color="primary"
            variant="contained"
            sx={{ marginRight: "8px", marginBottom: "8px" }}
          />
          <Chip
            label={`Duration: ${data.duration?.label}`}
            color="primary"
            variant="contained"
            sx={{ marginRight: "8px", marginBottom: "8px" }}
          />
        </div>
      </Grid>

      <Grid item xs={12}>
        <Typography
          color="#082952"
          gutterBottom
          sx={{
            fontSize: { xs: "12px", md: "15px" },
            fontWeight: 200,
            fontFamily: "Adequate, Helvetica Neue, Helvetica, sans-serif",
          }}
        >
          Selected Date: {selectedDates?.length ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center" }}>
              {formattedDates.map((date, index) => (
                <Chip key={index} label={formatDateToShortMonth(date)} variant="outlined" />
              ))}
            </div>
          ) : 'No date selected'}
        </Typography>

        <Divider sx={{ marginTop: "10px", marginBottom: "5px" }} />
        
        {totalAmount && (
          <Typography variant="h6" gutterBottom sx={{ textAlign: { xs: "center", md: "left" } }}>
            Proceed to pay amount: £ {totalAmount}
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default SmallOneClass;
