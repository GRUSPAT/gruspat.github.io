/** 
 * 
 * To do:
 * 
 * 1. Formularz konatktowy
 * 2. Portale do apek
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

 * <mesh position-y={-1} rotation-x={-Math.PI / 2}>
                <planeGeometry args={[100,100]}/>
                <MeshReflectorMaterial
                blur={[100,100]}
                resolution={2048}
                mixBlur={1}
                mixStrength={10}
                roughness={1}
                depthScale={1}
                opacity={0.5}
                transparent
                minDepthThreshold={0.4}
                maxDepthThreshold={1.4}
                color="#000"
                metalness={0.5}
                />

            </mesh>  
 */
import { CameraControls, Decal, Environment,Outlines, RoundedBox, useTexture} from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { degToRad } from "three/src/math/MathUtils.js";

export const Experience = () => {
    const controls = useRef<any>(null);
    const [hovered, hover] = useState<any>(null)
    const texture_bwa = useTexture("/textures/Tarnow1000.png")

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

    return (
        <>
            <CameraControls ref={controls}/>
            <group rotation-y={degToRad(0)} position-y={0} position-z={0} position-x={0} >
            <RoundedBox args={[2,2,1]} radius={0.28} position-x={-3} onPointerOver={(e) => (e.stopPropagation(), hover(true))} onPointerOut={() => hover(false)}>
                <meshBasicMaterial color="#5A8A98"/>
                <Decal
                debug
                position={[0,0,0.4]}
                rotation={[0,0,0]}
                scale={[1,1,0.3]}
                >
                <meshBasicMaterial map={texture_bwa}polygonOffset
                polygonOffsetFactor={-1} />
                </Decal>
                
                <Outlines
            screenspace
            toneMapped={false}
            polygonOffset
            polygonOffsetFactor={100}
            transparent
            opacity={hovered * 1}
            color="black"
            angle={Math.PI}
            thickness={8}
          />
            </RoundedBox>
            <RoundedBox args={[2,2,1]} radius={0.28} position-x={0}onPointerOver={(e) => (e.stopPropagation(), hover(true))} onPointerOut={() => hover(false)}>
                <meshBasicMaterial color="#1C1B1F"/>
                <Outlines
            screenspace
            toneMapped={false}
            polygonOffset
            polygonOffsetFactor={100}
            transparent
            opacity={hovered * 1}
            color="black"
            angle={Math.PI}
            thickness={8}
          />
            </RoundedBox>
            <RoundedBox args={[2,2,1]} radius={0.32} position-x={3}onPointerOver={(e) => (e.stopPropagation(), hover(true))} onPointerOut={() => hover(false)}>
                <meshBasicMaterial color="#10B3D8"/>
                <Outlines
            screenspace
            toneMapped={false}
            polygonOffset
            polygonOffsetFactor={100}
            transparent
            opacity={hovered * 1}
            color="black"
            angle={Math.PI}
            thickness={8}
          />
            </RoundedBox>
            </group>
          
            <Environment preset="sunset"/>
        </>
    );
};
