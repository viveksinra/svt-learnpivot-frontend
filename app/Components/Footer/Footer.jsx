"use client";
import "./footerStyle.css";
import { Container, Divider, Grid, Typography, Box } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { FaAccessibleIcon, FaHospitalAlt, FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  const amenities = [
    "Expert Instructor Team",
    "Interactive Learning Plans",
    "Progress Tracking",
    "24/7 Learning Access",
    "Engaging Exercises",
    "Inspiring Virtual Environment",
  ];

  const links = [
    { label: "About Us", link: "about" },
    { label: "Contact Us", link: "contact" },
    { label: "Terms & Conditions", link: "policy/termandcondition" },
    { label: "Privacy Policy", link: "policy/privacyPolicy" },
    { label: "Cancellation Policy", link: "policy/cancellationPolicy" },
  ];

  return (
    <section className="footerBg" style={{ backgroundColor: "#f5f5f5" }}>
      <Container maxWidth="xl" style={{ padding: "2rem 0",marginLeft:"20px" }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={1} />

          <Grid item xs={12} md={3} >
            <Link href="/">
              <Image
                width={160}
                height={60}
                src="https://res.cloudinary.com/qualifier/image/upload/v1706185907/Logo/chelmsford-high-resolution-logo_vc9ewh.svg"
                alt="Chelmsford"
                loading="lazy"
              />
            </Link>
            <br />
            <br />
            <Typography color="black" variant="subtitle1">
              Embark on a journey of knowledge, innovation, and personal growth
              with our cutting-edge e-learning platform. Here, empowerment
              flourishes, and your educational aspirations take center stage.
            </Typography>
           
          </Grid>

          <Grid item xs={12} md={1} />

          <Grid item xs={12} md={3}>
            <Typography
              variant="h5"
              color="primary"
              style={{ fontFamily: "Courgette" }}
            >
              Learning Features:
            </Typography>
            <ul id="amenitiesUl">
              {amenities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Grid>

          <Grid item xs={12} md={3}>
            <Typography
              variant="h5"
              color="primary"
              style={{ fontFamily: "Courgette" }}
            >
              Quick Links:
            </Typography>
            <ul id="quickUl">
              {links.map((linkItem) => (
                <li key={linkItem.label}>
                  <Link href={`/${linkItem.link}`}>
                    {linkItem.label} ↠
                  </Link>
                </li>
              ))}
            </ul>
          </Grid>

          <Grid item xs={12} md={1} />
        </Grid>
      </Container>

      {/* Full-width Privacy & Data Protection Section */}
      <Box width="100%" bgcolor="#222" color="#fff" py={4}>
        <Container maxWidth="xl">
          <Typography
            variant="h6"
            style={{
              fontFamily: "Courgette",
              marginBottom: "1rem",
              color: "#fff",
            }}
          >
            Privacy &amp; Data Protection
          </Typography>
          <Typography variant="body2" paragraph style={{ color: "#ddd" }}>
            At Chelmsford 11 Plus, we take your privacy seriously. Any personal
            information you provide is kept strictly confidential and used only
            for the purpose of delivering our services. We do not share, sell, or
            disclose your data to third parties without your consent, except where
            required by law.
          </Typography>
          <Typography variant="body2" paragraph style={{ color: "#ddd" }}>
            We implement industry-standard security measures to protect your
            information from unauthorized access, misuse, or disclosure. For
            more details on how we handle your data, please refer to our{" "}
            <Link
              href="/policy/privacyPolicy"
              style={{
                textDecoration: "underline",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Privacy Policy
            </Link>
            .
          </Typography>
        </Container>
        <Container maxWidth="xl">
        <Box mt={4}>
          <Divider />
          <Typography
            variant="body2"
            align="center"
            style={{ marginTop: "1rem", color: "#777" }}
          >
            © 2025 Chelmsford 11 Plus. All Rights Reserved.
          </Typography>
        </Box>
      </Container>
      </Box>


    </section>
  );
};

export default Footer;
