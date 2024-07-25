/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.18 public/models/hoodie_model.glb -o src/components/Hoodie.jsx -r public 
*/

import { useGLTF } from '@react-three/drei'
export function Hoodie(props) {
  const { nodes, materials } = useGLTF('/models/hoodie_model.glb')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Curve.geometry} material={materials['Material.001']} position={[-1.595, 0.088, 1.644]} rotation={[Math.PI / 2, 0, 0]} scale={26.998} />
    </group>
  )
}

useGLTF.preload('/models/hoodie_model.glb')
