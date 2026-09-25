import { memo } from 'react';
import type { Mesh, Object3D, Material } from 'three';
import { useGLTF } from '@react-three/drei';
import type { ThreeElements } from '@react-three/fiber';
import type { GLTF } from 'three-stdlib';

type GLTFResult = GLTF & {
  nodes: {
    'head-sculpture_fixed(1)': Mesh;
    [key: string]: Object3D;
  };
  materials: Record<string, Material>;
};

export type HeadModelProps = ThreeElements['group'] & {
  color?: string;
  roughness?: number;
  metalness?: number;
};

export const HeadModel = memo(function HeadModel({
  color = '#888888',
  roughness = 0.5,
  metalness = 0.2,
  ...props
}: HeadModelProps) {
  const { nodes } = useGLTF('/models/head.glb') as unknown as GLTFResult;
  const geometry = nodes['head-sculpture_fixed(1)']?.geometry;

  if (!geometry) return null;

  return (
    <group {...props} dispose={null}>
      <mesh 
        name="head-sculpture_fixed(1)" 
        geometry={geometry} 
        position={[0.0067, -1.9357, -0.1131]}
      >
        <meshStandardMaterial 
          color={color} 
          roughness={roughness} 
          metalness={metalness} 
        />
      </mesh>
    </group>
  );
});

export { HeadModel as Model };
export default HeadModel;

useGLTF.preload('/models/head.glb');
