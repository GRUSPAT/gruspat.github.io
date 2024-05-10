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
import { CameraControls, Decal, Environment, MeshReflectorMaterial,Outlines, RoundedBox, Text, useTexture} from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { degToRad } from "three/src/math/MathUtils.js";

export const Experience = () => {
    const controls = useRef();
    const [hovered, hover] = useState()
    const texture = useTexture("/textures/Tarnow1000.png")

    const intro = async () => {
        controls.current.dolly(-20);
        controls.current.smoothTime = 1.6
        controls.current.dolly(20, true);
    }

    useEffect(() => {
        intro();
    },[])

    return (
        <>
            <CameraControls ref={controls}/>
            <Text font={"fonts/Medium.otf"} position-x={-1.3} position-y={0} position-z={1} lineHeight={0.8}>
                PATRYK{"\n"}GRUSZOWSKI
                <meshBasicMaterial color="black"/>
            </Text>
            <group rotation-y={degToRad(-30)} position-y={0} >
            <RoundedBox args={[2,2,1]} radius={0.28} position-x={5} onPointerOver={(e) => (e.stopPropagation(), hover(true))} onPointerOut={() => hover(false)}>
                <meshBasicMaterial color="#5A8A98"/>
                <Decal
                debug
                position={[0,0,0.8]}
                rotation={[0,0,0]}
                scale={[1.75,1.75,1]}
                >
                <meshBasicMaterial map={texture} polygonOffset
                polygonOffsetFactor={-1}/>
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
            <RoundedBox args={[2,2,1]} radius={0.28} position-x={8}onPointerOver={(e) => (e.stopPropagation(), hover(true))} onPointerOut={() => hover(false)}>
                <meshBasicMaterial color="green"/>
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
            <RoundedBox args={[2,2,1]} radius={0.32} position-x={11}onPointerOver={(e) => (e.stopPropagation(), hover(true))} onPointerOut={() => hover(false)}>
                <meshBasicMaterial color="red"/>
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
