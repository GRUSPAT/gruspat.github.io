/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.18 public/models/bwa_model.glb -o src/components/Bwa.jsx -r public 
*/

import { useGLTF } from '@react-three/drei'

export function Bwa(props) {
  const { nodes, materials } = useGLTF('/models/bwa_model.glb')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Curve.geometry} material={materials['Material.001']}  rotation={[Math.PI / 2, 0, 0]} />
    </group>
  )
}

useGLTF.preload('/models/bwa_model.glb')
