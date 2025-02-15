import React, { Fragment } from 'react'
import Navbar from '../Components/ITStartup/Common/Navbar/Navbar'
import { Container } from '@mui/material'
import Footer from '../Components/Footer/Footer'
import MultiCoursePage from './MultiCoursePage'

function page() {
  return (
    <Fragment style={{ backgroundColor: "#fff" }}>
    <Navbar />
  
    <Container style={{ marginTop:"100px" }}>
<MultiCoursePage />
    </Container>
    <Footer />
  </Fragment>
  )
}

export default page