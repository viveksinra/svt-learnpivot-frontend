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
  padding: theme.spacing(3),
  borderRadius: theme.spacing(1),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const StyledSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const HeroHeader = styled(Box)(({ theme }) => ({
  background: "linear-gradient(135deg, #4a90e2 0%, #9013fe 100%)",
  color: theme.palette.common.white,
  padding: theme.spacing(4, 2),
  textAlign: "center",
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(3),
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

const CancellationPolicyCom = () => {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));

  // Table of Contents links with IDs matching the section headings below.
  const tocLinks = [
    { id: "mock-tests", label: "1. Mock Tests" },
    { id: "classes-courses", label: "2. Classes/Courses" },
    { id: "contact", label: "3. Contact Us" },
  ];

  return (
    <Box py={3}>
      <Container>
        <HeroHeader>
          <Typography variant="h3" component="h1" gutterBottom>
            Cancellation Policy
          </Typography>
          <Typography variant="subtitle1">
            Last Updated: 02 Feb 2025
          </Typography>
        </HeroHeader>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <StyledPaper elevation={2}>
              <Typography paragraph sx={{ mb: 2 }}>
                Please read our cancellation policy carefully. By making a booking with Chelmsford 11 Plus,
                you agree to these terms and conditions.
              </Typography>

              {/* Section 1 */}
              <StyledSection id="mock-tests">
                <Typography variant="h5" gutterBottom sx={{ mb: 1 }}>
                  1. Mock Tests
                </Typography>
              
                <List dense>
                  <ListItem disableGutters>
                    <ListItemText primary="No cancellations or changes are allowed once booked." />
                  </ListItem>
                </List>
              </StyledSection>
              <Divider sx={{ my: 1 }} />

              {/* Section 2 */}
              <StyledSection id="classes-courses">
                <Typography variant="h5" gutterBottom sx={{ mb: 1 }}>
                  2. Classes/Courses
                </Typography>
                <List dense>
                  <ListItem disableGutters>
                    <ListItemText primary="Participants may withdraw at any time with a 6-working-day notice." />
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemText primary="Refunds will be issued for any remaining classes." />
                  </ListItem>
                </List>
              </StyledSection>
              <Divider sx={{ my: 1 }} />

              {/* Section 3 */}
              <StyledSection id="contact">
                <Typography variant="h5" gutterBottom sx={{ mb: 1 }}>
                  3. Contact Us
                </Typography>
                <Typography paragraph sx={{ mb: 1 }}>
                  If you have any questions about our cancellation policy, please contact us at:
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

export default CancellationPolicyCom;
