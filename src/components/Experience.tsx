import { 
  CameraControls,
  Float, 
  Environment,
  MeshPortalMaterial,
  Outlines, 
  RoundedBox, 
  useTexture, 
  useCursor,
  Svg
} from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { easing } from "maath"
import { useSpring, animated, config } from "@react-spring/three";
import React, { useEffect, useRef, useState } from "react";
import { degToRad } from "three/src/math/MathUtils.js";
import * as THREE from "three";

import {Bwa} from "./gltfjsx/Bwa"
import { Hoodie } from "./gltfjsx/Hoodie";
import {Mgmg} from "./gltfjsx/Mgmg"

export const Experience = () => {
  const controls = useRef<any>(null);
  const [hovered, setHovered] = useState<any>(null)
  const [active, setActive] = useState<any>(null);
  const myMesh = React.useRef(null);
  const title = useRef<any>(null);
  const { scale } = useSpring({
    scale: active ? 1 : 1.4,
    config: config.wobbly
  });

    useCursor(hovered);
    const scene = useThree((state) => state.scene);

    const intro = async () => {
        if(controls.current !==null){
            controls.current.dolly(-16);
            controls.current.rotateTo(degToRad(10),degToRad(40));
            //ścontrols.current.zoom(-0.6);
            controls.current.smoothTime = 1.6;
           // controls.current.zoom(1);
          controls.current.rotateTo(degToRad(-25),degToRad(95),true);
            controls.current.dolly(16, true);
        }
    }
  
    useEffect(() => {
        intro();
    },[])

    useEffect(() => {
        if (active) {
          const targetPosition = new THREE.Vector3();
          scene.getObjectByName(active)?.getWorldPosition(targetPosition);
          controls.current.setLookAt(
            0,
            0,
            2,
            targetPosition.x,
            targetPosition.y,
            targetPosition.z,
            true
          );
        } else {
          controls.current.setLookAt(0, 0, 10, 0, 0, 0, true);
        }
      }, [active]);

    return (
        <>
            <CameraControls ref={controls} />
            <group rotation-y={degToRad(0)} position-y={0} position-z={0} position-x={0} >
              <PortfolioStage 
                name="Tarnow1000"
                backgroundTexture={"textures/bwa_background_texture.png"}
                backgroundTextureRotationY={111}
                mainVector={"vectors/TARNOW_1000.svg"}
                sideVector={"vectors/award.svg"}
                position-x={-5}
                position-y={0}
                position-z={0}
                active={active}
                setActive={setActive}
                hovered={hovered}
                setHovered={setHovered}
                scaleAnimation={scale}
                myMesh={myMesh}
                title={title}
              >
                <Float rotationIntensity={5}> 
                  <Bwa scale={4.6} position-y={-0.58} position-x={-0.6}/>
                </Float>   
              </PortfolioStage>

              <PortfolioStage 
                name="SmartHoodie"
                backgroundTexture={"textures/hoodie_background_texture.png"}
                backgroundTextureRotationY={0}
                mainVector={"vectors/SMART_HOODIE.svg"}
                sideVector={"vectors/award.svg"}
                position-x={0}
                position-y={0}
                position-z={0}
                active={active}
                setActive={setActive}
                hovered={hovered}
                setHovered={setHovered}
                scaleAnimation={scale}
                myMesh={myMesh}
                title={title}
              >
                <Float rotationIntensity={5}>
                  <Hoodie scale={0.3 } position-y={-0.5} position-z={-0.5}/>
                </Float>
              </PortfolioStage>

              <PortfolioStage 
                name="MGMG"
                backgroundTexture={"textures/mgmg_background_texture.png"}
                backgroundTextureRotationY={0}
                mainVector={"vectors/MGMG.svg"}
                sideVector={"vectors/award.svg"}
                position-x={5}
                position-y={0}
                position-z={0}
                active={active}
                setActive={setActive}
                hovered={hovered}
                setHovered={setHovered}
                scaleAnimation={scale}
                myMesh={myMesh}
                title={title}
              >
                <Float rotationIntensity={5}>
                  <Mgmg position-y={-0.8} scale={0.25} position-z={0.30} position-x={-0.50}/>
                </Float>
              </PortfolioStage>
            </group>
            <Environment preset="sunset"/>
        </>
    );
};
const PortfolioStage = ({
  children,
  backgroundTexture,
  backgroundTextureRotationY,
  mainVector,
  sideVector,
  name,
  active,
  setActive,
  hovered,
  setHovered,
  scaleAnimation,
  myMesh,
  title,
  ...props
}) => {
  const map:any = useTexture(backgroundTexture);
  const portalMaterial = useRef<any>(null);
  useFrame((_state, delta) => {
    const worldOpen = active === name;
    easing.damp(portalMaterial.current, "blend", worldOpen ? 1 : 0, 0, delta);
  });
  return (
    <group onPointerEnter={() => setHovered(name)} 
    onPointerOut={() => setHovered(null)} {...props}>
      <Float floatIntensity={active === name? 0 : 1} rotationIntensity={active === name? 0 : 1}>
        <animated.mesh 
          scale={scaleAnimation}
          //onDoubleClick={() => setActive(active === name ? null : name)}
          ref={myMesh}
        >
          <RoundedBox 
            name={name}
            args={[2,2,0.5]} 
            radius={0.28} 
            position-x={0}
            onClick={() => setActive(active === name ? null : name)}
            
          >
            <MeshPortalMaterial ref={portalMaterial}>
              <ambientLight intensity={1}/>
              <Environment preset="sunset"/>
              <mesh rotation-y={degToRad(backgroundTextureRotationY)}>
                <sphereGeometry args={[16,64,64]}/>
                <meshStandardMaterial map={map} side={THREE.BackSide}/>
              </mesh>
              <Svg 
                  ref={title}
                  src={mainVector} 
                  scale={0.001} 
                  position-z={6.32} 
                  position-x={-0.8} 
                  position-y={0.65} 
                />
              {children}
            </MeshPortalMaterial>
            <group>  
              <RoundedBox 
                args={[2.5,2.5,0.6]} 
                radius={0.2}
                position-z={0}
              >
                <meshPhongMaterial color="#FFFFFF" transparent opacity={0.4} visible={hovered === name?true:false}/>
                <Svg 
                  src={mainVector} 
                  scale={0.001} 
                  position-z={0.32} 
                  position-x={-0.6} 
                  position-y={0.25} 
                />
                <Svg 
                  src={sideVector} 
                  scale={0.0023} 
                  position-z={0.31} 
                  position-x={-0.85} 
                  position-y={-0.5} 
                />
              </RoundedBox>
            </group>
            <Outlines
              screenspace
              toneMapped={false}
              polygonOffset
              polygonOffsetFactor={100}
              transparent
              opacity={0}
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