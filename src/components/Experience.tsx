  import { 
    CameraControls,
    Environment,
    Text
  } from "@react-three/drei";
  import { useThree } from "@react-three/fiber";
  //import { degToRad } from "maath/misc"
  import { useEffect, useRef} from "react";
  import * as THREE from "three";
  import {atom, useAtom} from "jotai";



  export const startAtom = atom(true);
  export const activeAtom = atom("");
  export const hoverAtom = atom("");
  export const slideAtom = atom("");
  export const previousAtom = atom<any>(null);
  import {Tile} from "./Tile"
  import TileData from "./data/TileData"
  import { TITLE_FONT_PATH, SUB_TITLE_FONT_PATH } from "./data/GlobalData";

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
            //controls.current.mouseButtons.left = CameraControls.ACTION.NONE;
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
          controls.current.truck(0,1.7,true);
        }else if(slide === "GLB"){
          controls.current.truck(0,-1.7,true);
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
              <group scale={0.6} position-y={1}>
              <Text font={TITLE_FONT_PATH} color="black"position-z={0.32} 
                      position-x={-0.00} 
                      position-y={3.3} scale={0.60/*</>*ratioScale*/} >PATRYK GRUSZOWSKI
              </Text>
              <Text font={TITLE_FONT_PATH} color="black"position-z={0.32} 
                      position-x={0} 
                      position-y={2} scale={1.15/*</>*ratioScale*/} >PORTFOLIO
              </Text>
              
              <Text font={SUB_TITLE_FONT_PATH} color="black"position-z={0.32} 
                      position-x={0} 
                      position-y={1.3} scale={0.6/**ratioScale*/} >GMAIL.LINKEDIN.GITHUB
              </Text>
              <Text font={SUB_TITLE_FONT_PATH} color="black"position-z={0.32} 
                      position-x={0} 
                      position-y={2.7} scale={0.57/**ratioScale*/} >MOBILE APP DEVELOPER
              </Text>
              </group>
      {TileData.map((data,index) => (
          <Tile 
            key={index}
            name={data.name} 
            description={data.description}
            backgroundTexture={data.backgroundTexture}
            positionX={data.positionX}
          >
            {data.children}
          </Tile>
        ))}   
              <Environment preset="sunset"/>
          </>
      );
  };
