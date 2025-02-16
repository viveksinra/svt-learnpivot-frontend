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
  [theme.breakpoints.down('sm')]: {
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

const PrivacyPolicyCom = () => {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));

  // Table of Contents links with IDs matching the section headings below.
  const tocLinks = [
    { id: "information", label: "1. Information We Collect" },
    { id: "usage", label: "2. How We Use Your Information" },
    { id: "security", label: "3. Data Protection & Security" },
    { id: "sharing", label: "4. Sharing Your Information" },
    { id: "contact", label: "5. Contact Us" },
  ];

  return (
    <Box py={4}>
      <Container>
        {/* Hero Header */}
        <HeroHeader>
          <Typography variant="h3" component="h1" gutterBottom>
            Privacy Policy
          </Typography>
          <Typography variant="subtitle1">
            Last Updated: 02 Feb 2025
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
              <Typography paragraph>
                Welcome to Chelmsford 11 Plus. Your privacy is important to us, and we are
                committed to protecting your personal information. This Privacy Policy explains how we
                collect, use, store, and protect your data when you visit our website
                <Link href="https://www.chelmsford11plus.com" target="_blank" rel="noopener" color="primary" underline="hover">
                  www.chelmsford11plus.com
                </Link> or use our services.
              </Typography>

              {/* Section 1 */}
              <StyledSection id="information">
                <Typography variant="h5" gutterBottom>
                  1. Information We Collect
                </Typography>
                <Typography paragraph>
                  We may collect the following types of information:
                </Typography>
                <List>
                  <ListItem disableGutters>
                    <ListItemText
                      primary="Personal Information"
                      secondary="Name, email address, phone number, and any other details provided when signing up or making a booking."
                    />
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemText
                      primary="Payment Information"
                      secondary="Payment details are processed securely through third-party payment providers. We do not store credit/debit card information."
                    />
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemText
                      primary="Usage Data"
                      secondary="Information on how you use our website, including IP addresses, browser type, and pages visited."
                    />
                  </ListItem>
                </List>
              </StyledSection>
              <Divider sx={{ mb: 4 }} />

              {/* Section 2 */}
              <StyledSection id="usage">
                <Typography variant="h5" gutterBottom>
                  2. How We Use Your Information
                </Typography>
                <Typography paragraph>
                  We use the collected data to:
                </Typography>
                <List>
                  <ListItem disableGutters>
                    <ListItemText primary="Process bookings and payments" />
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemText primary="Provide customer support and respond to inquiries" />
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemText primary="Improve our website and services" />
                  </ListItem>
                </List>
              </StyledSection>
              <Divider sx={{ mb: 4 }} />

              {/* Section 3 */}
              <StyledSection id="security">
                <Typography variant="h5" gutterBottom>
                  3. Data Protection & Security
                </Typography>
                <Typography paragraph>
                  We implement strict security measures to safeguard your personal data against
                  unauthorized access, alteration, disclosure, or destruction.
                </Typography>
              </StyledSection>
              <Divider sx={{ mb: 4 }} />

              {/* Section 4 */}
              <StyledSection id="sharing">
                <Typography variant="h5" gutterBottom>
                  4. Sharing Your Information
                </Typography>
                <Typography paragraph>
                  We do not sell, rent, or trade your personal information. We may share your data only
                  with:
                </Typography>
                <List>
                  <ListItem disableGutters>
                    <ListItemText primary="Service providers (such as payment processors) who help us operate our business" />
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemText primary="Legal authorities, if required by law" />
                  </ListItem>
                </List>
              </StyledSection>
              <Divider sx={{ mb: 4 }} />

              {/* Section 5 */}
              <StyledSection id="contact">
                <Typography variant="h5" gutterBottom>
                  5. Contact Us
                </Typography>
                <Typography paragraph>
                  If you have any questions or concerns regarding this Privacy Policy, please contact us at:
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

export default PrivacyPolicyCom;
