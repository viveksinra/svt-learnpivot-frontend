import React, { Fragment } from 'react'
import Navbar from '../Components/ITStartup/Common/Navbar/Navbar'
import { Container } from '@mui/material'
import Footer from '../Components/Footer/Footer'
import MultiPaperPage from './MultiPaperPage'
import '../../styles/scrollbar.css'

function page() {
  const containerStyle = {
    marginTop: "85px",
    '@media (max-width: 600px)': {
      alignItems: "center",
      padding: "0",
      paddingLeft: "3px",
      paddingRight: "3px",
      maxWidth: "100%",
      display: "flex",
      justifyContent: "center"
    }
  }

  return (
    <Fragment style={{ backgroundColor: "#fff" }}>
      <Navbar />
      <Container sx={containerStyle}>
        <MultiPaperPage />
      </Container>
      <Footer />
    </Fragment>
  )
}

export default page





