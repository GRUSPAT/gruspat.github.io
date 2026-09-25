import { useState, useEffect, useRef, memo } from 'react';
import { useGLTF } from '@react-three/drei';
import {
  TextureLoader,
  SRGBColorSpace,
  ClampToEdgeWrapping,
  RepeatWrapping,
  DoubleSide,
  MeshStandardMaterial,
  type Texture,
  type Material,
  type Mesh,
  type Group,
} from 'three';
import type { ThreeElements } from '@react-three/fiber';
import type { GLTF } from 'three-stdlib';
import { getImageUrl } from '../../utils/imageAssets';

type GLTFResult = GLTF & {
  nodes: Record<string, Mesh>;
  materials: Record<string, Material & { [key: string]: any }>;
};

interface CustomMesh extends Mesh {
  _originalMaterial?: Material;
}

export type IphoneModelProps = ThreeElements['group'] & {
  imagePath?: string | null;
  targetMaterial?: string;
  textureRepeat?: boolean;
  textureScale?: number;
  textureScaleX?: number;
  textureScaleY?: number;
  textureOffsetX?: number;
  textureOffsetY?: number;
  materialOpacity?: number;
  materialRoughness?: number;
  textureFit?: 'cover' | 'contain' | 'fill' | string;
  color?: string;
  colorTargetMaterial?: string;
};

const disposeClonedMaterial = (mesh: CustomMesh) => {
  if (mesh.material && mesh._originalMaterial && mesh.material !== mesh._originalMaterial) {
    if (Array.isArray(mesh.material)) {
      mesh.material.forEach((m) => m.dispose());
    } else {
      (mesh.material as Material).dispose();
    }
  }
};

export const IphoneModel = memo(function IphoneModel({ 
  imagePath, 
  targetMaterial, 
  textureRepeat = true, 
  textureScale = 1.0,
  textureScaleX = 1.0,
  textureScaleY = 1.0,
  textureOffsetX = 0.0,
  textureOffsetY = 0.0,
  materialOpacity = 1.0, 
  materialRoughness = 0.5, 
  textureFit = 'cover',
  color,
  colorTargetMaterial,
  ...props 
}: IphoneModelProps) {
  const { nodes, materials } = useGLTF('/models/iphone_16_-_free.glb') as unknown as GLTFResult;
  const [screenTex, setScreenTex] = useState<Texture | null>(null);
  const groupRef = useRef<Group>(null);

  useEffect(() => {
    let active = true;
    let loadedTexture: Texture | null = null;

    if (!imagePath) {
      setScreenTex(null);
      return;
    }

    const loader = new TextureLoader();
    loader.load(
      getImageUrl(imagePath),
      (texture) => {
        if (!active) {
          texture.dispose();
          return;
        }
        texture.flipY = false;
        texture.colorSpace = SRGBColorSpace;
        setScreenTex(texture);
        loadedTexture = texture;
      },
      undefined,
      (err) => {
        console.error('Failed to load screen texture:', err);
      }
    );

    return () => {
      active = false;
      if (loadedTexture) {
        loadedTexture.dispose();
      }
    };
  }, [imagePath]);

  useEffect(() => {
    return () => {
      if (groupRef.current) {
        groupRef.current.traverse((child) => {
          const mesh = child as CustomMesh;
          if (mesh.isMesh && mesh._originalMaterial) {
            disposeClonedMaterial(mesh);
            mesh.material = mesh._originalMaterial;
          }
        });
      }
    };
  }, []);

  useEffect(() => {
    if (!groupRef.current) return;
    const targetMatKey = targetMaterial || 'e7fedd2cefc789ae4070';

    if (screenTex) {
      const scaleX = textureScaleX !== undefined ? textureScaleX : 1.0;
      const scaleY = textureScaleY !== undefined ? textureScaleY : 1.0;
      const offX = textureOffsetX !== undefined ? textureOffsetX : 0.0;
      const offY = textureOffsetY !== undefined ? textureOffsetY : 0.0;

      if (textureFit === 'cover' || textureFit === 'contain') {
        const aspectScreen = 0.46;
        const img = screenTex.image as { width: number; height: number } | undefined;
        let aspectImage = img && img.height ? (img.width / img.height) : 1;
        if (aspectImage <= 0 || !Number.isFinite(aspectImage)) {
          aspectImage = 1;
        }
        
        screenTex.wrapS = ClampToEdgeWrapping;
        screenTex.wrapT = ClampToEdgeWrapping;
        
        let repX = 1;
        let repY = 1;

        if (textureFit === 'cover') {
          if (aspectImage > aspectScreen) {
            repX = aspectScreen / aspectImage;
            repY = 1;
          } else {
            repX = 1;
            repY = aspectImage / aspectScreen;
          }
        } else {
          if (aspectImage > aspectScreen) {
            repX = 1;
            repY = aspectImage / aspectScreen;
          } else {
            repX = aspectScreen / aspectImage;
            repY = 1;
          }
        }

        const finalRepX = repX * scaleX;
        const finalRepY = repY * scaleY;

        screenTex.repeat.set(finalRepX, finalRepY);
        screenTex.offset.set((1 - finalRepX) / 2 + offX, (1 - finalRepY) / 2 + offY);
      } else {
        if (textureRepeat) {
          screenTex.wrapS = RepeatWrapping;
          screenTex.wrapT = RepeatWrapping;
          screenTex.repeat.set(textureScale * scaleX, textureScale * scaleY);
          screenTex.offset.set(offX, offY);
        } else {
          screenTex.wrapS = ClampToEdgeWrapping;
          screenTex.wrapT = ClampToEdgeWrapping;
          screenTex.repeat.set(scaleX, scaleY);
          screenTex.offset.set((1 - scaleX) / 2 + offX, (1 - scaleY) / 2 + offY);
        }
      }
      screenTex.needsUpdate = true;
    }

    groupRef.current.traverse((child) => {
      const mesh = child as CustomMesh;
      if (mesh.isMesh) {
        if (!mesh._originalMaterial) {
          mesh._originalMaterial = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
        }
        
        const originalMat = mesh._originalMaterial;
        const currentMat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;

        if (originalMat?.name === targetMatKey || currentMat?.name === targetMatKey) {
          const mat = originalMat ? (originalMat as MeshStandardMaterial).clone() : new MeshStandardMaterial();
          mat.side = DoubleSide;
          if (screenTex) {
            mat.map = screenTex;
            if (mat.color) {
              mat.color.setRGB(1, 1, 1);
            }
            if (mat.emissive) {
              mat.emissive.setRGB(0, 0, 0);
            }
          }
          mat.transparent = true;
          mat.opacity = materialOpacity;
          mat.roughness = materialRoughness;
          mat.needsUpdate = true;
          disposeClonedMaterial(mesh);
          mesh.material = mat;
        } else {
          const isBody = colorTargetMaterial 
            ? (originalMat?.name === colorTargetMaterial)
            : (originalMat?.name === 'b4ad12de1fcbdd61166e' || 
               originalMat?.name === '82823ff934002f16e6e0' ||
               originalMat?.name === 'a86dab30a71ca989ac8c' ||
               originalMat?.name === 'ec12d37933cc378c1226' ||
               originalMat?.name === '25fa7b29639901e1f310');
                          
          if (isBody && color && originalMat) {
            const mat = (originalMat as MeshStandardMaterial).clone();
            mat.color.set(color);
            mat.needsUpdate = true;
            disposeClonedMaterial(mesh);
            mesh.material = mat;
          } else {
            if (originalMat && mesh.material !== originalMat) {
              disposeClonedMaterial(mesh);
              mesh.material = originalMat;
            }
          }
        }
      }
    });
  }, [materials, screenTex, targetMaterial, textureRepeat, textureScale, textureScaleX, textureScaleY, textureOffsetX, textureOffsetY, materialOpacity, materialRoughness, textureFit, color, colorTargetMaterial]);

  return (
    <group 
      ref={groupRef} 
      {...props} 
      dispose={null}
    >
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <mesh geometry={nodes.Object_12.geometry} material={materials.d79c406d92ac2ea2b462} />
          <mesh geometry={nodes.Object_14.geometry} material={materials['8ed052ed6d3cd71ab5e3']} />
          <mesh geometry={nodes.Object_16.geometry} material={materials['5155c9eac3acd76d34a9']} />
          <mesh geometry={nodes.Object_18.geometry} material={materials['4130c6244c49c5d5712e']} />
          <mesh geometry={nodes.Object_20.geometry} material={materials.a18b462c494e4fd29b4b} />
          <mesh geometry={nodes.Object_23.geometry} material={materials.dee5a626f928a5fa4c28} />
          <mesh geometry={nodes.Object_25.geometry} material={materials.e73cdd81f0248824c66f} />
          <mesh geometry={nodes.Object_27.geometry} material={materials['5d66e4713803a9e0ad46']} />
          <mesh geometry={nodes.Object_29.geometry} material={materials['3b9594ccffa1d862f699']} />
          <mesh geometry={nodes.Object_31.geometry} material={materials['3a020e0705c66463c666']} />
          <mesh geometry={nodes.Object_33.geometry} material={materials['8293fe999d10eb51dc07']} />
          <mesh geometry={nodes.Object_36.geometry} material={materials.b23162de4d8409eb15f1} />
          <mesh geometry={nodes.Object_38.geometry} material={materials.e7fedd2cefc789ae4070} />
          <mesh geometry={nodes.Object_40.geometry} material={materials.cf3bfd3f874c6277f037} />
          <mesh geometry={nodes.Object_42.geometry} material={materials['483cd8d2505fcf4cc33c']} />
          <mesh geometry={nodes.Object_44.geometry} material={materials['13fa87e9b9ea638526bb']} />
          <mesh geometry={nodes.Object_46.geometry} material={materials.cecc91181f1dafcc19fa} />
          <mesh geometry={nodes.Object_48.geometry} material={materials['2df164b7997e629e4d7e']} />
          <mesh geometry={nodes.Object_50.geometry} material={materials['103fc094f5cdada7aa57']} />
          <mesh geometry={nodes.Object_52.geometry} material={materials['25fa7b29639901e1f310']} />
          <mesh geometry={nodes.Object_54.geometry} material={materials['299a045923a299d97c82']} />
          <mesh geometry={nodes.Object_57.geometry} material={materials['82823ff934002f16e6e0']} position={[0, 0, 0.037]} />
          <mesh geometry={nodes.Object_59.geometry} material={materials.b4ad12de1fcbdd61166e} />
          <mesh geometry={nodes.Object_62.geometry} material={materials.ec12d37933cc378c1226} />
          <mesh geometry={nodes.Object_65.geometry} material={materials.bfb52a03e58fd454437d} />
          <mesh geometry={nodes.Object_67.geometry} material={materials['906edd797edf30e1b5ca']} />
          <mesh geometry={nodes.Object_70.geometry} material={materials.c306087c056eb775dddc} />
          <mesh geometry={nodes.Object_72.geometry} material={materials['4a6c96a0e91c63810afa']} />
          <mesh geometry={nodes.Object_74.geometry} material={materials['4e2775e8ab652e8ec892']} />
          <mesh geometry={nodes.Object_77.geometry} material={materials.c1f38c49c59514a1f2d9} />
          <mesh geometry={nodes.Object_80.geometry} material={materials.b8c5608ba04260006bf0} />
          <mesh geometry={nodes.Object_82.geometry} material={materials['091912dc178e0b223122']} />
          <mesh geometry={nodes.Object_84.geometry} material={materials['6a2b4bcac74a0306e361']} />
          <mesh geometry={nodes.Object_86.geometry} material={materials.f960f58dcaeee45e59c1} />
          <mesh geometry={nodes.Object_88.geometry} material={materials['50c2259ef1b62ea11389']} />
          <mesh geometry={nodes.Object_90.geometry} material={materials['994433e619f1f1513042']} />
          <mesh geometry={nodes.Object_92.geometry} material={materials['16d76ca3cbeebab956f0']} />
          <mesh geometry={nodes.Object_94.geometry} material={materials['15e105904fe114289c62']} />
          <mesh geometry={nodes.Object_96.geometry} material={materials.a86dab30a71ca989ac8c} />
          <mesh geometry={nodes.Object_98.geometry} material={materials.a86dab30a71ca989ac8c} />
          <mesh geometry={nodes.Object_100.geometry} material={materials.a86dab30a71ca989ac8c} />
        </group>
      </group>
    </group>
  );
});

export { IphoneModel as Model };
export default IphoneModel;

useGLTF.preload('/models/iphone_16_-_free.glb');
