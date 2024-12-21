import React from 'react'
import Hero from '../Components/HeroSection/Hero'
import StepOne from '../Components/Step1/Step1'
import IntroText from '../Components/Step1/IntroText'
import StepTwo from '../Components/Step2/Step2'
import StepThree from '../Components/Step3/Step3'
import About from '../Components/About/About'
import ElevateStyle from '../Components/ElevateStyle/ElevateStyle'
import Footer from '../Components/Footer/Footer'


const Home = () => {
  return (
    <div>
      <Hero/>
      <IntroText/>
      <StepOne/>
      <StepTwo/>
      <StepThree/>
      <About/>
      <ElevateStyle/>
      <Footer/>
    </div>
  )
}

export default Home
