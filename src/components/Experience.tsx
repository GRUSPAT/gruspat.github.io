import { 
  CameraControls,
  Environment,
  Text
} from "@react-three/drei";
import { useThree } from "@react-three/fiber";

import { degToRad } from "maath/misc"

import { useEffect, useRef} from "react";
import * as THREE from "three";
import {atom, useAtom} from "jotai";

import {Bwa} from "./gltfjsx/Bwa"
import { Hoodie } from "./gltfjsx/Hoodie";
import {Mgmg} from "./gltfjsx/Mgmg"

export const startAtom = atom(true);
export const activeAtom = atom("");
export const hoverAtom = atom("");
export const slideAtom = atom("");
export const previousAtom = atom<any>(null);
import {Tile} from "./Tile"

//import { RigidBody, InstancedRigidBodies, InstancedRigidBodyProps, CuboidCollider } from "@react-three/rapier";


//const COUNT = 500;

export const Experience = () => {
  const controls = useRef<any>(null);
  const [start, setStart] = useAtom(startAtom);
  const [hovered, setHovered] = useAtom(hoverAtom);
  const [active, setActive] = useAtom(activeAtom);
  const [slide, setSlide] = useAtom(slideAtom);
  //const [previous, setPrevious] = useAtom(previousAtom);
  //const viewport = useThree((state) => state.viewport);
  const ratioScale = active===null|| active===""?Math.min(1.2, Math.max(0.5, window.innerWidth / 1100)):1;
  
  /*
  const instances = useMemo(() => {
    const instances: InstancedRigidBodyProps[] = [];

    for (let i = 0; i < COUNT; i++) {
      instances.push({
        key: "instance_" + Math.random(),
        position: [Math.random() * 10, Math.random() * 10, Math.random() * 10],
        rotation: [Math.random(), Math.random(), Math.random()]
      });
    }

    return instances;
  }, []);
*/
 
  

   // useCursor(hovered);
    const scene = useThree((state) => state.scene);
    
    const intro = async () => {
        if(controls.current !==null){
          //controls.current.setTarget(0,90,90);
          //controls.current.smoothTime = 1.6;
            //if (start){setStart(false);}
          
            //controls.current.dolly(-16);

            //controls.current.rotateTo(degToRad(10),degToRad(40));
            //ścontrols.current.zoom(-0.6);
            //controls.current.smoothTime = 1.6;
           // controls.current.zoom(1);
         // controls.current.rotateTo(degToRad(-25),degToRad(95),true);
          
          //  controls.current.dolly(16, true);
          
        }
    }
    
    /*useEffect(() => {
      if (hovered&&!active) {
        //scene.getObjectByName(previous)?.lookAt(0,0,0);
        const targetPosition = new THREE.Vector3();
        scene.getObjectByName(hovered)?.getWorldPosition(targetPosition);
        controls.current.smoothTime=0.3;
        //controls.current.fitToBox(scene.getObjectByName(hovered));
          controls.current.setLookAt(
            targetPosition.x -30,
            0,
            targetPosition.z-3,
            0,
            0,
            0,
            true
          );
       
        
        
        //scene.getObjectByName(controls.current.getWorldPosition)?.getWorldPosition(targetPosition);
        //scene.getObjectByName(hovered)?.lookAt(targetPosition.x-9,0,4);
        if(previous&&hovered){
         // scene.getObjectByName(previous)?.lookAt(0,0,500);
          setPrevious(null);
        } 
        setPrevious(hovered);
        //scene.getObjectByName(hovered)?.rotateX(degToRad(30));
      } else {
        //scene.getObjectByName(previous)?.lookAt(0,0,500);
        setPrevious(null);
        controls.current.setLookAt(0, 0, 15, 0, 0, 0, true);
      }
    }, [hovered]);*/

    useEffect(() => {
      setHovered("");
      setActive("");
        intro();
        setStart(false);
        setSlide("GLB");
    },[])
    /*useEffect(() => {
      if(!active){
        controls.current.setLookAt(0, 0, 10/ratioScale, 0, 0, 0, true);
      }
    },[ratioScale])*/
    useEffect(() => {
      if(slide === "TXT"){
        controls.current.truck(0,1,true);
      }else if(slide === "GLB"){
        controls.current.truck(0,-1,true);
      }
      
    },[slide])

    useEffect(() => {
        if (active) {
          if(hovered){
            setHovered("");
          }
          if(!start){setStart(true)};
          const targetPosition = new THREE.Vector3();
          scene.getObjectByName(active)?.getWorldPosition(targetPosition);
          //const cameraPositionZ = targetPosition.x==0?2:2;
          const cameraPosition = targetPosition.x<0?1:-1;//targetPosition.x*1.65;

          
          if(targetPosition.x!==0){
            controls.current.setLookAt(
              -9*cameraPosition*ratioScale,
              0,
              3,
              -9*cameraPosition *ratioScale,0,0,
              true
            );
          }else{
            controls.current.setLookAt(
              0,
              0,
              3,
              targetPosition.x,
              targetPosition.y,
              targetPosition.z,
              true
            );
          }
        } else {
          controls.current.setLookAt(0, 0, 10/ratioScale, 0, 0, 0, true);
          setStart(false);
        }
      }, [active]);
      

    return (
        <>
            <CameraControls ref={controls} />
            {/*
            <InstancedRigidBodies
      instances={instances}
      colliders="cuboid"
      colliderNodes={[
        <CuboidCollider args={[3, 3, 3]} />,
      ]}
    >
      <instancedMesh args={[undefined, undefined, COUNT]} count={COUNT}>
      <Hoodie></Hoodie>
      </instancedMesh>
    </InstancedRigidBodies>
            */}

            
            
    
            
            
            <Text font="fonts/ASIX-FOUNDER-Italic.otf" color="black"position-z={0.32} 
                    position-x={-0.00} 
                    position-y={3.3} scale={0.60/*</>*ratioScale*/} >PATRYK GRUSZOWSKI
            </Text>
            <Text font="fonts/ASIX-FOUNDER-Italic.otf" color="black"position-z={0.32} 
                    position-x={0} 
                    position-y={2} scale={1.15/*</>*ratioScale*/} >PORTFOLIO
            </Text>
            
            <Text font="fonts/Medium.otf" color="black"position-z={0.32} 
                    position-x={0} 
                    position-y={2.7} scale={0.6/**ratioScale*/} >GMAIL.LINKEDIN.GITHUB
            </Text>
            
            <group rotation-y={degToRad(0)} position-y={0} position-z={0} position-x={0} >
              <Tile 
                name="TARNOW 1000"
                description={"Explore Tarnow;follow themed paths;or make your own with;this app full of;interesting places"}
                backgroundTexture={"textures/bwa_background_texture.png"}
                backgroundTextureRotationY={111}
                positionX={-1.7}
               // position-y={0}
                //position-z={0}
              >
                
                  <Bwa scale={4.6} position-y={-0.58} position-x={-0.6}/>
                
              </Tile>
              <Tile 
                name="SMART HOODIE"
                description={"Embedded device with;multiple sensors and;heating capability;integrated with;dedicated mobile app"}
                backgroundTexture={"textures/hoodie_background_texture.png"}
                backgroundTextureRotationY={0}
                positionX={0}
               // position-y={0}
               // position-z={0}
              >
                
                  <Hoodie scale={0.3 } position-y={-0.5} position-z={-0.5}/>
                
              </Tile>
              <Tile 
                name="MGMG"
                description={"Join with your friend;and compete in multiple;mini games with limited;time"}
                backgroundTexture={"textures/mgmg_background_texture.png"}
                backgroundTextureRotationY={0}
                positionX={1.7}
              //  position-y={0}
              //  position-z={0}
              >
                
                  <Mgmg position-y={-0.8} scale={0.25} position-z={0.30} position-x={-0.50}/>
                
              </Tile>
            </group>
            
            <Environment preset="sunset"/>
        </>
    );
};
