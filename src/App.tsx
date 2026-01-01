//import { Canvas} from "@react-three/fiber";
//import { Preload } from "@react-three/drei";
//import { Suspense} from "react";


import './styles/App.css'
//import { Experience } from "./components/Experience";
import { Loading } from "./components/overlays/Loading";
//import { Overlay } from "./components/overlays/Overlay";
//import { Physics } from "@react-three/rapier";

function App() {
  return (
   <>
  <div className="App">
    <Loading/>
  </div>  
  
    {/*
  <Suspense fallback={<Loading/>}>
      <div className="App">
      <Canvas shadows={false} camera={{position: [0,0,8], fov: 42}}>
        <color attach="background" args={["#FFFFFF"]}/>
        
        <Experience/>
        
        <Preload all />  
      </Canvas>
      <Overlay/>
    </div>
    
    
    </Suspense>
    */}
    </>
  )
}

export default App
