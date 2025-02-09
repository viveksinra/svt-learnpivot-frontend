import React from 'react'
import MultiCoursePage from './MultiCoursePage'
import Navbar from '../Components/ITStartup/Common/Navbar/Navbar'
import { Container } from '@mui/material'
import Footer from '../Components/Footer/Footer'

function page() {
  return (
    <main style={{ backgroundColor: "#fff" }}>
      <Navbar />
    
      <Container style={{ marginTop:"100px" }}>
      <MultiCoursePage />
  
      </Container>
      <Footer />
    </main>
  )
}

export default page