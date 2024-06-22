import { Canvas} from "@react-three/fiber";
import { Preload } from "@react-three/drei";
import './App.css'
import { Experience } from "./components/Experience";
import { Overlay } from "./components/Overlay";
import { Suspense} from "react";
import { EffectComposer, Noise, Outline,Vignette, Bloom, DepthOfField } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

function App() {

  return (
    <Suspense fallback={null}>
      
      <div className="App">
      <Canvas shadows camera={{position: [0,0,8], fov: 42}}>
      
        <color attach="background" args={["#ececec"]}/>
        
        <Experience/>
        
        
        <EffectComposer autoClear={false}>
          <Outline blur edgeStrength={100} />
          <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} height={480} />
          <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
          <Noise premultiply blendFunction={BlendFunction.ADD} />
        </EffectComposer>
        
        <Preload all />
      </Canvas>
      <Overlay/>
    </div>
    
    
    </Suspense>
    
  )
}

export default App
