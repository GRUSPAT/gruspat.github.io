import { Canvas} from "@react-three/fiber";
import { Preload } from "@react-three/drei";
import { Suspense} from "react";


import './styles/App.css'
import { Experience } from "./components/Experience";
import { Loading } from "./components/html/Loading";
import { Overlay } from "./components/html/Overlay";
import { Physics } from "@react-three/rapier";

function App() {
  return (
    <Suspense fallback={<Loading/>}>
      <div className="App">
      <Canvas shadows camera={{position: [0,0,8], fov: 42}}>
        <color attach="background" args={["#FFFFFF"]}/>
        <Physics colliders={false}>
        <Experience/>
        </Physics>
        <Preload all />  
      </Canvas>
      <Overlay/>
    </div>
    
    
    </Suspense>
    
  )
}

export default App
