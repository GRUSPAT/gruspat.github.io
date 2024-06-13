/** 
 * 
 * To do:
 * 
 * 1. Contact form
 * 2. App portals
 * 3. Moving bars with *OPEN TO WORK*
 * 4. Short About me info
 * 5. Links to socials
 * 
 * Functions:
 * 1. Highlights
 * 2. Moving camera
 * 3. Portals
 * 4. Spheres with different colors
 * 
 * Maybes?:
 * 1. Title screen with falling apps icons
 */
import { 
    CameraControls,
    Float, 
    Environment,
    MeshPortalMaterial,
    Outlines, 
    RoundedBox, 
    useTexture, 
    useCursor
} from "@react-three/drei";
//import { useFrame, useThree } from "@react-three/fiber";
//import { easing } from "maath"
import { useSpring, animated, config } from "@react-spring/three";
import React, { useEffect, useRef, useState } from "react";
import { degToRad } from "three/src/math/MathUtils.js";
import * as THREE from "three";
import { Hoodie } from "./Hoodie";
import {Mgmg} from "./Mgmg"
import {Bwa} from "./Bwa"



export const Experience = () => {
    const controls = useRef<any>(null);
    const [hovered, hover] = useState<any>(null)
    const [hovered_mgmg, hover_mgmg] = useState<any>(null)
    const [hovered_bwa, hover_bwa] = useState<any>(null)
   // const [active, setActive] = useState<any>(null);

   const myMesh1 = React.useRef(null);
   const myMesh2 = React.useRef(null);
   const myMesh3 = React.useRef(null);
  const [activebwa, setActiveBwa] = useState(false);
  const [activehoodie, setActiveHoodie] = useState(false);
  const [activemgmg, setActiveMgmg] = useState(false);
  const { scale } = useSpring({
    scale: activebwa ? 1.5 : 1,
    config: config.wobbly
  });
  const scale2 = useSpring({
    scale: activehoodie ? 1.5 : 1,
    config: config.wobbly
  });
  const scale3 = useSpring({
    scale: activemgmg ? 1.5 : 1,
    config: config.wobbly
  });

    useCursor(hovered);
   // const controlsRef = useRef();
    //const scene = useThree((state) => state.scene);

    const texture_bwa = useTexture("/textures/bwa_background_texture.png")
    const texture_hoodie = useTexture("/textures/hoodie_background_texture.png")
    const texture_mgmg = useTexture("/textures/mgmg_background_texture.png")

    const intro = async () => {
        if(controls.current !==null){
            controls.current.dolly(-16);
            controls.current.smoothTime = 1.4
            controls.current.dolly(16, true);
        }
    }
    

    useEffect(() => {
        intro();
    },[])

  /*  useEffect(() => {
        if (active) {
          const targetPosition = new THREE.Vector3();
          scene.getObjectByName(active).getWorldPosition(targetPosition);
          controls.current.setLookAt(
            0,
            0,
            5,
            targetPosition.x,
            targetPosition.y,
            targetPosition.z,
            true
          );
        } else {
          controls.current.setLookAt(0, 0, 10, 0, 0, 0, true);
        }
      }, [active]);*/

    return (
        <>
        
        
        
            <CameraControls ref={controls}/>
            <group rotation-y={degToRad(0)} position-y={0} position-z={0} position-x={0} >
            
            <Float floatIntensity={1} rotationIntensity={1}>
                <animated.mesh 
                  scale={scale}
                  onClick={() => setActiveBwa(!activebwa)}
                  ref={myMesh1}>
  
  <RoundedBox args={[2,2,0.5]} radius={0.28} position-x={-3} onPointerOver={(e) => (e.stopPropagation(), hover_bwa(true))} onPointerOut={() => hover_bwa(false)}>
            <meshBasicMaterial color="#5A8A98" />  
                <MeshPortalMaterial>
                    <ambientLight intensity={1}/>
                    <Environment preset="sunset"/>
                   
                    <mesh rotation-y={degToRad(111)}>
                        <sphereGeometry args={[2.9,64,64]}/>
                        <meshStandardMaterial map={texture_bwa} side={THREE.BackSide}/>
                    </mesh>
                    
                   <Float rotationIntensity={5}> <Bwa scale={4.6} position-y={-0.58} position-x={-0.6}/></Float>
                   
                    
                </MeshPortalMaterial>
                <Outlines
            screenspace
            toneMapped={false}
            polygonOffset
            polygonOffsetFactor={100}
            transparent
            opacity={hovered_bwa * 1}
            color="#FF6B00"
            angle={Math.PI}
            thickness={8}
          />
            </RoundedBox>
            </animated.mesh>
            </Float>
      
            
            <Float floatIntensity={1} rotationIntensity={1}>
            <animated.mesh 
                  scale={scale2.scale}
                  onClick={() => setActiveHoodie(!activehoodie)}
                  ref={myMesh2}>
            <RoundedBox args={[2,2,0.5]} radius={0.28} position-x={0}onPointerOver={(e) => (e.stopPropagation(), hover(true))} onPointerOut={() => hover(false)}>
            <MeshPortalMaterial blend={0}>
                    <ambientLight intensity={1}/>
                    <Environment preset="sunset"/>
                    <mesh rotation-y={degToRad(90)}>
                        <sphereGeometry args={[2.5,64,64]}/>
                        <meshStandardMaterial map={texture_hoodie} side={THREE.BackSide}/>
                        
                    </mesh>
                    
                    <Float rotationIntensity={5}>
                    <Hoodie scale={0.3 } position-y={-0.5} position-z={-0.5}/>
                    </Float>
                </MeshPortalMaterial>
                <Outlines
            screenspace
            toneMapped={false}
            polygonOffset
            polygonOffsetFactor={100}
            transparent
            opacity={hovered * 1}
            color="#FF6B00"
            angle={Math.PI}
            thickness={8}
          />
            </RoundedBox>
            </animated.mesh>
            </Float>
            <Float floatIntensity={1} rotationIntensity={1}>
            <animated.mesh 
                  scale={scale3.scale}
                  onClick={() => setActiveMgmg(!activemgmg)}
                  ref={myMesh3}>
            <RoundedBox args={[2,2,0.5]} radius={0.32} position-x={3}onPointerOver={(f) => (f.stopPropagation(), hover_mgmg(true))} onPointerOut={() => hover_mgmg(false)}>
            <MeshPortalMaterial>
                    <ambientLight intensity={1}/>
                    <Environment preset="sunset"/>
                    <mesh rotation-y={degToRad(65)}>
                        <sphereGeometry args={[2.5,64,64]}/>
                        <meshStandardMaterial map={texture_mgmg} side={THREE.BackSide}/>
                    </mesh>
              
                   
                    <Float rotationIntensity={5}>
                    <Mgmg position-y={-0.8} scale={0.25} position-z={0.30} position-x={-0.50}/>
                    </Float>
                    
                </MeshPortalMaterial>
                
                <Outlines
            screenspace
            toneMapped={false}
            polygonOffset
            polygonOffsetFactor={100}
            transparent
            opacity={hovered_mgmg * 1}
            color="#FF6B00"
            angle={Math.PI}
            thickness={8}
          />
          
            </RoundedBox>
            </animated.mesh>
            </Float>
            </group>
            
          
            <Environment preset="sunset"/>
        </>
    );
};
/*
const PortfolioStage = ({
    children,
    texture,
    name,
    active,
    setActive,
    hovered,
    setHovered,
    ...props
  }) => {
    const map:any = useTexture(texture);
    const portalMaterial = useRef<any>(null);
  
    useFrame((_state, delta) => {
      const worldOpen = active === name;
      easing.damp(portalMaterial.current, "blend", worldOpen ? 1 : 0, 0.2, delta);
    });
  
    return (
      <group {...props}>
       <Float floatIntensity={1} rotationIntensity={1}>
                <mesh>
            <RoundedBox 
              args={[2,2,2]} 
              radius={0.28} 
              position-x={-3} 
              onPointerOver={(e) => (e.stopPropagation(), hover_bwa(true))} onPointerOut={() => hover_bwa(false)}>
            <meshBasicMaterial color="#5A8A98" />  
                <MeshPortalMaterial>
                    <ambientLight intensity={1}/>
                    <Environment preset="sunset"/>
                   
                    <mesh rotation-y={degToRad(111)}>
                        <sphereGeometry args={[2.9,64,64]}/>
                        <meshStandardMaterial map={map} side={THREE.BackSide}/>
                    </mesh>
                    <Float>
                    <Svg src={"/vectors/bwa_vector.svg"} position-y={0.65} position-z={0} position-x={-0.5} scale={0.0013} />
                    </Float>
                </MeshPortalMaterial>
                <Outlines
            screenspace
            toneMapped={false}
            polygonOffset
            polygonOffsetFactor={100}
            transparent
            opacity={hovered_bwa * 1}
            color="#FF6B00"
            angle={Math.PI}
            thickness={8}
          />
            </RoundedBox>
            </mesh>
            </Float>
      </group>
     */

      
/*
      <group {...props}>
        <RoundedBox
          name={name}
          args={[2, 3, 0.1]}
          onDoubleClick={() => setActive(active === name ? null : name)}
          onPointerEnter={() => setHovered(name)}
          onPointerLeave={() => setHovered(null)}
        >
          <MeshPortalMaterial ref={portalMaterial} side={THREE.DoubleSide}>
            <ambientLight intensity={1} />
            <Environment preset="sunset" />
            {children}
            <mesh>
              <sphereGeometry args={[5, 64, 64]} />
              <meshStandardMaterial map={map} side={THREE.BackSide} />
            </mesh>
          </MeshPortalMaterial>
        </RoundedBox>
      </group>*/

      /*
    );
  };
*/