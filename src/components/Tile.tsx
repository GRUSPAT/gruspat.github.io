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
import { activeAtom, hoverAtom } from "./Experience";



export const Tile = ({
    children,
    backgroundTexture,
    backgroundTextureRotationY,
    name,
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
    const {rotationIntensity} = useSpring({
      rotationIntensity: isWorldOpen || isItemHover ? 5 : 0.25,
      config: {
        mass: 600,
      }
    });
  /*  const {positionTileX} = useSpring({
      positionTileX: active? 0:0,// positionX*3.5: positionX,
      config: config.gentle
    });*/
    const {positionHoverZ} = useSpring({
      positionHoverZ: hovered!==name? -2.1: 0.01,
      config: config.gentle
    });
    const {positionHoverY} = useSpring({
      positionHoverY: hovered!==name? 1: -2,
      config: config.gentle
    });
    const {rotationFull} = useSpring({
      rotationFull: active===name? 4.4:0,
      config: config.wobbly
    });
    const { scale } = useSpring({
      scale: hovered !==name ? 0.01 : 1.4,
      config: config.wobbly
    });
    const AnimatedFloat = animated(Float);
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
           // position-x={positionTileX}
            rotation-y={rotationFull}
          >
            <RoundedBox 
              name={name}
              args={[2,2,0.5]} 
              radius={0.28} 
              position-x={positionX}
             // onClick={() => setHovered(hovered === name ? null : name)}
              
            >
              <MeshPortalMaterial ref={portalMaterial}>
                <ambientLight intensity={1}/>
                <Environment preset="sunset"/>
                <mesh rotation-y={degToRad(backgroundTextureRotationY)}>
                  <sphereGeometry args={[16,64,64]}/>
                  <meshStandardMaterial map={map} side={THREE.BackSide}/>
                </mesh>
                  
                <AnimatedFloat rotationIntensity={rotationIntensity} ref={childrenFloat}>
                {children}
                </AnimatedFloat>  
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