import '../../styles/loading.css'
import CurvedLoop from './CurvedLoop';
import Aurora from './Aurora';

export const Loading = () => {
    return(
        <>
        
        <Aurora
  colorStops={["#5227FF", "#FF6B00", "#fff"]} 
  amplitude={1.2}
/>
            
            <CurvedLoop
             interactive={false}
             marqueeText='powstaje · nowa · strona ·'
             speed={1}
             
            />
      
        </>
    )
}