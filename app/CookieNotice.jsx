"use client";
import React, { useEffect, useState } from "react";
import { Box, Button, Grid, Typography, Link } from "@mui/material";

export const CookieNotice = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const cookieAccepted = localStorage.getItem("cookieAccepted");
    if (!cookieAccepted) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieAccepted", "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 20,
        left: "50%",
        transform: "translateX(-50%)",
        bgcolor: "white",
        color: "text.primary",
        p: 2,
        borderRadius: 2,
        boxShadow: 2,
        maxWidth: "90%",
        width: 400,
        zIndex: 1000,
      }}
    >
      <Grid container spacing={2} alignItems="center">
        {/* Text Section */}
        <Grid item xs={12} sm={8}>
          <Typography variant="body2">
            <strong>Cookies Notice</strong>
            <br />
            We use cookies to enhance your browsing experience. By continuing
            to use our website, you agree to our{" "}
            <Link href="/policy/privacyPolicy" color="primary" underline="hover">
              use of cookies
            </Link>
            .
          </Typography>
        </Grid>

        {/* Button Section */}
        <Grid item xs={12} sm={4} display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            onClick={handleAccept}
            size="small"
            sx={{ fontWeight: "bold" }}
          >
            Okay
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
