import { Canvas } from "@react-three/fiber";
import './App.css'
import { Experience } from "./components/Experience";

function App() {

  return (
      <div className="App">
      <Canvas shadows camera={{position: [0,0,8], fov: 42}}>
        <color attach="background" args={["#ececec"]}/>
        <fog attach="fog" args={["#ececec",5,30]}/>
        <Experience/>
      </Canvas>
    </div>
    
  )
}

export default App
