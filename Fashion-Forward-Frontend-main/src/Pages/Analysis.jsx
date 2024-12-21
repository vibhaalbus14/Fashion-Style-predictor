import React, {useRef} from 'react'
import Header from '../Components/Header/Header'
import Step1Analysis from '../Components/Step1/Step1Analysis'
import Step2Analysis from '../Components/Step2/Step2Analysis'
import Step3Analysis from '../Components/Step3/Step3Analysis'
import Footer from '../Components/Footer/Footer'
import UploadSection from '../Components/UploadSection/UploadSection'

const Analysis = () => {

  const uploadSectionRef = useRef(null);

  const scrollToUploadSection = () => {
    if (uploadSectionRef.current) {
      uploadSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div>
      <Header onTryNowClick={scrollToUploadSection}/>
      <UploadSection ref={uploadSectionRef}/>
      <Footer />
    </div>
  )
}

export default Analysis
