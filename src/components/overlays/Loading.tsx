import '../../styles/loading.css'
//import CurvedLoop from './CurvedLoop';
import DomeGallery from './DomeGallery';
import Aurora from './Aurora';

export const Loading = () => {
    return(
        <>
        
        <Aurora
  colorStops={["#5227FF", "#FF6B00", "#fff"]} 
  amplitude={1.2}
/>
            <div style={{ width: '100vw', height: '100vh'}}>
      <DomeGallery fit={0.5}
        minRadius={600}
        segments={38}
        padFactor={0}
        fitBasis={'width'}
        maxVerticalRotationDeg={3}
        grayscale={false}/>
    </div>
           
      
        </>
    )
}