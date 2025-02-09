import { Box, Button, Container, Grid, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";

const HeroSec = () => {

    return(
        <>
        <Box sx={{ background: "#fff", marginTop: "20px" }}>
          <Container>
            <Grid container spacing={4} >
              <Grid item xs={12} md={6}>
                <Typography variant="h2" color="#082952" gutterBottom>
                  Welcome to Chelmsford
                </Typography>
                <Typography color="#073f85" variant="h5">
                  Dive into a world of knowledge with our vast array of learning resources. Whether you're a beginner or an expert, we have something for everyone. Explore new topics, sharpen your skills, and broaden your horizons. Let's embark on this journey of learning together.
                </Typography>
                <Box sx={{ display: 'flex', gap: '1rem', marginTop: '2rem',marginBottom: '2rem' }}>
                <Link href="/course" passHref>
    <Button size="large" variant="contained" component="a">
      <Typography color="white" variant="body1">Course</Typography>
    </Button>
  </Link>
                <Link href="/mockTest" passHref>
    <Button size="large" variant="outlined" component="a">
      <Typography color="primary" variant="body1">Mock Test</Typography>
    </Button>
  </Link>
                </Box>
          
              </Grid>
              <Grid item xs={12} md={6}>
                <div id="welcomeImg" />
              </Grid>
            </Grid>
          </Container>
        </Box></>
    )

}

export default HeroSec