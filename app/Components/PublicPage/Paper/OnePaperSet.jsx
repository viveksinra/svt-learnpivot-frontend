"use client";
import React, { useState } from "react";
import PaperFaqModal from "./PaperFaqModal";
import PaperInfoModal from "./PaperInfoModal";
import { Grid, Typography, Chip, Box, Stack } from "@mui/material";
import { styled } from '@mui/material/styles';
import Link from "next/link";
import ImageCarousel from "../../Common/ImageCarousel";

const OnePaperSet = ({ data }) => {
  const AnimatedButton = styled('button')(({ theme, bgcolor, hovercolor, textcolor = 'white' }) => ({
    backgroundColor: bgcolor || '#F97316',
    color: textcolor,
    padding: '12px 15px',
    borderRadius: '4px',
    fontWeight: 'bold',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
    minWidth: 'fit-content',
    maxWidth: 'max-content',
    whiteSpace: 'nowrap',
    flex: '0 0 auto',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 5px 15px rgba(0,0,0,0.4)',
      backgroundColor: hovercolor || '#E85D04',
    },
    '&:active': { transform: 'translateY(0)' },
    '&::after': {
      content: '""',
      position: 'absolute',
      top: '0',
      left: '-100%',
      width: '100%',
      height: '100%',
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
      transition: '0.5s',
    },
    '&:hover::after': { left: '100%' }
  }));
  const [openFAQ, setOpenFAQ] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);

  return (
    <>
      <Grid
        container
        spacing={4}
        sx={{
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "4px 4px 8px rgba(0,0,0,0.1)",
          overflow: "hidden",
          marginTop: { xs: "1px", md: "16px" },
          marginBottom: { xs: "16px", md: "0" },
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          paddingLeft: "3px",
          paddingRight: "3px",
        }}
      >
        <Grid item xs={12} md={4} sx={{ p: 0 }}>
          <ImageCarousel
            images={data.imageUrls}
            title={data.setTitle}
            height="220px"
            autoplayDelay={6000}
          />
        </Grid>

        <Grid item xs={12} md={8} sx={{ p: 3 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
            <div style={{ flex: 1 }}>
              <Link href={"/paper/buy/" + data._id}>
                <Typography
                  variant="h5"
                  sx={{
                    color: "#082952",
                    fontWeight: 600,
                    mb: 1,
                    fontFamily: "Adequate, Helvetica Neue, Helvetica, sans-serif",
                  }}
                >
                  {data.setTitle}
                </Typography>
              </Link>
            </div>
          </div>

          {data.shortDescription && (
            <Typography
              sx={{
                backgroundColor: "#10B981",
                color: "white",
                p: 1,
                borderRadius: "4px",
                fontSize: "0.875rem",
                maxWidth: "fit-content",
              }}
            >
              {data.shortDescription}
            </Typography>
          )}

          <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
            {data.classLevel?.label && (
              <Chip
                label={`${data.classLevel.label}`}
                sx={{ backgroundColor: "#E0F2FE", color: "#0369A1", fontWeight: "bold" }}
              />
            )}
            {data.subject?.label && (
              <Chip
                label={`${data.subject?.label}`}
                sx={{ backgroundColor: "#F3E8FF", color: "#7E22CE", fontWeight: "bold" }}
              />
            )}
          </div>

          <Box
            sx={{
              backgroundColor: "#FCD34D",
              padding: "4px 8px",
              borderRadius: "8px",
              maxWidth: "fit-content",
              marginTop: "16px",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              £{data.onePaperPrice} Per Paper
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap' }}>
            <AnimatedButton onClick={() => setOpenFAQ(true)} bgcolor="#FCD34D" hovercolor="#F6B935" textcolor="#1F2937">
              FAQS
            </AnimatedButton>
            <AnimatedButton onClick={() => setOpenInfo(true)} bgcolor="#EDE9FE" hovercolor="#DDD6FE" textcolor="#5B21B6">
              PAPER INFO
            </AnimatedButton>
            <Link href={"/paper/buy/" + data._id} style={{ textDecoration: "none" }}>
              <AnimatedButton>BUY PAPERS</AnimatedButton>
            </Link>
          </Stack>
        </Grid>
      </Grid>

      <PaperFaqModal open={openFAQ} onClose={() => setOpenFAQ(false)} />
      <PaperInfoModal open={openInfo} onClose={() => setOpenInfo(false)} data={data} />
    </>
  );
};

export default OnePaperSet;


