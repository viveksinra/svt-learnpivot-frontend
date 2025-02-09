import React from "react";
import { Divider, Grid, Typography, Chip } from "@mui/material";
import Link from "next/link";
import ImageCarousel from "../../Common/ImageCarousel";

const OneClass = ({ data }) => {
  return (
    <Grid container key={data._id} spacing={4}>
      <Grid item xs={12} md={4}>
        <ImageCarousel
          images={data.imageUrls}
          title={data.courseTitle}
          height="200px"
          autoplayDelay={6000}
        />
      </Grid>

      <Grid item xs={12} md={8}>
        <Typography
          color="#082952"
          gutterBottom
          sx={{
            fontSize: { xs: "18px", md: "20px" },
            fontWeight: 600,
            lineHeight: "20px",
            fontFamily: "Adequate, Helvetica Neue, Helvetica, sans-serif",
          }}
        >
          {data.courseTitle}
        </Typography>
        <Typography
          color="#082952"
          gutterBottom
          sx={{
            fontSize: { xs: "12px", md: "15px" },
            fontWeight: 200,
            fontFamily: "Adequate, Helvetica Neue, Helvetica, sans-serif",
          }}
        >
          from {data.firstDate} @ {data.startTime} to {data.endTime}
        </Typography>
        <Typography
          color="#333"
          sx={{
            fontFamily: "acumin-pro, sans-serif",
            fontWeight: 100,
            fontSize: { xs: "11px", md: "14px" },
            lineHeight: "1.8rem",
          }}
        >
          {data.shortDescription}
          <div style={{ display: "flex", marginTop: "10px", flexWrap: "wrap", gap: "8px" }}>
            {data.courseClass?.label && (
              <Chip
                label={`Class: ${data.courseClass.label}`}
                color="primary"
                variant="contained"
              />
            )}
            {data.courseType?.label && (
              <Chip
                label={`Type: ${data.courseType.label}`}
                color="primary"
                variant="contained"
              />
            )}
            {data.duration?.label && (
              <Chip
                label={`Duration: ${data.duration.label}`}
                color="primary"
                variant="contained"
              />
            )}
          </div>
        </Typography>
        <br />
        <div style={{ display: "flex" }}>
          <Link href={"/course/buy/" + data._id}>
            <button className="viewBtn">Quick Buy</button>
          </Link>
          <span style={{ flexGrow: 0.1 }} />
        </div>
      </Grid>
      <Grid item xs={12}>
        <Divider sx={{ marginTop: "-20px", marginBottom: "15px" }} />
      </Grid>
    </Grid>
  );
};

export default OneClass;
