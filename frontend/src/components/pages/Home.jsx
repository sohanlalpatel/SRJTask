import React from 'react'
import Navbar from './home/Navbar'
import Hero from './home/Hero'
import Stats from './home/Stats'
import Services from './Services'
import Footer from './home/Footer'
import ClientsSlider from './home/Clients'
import Testimonials from './home/Testimonials'
import About from './home/About'

const Home = () => {
  return (
    <>
    <Navbar />
    <Hero/>
    <ClientsSlider/>
    <About/>
    <Stats/>
    <Services/>
    <Testimonials/>
    <Footer/>
    </>
  )
}

export default Home