import { memo } from 'react';
import { SRGBColorSpace } from 'three';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { useTexture } from '@react-three/drei';

export const CuttingMatGrid = memo(() => {
  const texture = useTexture('/bg-mat.svg');

  return (
    <RigidBody type="fixed" colliders={false}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.005, 0.5]} receiveShadow>
        <planeGeometry args={[55, 40]} />
        <meshStandardMaterial 
          map={texture} 
          map-colorSpace={SRGBColorSpace}
          roughness={0.8}
          metalness={0.1}
          transparent={false}
          alphaTest={0.5}
        />
      </mesh>

      <CuboidCollider args={[80, 1, 50]} position={[0, -1, 0.5]} restitution={0.0} friction={0.8} />
      <CuboidCollider args={[200, 2, 200]} position={[0, -5, 0.5]} restitution={0.0} friction={1.0} />
      <CuboidCollider args={[1, 15, 45]} position={[-75, 15, 0.5]} restitution={0.0} friction={0.8} />
      <CuboidCollider args={[1, 15, 45]} position={[75, 15, 0.5]} restitution={0.0} friction={0.8} />
      <CuboidCollider args={[75, 15, 1]} position={[0, 15, -45]} restitution={0.0} friction={0.8} />
      <CuboidCollider args={[75, 15, 1]} position={[0, 15, 45]} restitution={0.0} friction={0.8} />
    </RigidBody>
  );
});

useTexture.preload('/bg-mat.svg');

export default CuttingMatGrid;
