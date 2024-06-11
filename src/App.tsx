import { Canvas} from "@react-three/fiber";
import { Preload } from "@react-three/drei";
import './App.css'
import { Experience } from "./components/Experience";
import { Overlay } from "./components/Overlay";
import { Suspense} from "react";
import { EffectComposer, Noise, Outline } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

function App() {

  return (
    <Suspense fallback={null}>
      <div className="App">
      <Canvas shadows camera={{position: [0,0,8], fov: 42}}>
        <color attach="background" args={["#ececec"]}/>
        <fog attach="fog" args={["#ececec",5,30]}/>
        <Experience/>
        <EffectComposer autoClear={false}>
          <Outline blur edgeStrength={100} />
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
