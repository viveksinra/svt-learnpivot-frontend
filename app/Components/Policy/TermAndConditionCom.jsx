import React from "react";
import Image from "next/image";
import NextLink from "next/link";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Link,
  styled,
  useTheme,
  useMediaQuery,
} from "@mui/material";

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(1),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(3),
  },
}));

const StyledSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const HeroHeader = styled(Box)(({ theme }) => ({
  background: "linear-gradient(135deg, #4a90e2 0%, #9013fe 100%)",
  color: theme.palette.common.white,
  padding: theme.spacing(6, 2),
  textAlign: "center",
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(4),
}));

const TocItem = styled(Link)(({ theme }) => ({
  display: "block",
  marginBottom: theme.spacing(1),
  color: theme.palette.primary.main,
  cursor: "pointer",
  textDecoration: "none",
  "&:hover": {
    textDecoration: "underline",
  },
}));

const TermsAndConditions = () => {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  // Table of Contents links with IDs matching the section headings below.
  const tocLinks = [
    { id: "introduction", label: "1. Introduction" },
    { id: "services", label: "2. Services Provided" },
    { id: "booking", label: "3. Booking and Payment" },
    { id: "refund", label: "4. No Refund and Cancellation Policy" },
    { id: "client", label: "5. Client Obligations" },
    { id: "liability", label: "6. Limitation of Liability" },
    { id: "amendments", label: "7. Amendments to Terms" },
    { id: "governing", label: "8. Governing Law" },
    { id: "contact", label: "9. Contact Information" },
  ];

  return (
    <Box py={4}>
      <Container>
        {/* Hero Header */}
        <HeroHeader>
          <Typography variant="h3" component="h1" gutterBottom>
            Terms and Conditions
          </Typography>
        </HeroHeader>

        <Grid container spacing={4}>
          {/* Table of Contents for larger screens */}
          {/* {isMdUp && (
            <Grid item md={3}>
              <StyledPaper elevation={2}>
                <Typography variant="h6" gutterBottom>
                  Table of Contents
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {tocLinks.map((item) => (
                  <TocItem
                    key={item.id}
                    href={`#${item.id}`}
                    underline="none"
                  >
                    {item.label}
                  </TocItem>
                ))}
              </StyledPaper>
            </Grid>
          )} */}

          {/* Main Content */}
          <Grid item xs={12} 
          // md={isMdUp ? 9 : 12}
          >
            <StyledPaper elevation={2}>
              {/* Section 1: Introduction */}
              <StyledSection id="introduction">
                <Typography variant="h5" gutterBottom>
                  1. Introduction
                </Typography>
                <Typography paragraph>
                  Welcome to Chelmsford 11 Plus. By accessing or using our services, you agree to comply with and be bound by the following terms and conditions. Please read them carefully.
                </Typography>
              </StyledSection>
              <Divider sx={{ mb: 4 }} />

              {/* Section 2: Services Provided */}
              <StyledSection id="services">
                <Typography variant="h5" gutterBottom>
                  2. Services Provided
                </Typography>
                <Typography paragraph>
                  Chelmsford 11 Plus offers educational services, including but not limited to:
                </Typography>
                <List>
                  <ListItem disableGutters>
                    <ListItemText primary="11+ Courses" />
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemText primary="11+ Mock Tests" />
                  </ListItem>
                </List>
              </StyledSection>
              <Divider sx={{ mb: 4 }} />

              {/* Section 3: Booking and Payment */}
              <StyledSection id="booking">
                <Typography variant="h5" gutterBottom>
                  3. Booking and Payment
                </Typography>
                <List>
                  <ListItem disableGutters>
                    <ListItemText primary="All services must be booked in advance through our website." />
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemText primary="Payments are required in full at the time of booking." />
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemText primary="We accept all card types." />
                  </ListItem>
                </List>
              </StyledSection>
              <Divider sx={{ mb: 4 }} />

              {/* Section 4: No Refund and Cancellation Policy */}
              <StyledSection id="refund">
                <Typography variant="h5" gutterBottom>
                  4. No Refund and Cancellation Policy
                </Typography>
                <List>
                  <ListItem disableGutters>
                    <ListItemText
                      primary="No Refunds"
                      secondary="All payments made are non-refundable. Once a booking is confirmed and payment is processed, clients are not entitled to a refund under any circumstances."
                    />
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemText
                      primary="No Cancellations"
                      secondary="Clients are not permitted to cancel or reschedule booked sessions. Failure to attend a scheduled session will result in forfeiture of the session without refund."
                    />
                  </ListItem>
                </List>
              </StyledSection>
              <Divider sx={{ mb: 4 }} />

              {/* Section 5: Client Obligations */}
              <StyledSection id="client">
                <Typography variant="h5" gutterBottom>
                  5. Client Obligations
                </Typography>
                <Typography paragraph>
                  Clients agree to:
                </Typography>
                <List>
                  <ListItem disableGutters>
                    <ListItemText primary="Ensure timely attendance for all scheduled sessions." />
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemText primary="Provide accurate and complete information during the booking process." />
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemText primary="Comply with all instructions and policies provided by Chelmsford 11 Plus." />
                  </ListItem>
                </List>
              </StyledSection>
              <Divider sx={{ mb: 4 }} />

              {/* Section 6: Limitation of Liability */}
              <StyledSection id="liability">
                <Typography variant="h5" gutterBottom>
                  6. Limitation of Liability
                </Typography>
                <Typography paragraph>
                  While we strive to provide the best possible educational experience, Chelmsford 11 Plus cannot guarantee specific outcomes. We are not liable for any direct or indirect damages arising from the use of our services.
                </Typography>
              </StyledSection>
              <Divider sx={{ mb: 4 }} />

              {/* Section 7: Amendments to Terms */}
              <StyledSection id="amendments">
                <Typography variant="h5" gutterBottom>
                  7. Amendments to Terms
                </Typography>
                <Typography paragraph>
                  Chelmsford 11 Plus reserves the right to amend these terms and conditions at any time. Changes will be effective upon posting on our website. Continued use of our services constitutes acceptance of the revised terms.
                </Typography>
              </StyledSection>
              <Divider sx={{ mb: 4 }} />

              {/* Section 8: Governing Law */}
              <StyledSection id="governing">
                <Typography variant="h5" gutterBottom>
                  8. Governing Law
                </Typography>
                <Typography paragraph>
                  These terms and conditions are governed by and construed in accordance with the laws of England and Wales.
                </Typography>
              </StyledSection>
              <Divider sx={{ mb: 4 }} />

              {/* Section 9: Contact Information */}
              <StyledSection id="contact">
                <Typography variant="h5" gutterBottom>
                  9. Contact Information
                </Typography>
                <Typography paragraph>
                  For any questions or concerns regarding these terms, please contact us at:
                </Typography>
                <Typography
                  component="a"
                  href="mailto:support@chelmsford11plus.com"
                  sx={{
                    color: "primary.main",
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  support@chelmsford11plus.com
                </Typography>
              </StyledSection>
            </StyledPaper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default TermsAndConditions;
