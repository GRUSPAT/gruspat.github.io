import { 
    Float, 
    Environment,
    MeshPortalMaterial,
    Outlines, 
    RoundedBox, 
    useTexture, 
    Text
} from "@react-three/drei";
import { useSpring, animated, config } from "@react-spring/three";
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { easing } from "maath"
import { degToRad } from "maath/misc"
import { useAtom} from "jotai";
import { activeAtom, hoverAtom, startAtom } from "./Experience";
import { useEffect} from "react";
import { RigidBody } from "@react-three/rapier";



export const Tile = ({
    children,
    backgroundTexture,
    backgroundTextureRotationY,
    name,
    description,
    positionX,
    ...props
}) => {
    const map:any = useTexture(backgroundTexture);
    const portalMaterial = useRef<any>(null);
    const childrenFloat = useRef<any>(null);
    const [isWorldOpen, setIsWorldOpen] = useState(false);
    const [isItemHover, setIsItemHover] = useState(false);
    const[hovered,setHovered] = useAtom(hoverAtom);
    const [active,setActive] = useAtom(activeAtom);
    const [start, setStart] = useAtom(startAtom);
    const [slide,setSlide] = useState("");
    const titleWithNewLines = name.replaceAll(" ", "\n");
    const descriptionWithNewLines = description.replaceAll(";","\n");
    const mediumFont = "fonts/Medium.otf";
    const asixFont = "fonts/ASIX-FOUNDER-Italic.otf";
  
    useEffect(() => {
        setStart(false);
        
    },[])
    useFrame((_state, delta) => {
      //const worldOpen = active === name;
      //const isItemHover = hovered === name;
      setIsWorldOpen(active === name ? true : false);
      setIsItemHover(hovered === name ? true : false);
      
      easing.damp(portalMaterial.current, "blend", isWorldOpen ? 1 : 0, 0.001, delta);
     // easing.damp(childrenFloat.current, "rotationIntensity", isItemHover ? 5 : 0, 0.1, delta);
      //console.log(childrenFloat.current.rotationIntensity);
      //console.log(portalMaterial.current);
    });
    /*const {rotationIntensity} = useSpring({
      rotationIntensity: isWorldOpen || isItemHover ? 5 : 0.25,
      config: config.gentle
    });*/
    const {positionTileX} = useSpring({
      positionTileX: start? positionX*4: positionX,
      config: active? config.gentle: config.slow
    });
    const {scaleTile} = useSpring({
      scaleTile: start? 1.3:1,
      config: config.gentle
    });
    
    const {positionHoverZ} = useSpring({
      positionHoverZ: !isItemHover? -2.1: 0.01,
      config: config.gentle
    });
    const {positionHoverY} = useSpring({
      positionHoverY: hovered!==name? 1: -2,
      config: config.gentle
    });
   /* const {rotationFull} = useSpring({
      rotationFull: active===name? 3:0,
      config: config.wobbly
    });*/
    const { scale } = useSpring({
      scale: hovered !==name ? 0.01 : 1.4,
      config: config.wobbly
    });
    const AnimatedFloat = animated(Float);
    const ratioScale = Math.min(1.2, Math.max(0.5, window.innerWidth / 1100));
    /*useEffect(()=>{
      console.log(childrenFloat.current.rotationIntensity);
      //console.log(portalMaterial.current);
    },[childrenFloat.current.rotationIntensity]);*/
    return (
      <group onPointerEnter={() => setHovered(name)} 
      onPointerOut={() => setHovered("")} {...props}>
        <Float floatIntensity={active === name? 0 : 0} rotationIntensity={active === name? 0 : 0}>
          <animated.mesh 
            
            onDoubleClick={() => setActive(active === name ? null : name)}
            position-x={positionTileX}
            //rotation-y={rotationFull}
            scale={scaleTile}
          >
            <RoundedBox 
              name={name}
              args={[2,2,0.5]} 
              radius={0.28} 
              position-x={positionX}
             // onClick={() => setHovered(hovered === name ? null : name)}
              
            >
              <MeshPortalMaterial ref={portalMaterial}>
                <ambientLight intensity={0.3}/>
                <Environment preset={active?"city":"sunset"}/>
                <mesh rotation-y={degToRad(backgroundTextureRotationY)}>
                  <sphereGeometry args={[16,64,64]}/>
                  <meshStandardMaterial map={map} side={THREE.BackSide}/>
                </mesh>
                <group>
                <animated.group visible={isWorldOpen?true:false}>
                <Text font={asixFont} color="white"
                    position-x={0} 
                    position-y={1}
                    position-z={-3}
                    scale={0.85*ratioScale} >{titleWithNewLines}
                </Text>
                <Text font={mediumFont} color="white"position-z={0.42} 
                    position-x={-0.44*ratioScale} 
                    position-y={-0.1} scale={0.05} >
                      {descriptionWithNewLines}
                </Text>
                <Text font={asixFont} color="#FF6B00"position-z={0.32} 
                    position-x={-0.90*ratioScale} 
                    position-y={-0.50*ratioScale} scale={0.05} >
                      .GLB
                </Text>
                <Text font={asixFont} color="white"position-z={0.32} 
                    position-x={-0.90*ratioScale} 
                    position-y={-0.55*ratioScale} scale={0.05} onClick={() => setActive("Tarnow 1000")}>
                      .PNG
                </Text>
                <Text font={asixFont} color="white"position-z={0.32} 
                    position-x={-0.90*ratioScale} 
                    position-y={-0.60*ratioScale} scale={0.05} onClick={() => setActive("MGMG")} >
                      .TXT
                </Text>
                <Text font={mediumFont} color={name === "TARNOW 1000"?"#FF6B00":"white"} position-z={0.32} 
                    position-x={0.78*ratioScale} 
                    position-y={-0.50*ratioScale} scale={0.05} onClick={() => setActive("TARNOW 1000")} >
                      TARNOW 1000
                </Text>
                <Text font={mediumFont} color={name === "SMART HOODIE"?"#FF6B00":"white"} position-z={0.32} 
                    position-x={0.78*ratioScale} 
                    position-y={-0.55*ratioScale} scale={0.05} onClick={() => setActive("SMART HOODIE")} >
                      SMART HOODIE
                </Text>
                <RigidBody type="kinematicPosition">
                <Text font={mediumFont} color={name === "MGMG"?"#FF6B00":"white"}position-z={0.32} 
                    position-x={0.78*ratioScale} 
                    position-y={-0.60*ratioScale} scale={0.05} onClick={() => setActive("MGMG")} >
                      MGMG
                </Text>
                </RigidBody>
                </animated.group>
                <AnimatedFloat floatIntensity={0} rotationIntensity={active?5:0} ref={childrenFloat}>
                
                {children}
                
                </AnimatedFloat>  
                </group>
              </MeshPortalMaterial>
              <animated.group scale={scale} position-y={positionHoverY} position-z={positionHoverZ}> 
                <Text font="fonts/ASIX-FOUNDER-Italic.otf" color="#ececec"position-z={0.32} 
                    position-x={0} 
                    position-y={0.25} scale={0.2} >{name}</Text>
                <Text font="fonts/ASIX-FOUNDER-Italic.otf" color="#ececec"position-z={0.32} 
                    position-x={0} 
                    position-y={0} scale={0.2} >{"TEST"}</Text>     
              </animated.group>
              <Outlines
                screenspace
                toneMapped={false}
                polygonOffset
                polygonOffsetFactor={100}
                transparent
                opacity={hovered===name?1:0}
                color="#FF6B00"
                angle={Math.PI}
                thickness={8}
              />
            </RoundedBox>
          </animated.mesh>
        </Float>
      </group>
    );
  }