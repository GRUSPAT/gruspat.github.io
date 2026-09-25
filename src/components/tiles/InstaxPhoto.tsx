import { useState, useEffect, memo } from 'react';
import {
  TextureLoader,
  SRGBColorSpace,
  LinearFilter,
  ClampToEdgeWrapping,
  FrontSide,
  type Texture,
} from 'three';
import { Text } from '@react-three/drei';
import { getImageUrl } from '../../utils/imageAssets';

export interface InstaxPhotoProps {
  size?: number;
  color?: string;
  label?: string;
  imagePath?: string | null;
  isPreview?: boolean;
}

export const InstaxPhoto = memo(({
  size = 3,
  color = '#f8f8fa',
  label = 'Memory',
  imagePath,
  isPreview = false,
}: InstaxPhotoProps) => {
  const [photoTex, setPhotoTex] = useState<Texture | null>(null);

  useEffect(() => {
    let active = true;
    let loadedTexture: Texture | null = null;

    if (!imagePath) {
      setPhotoTex(null);
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

        texture.colorSpace = SRGBColorSpace;
        texture.minFilter = LinearFilter;
        texture.needsUpdate = true;
        texture.wrapS = ClampToEdgeWrapping;
        texture.wrapT = ClampToEdgeWrapping;

        const img = texture.image as HTMLImageElement | undefined;
        let imageAspect = img && img.height && img.width ? img.width / img.height : 1.0;
        if (imageAspect <= 0 || !Number.isFinite(imageAspect)) {
          imageAspect = 1.0;
        }

        if (imageAspect > 1.0) {
          texture.repeat.set(1 / imageAspect, 1);
          texture.offset.set((1 - 1 / imageAspect) / 2, 0);
        } else {
          texture.repeat.set(1, imageAspect);
          texture.offset.set(0, (1 - imageAspect) / 2);
        }

        setPhotoTex(texture);
        loadedTexture = texture;
      },
      undefined,
      (err) => {
        console.error('Failed to load Instax texture:', err);
      }
    );

    return () => {
      active = false;
      if (loadedTexture) {
        loadedTexture.dispose();
      }
    };
  }, [imagePath]);

  const L = size * 1.15;
  const width = size - 0.05;
  const thickness = 0.008;
  const photoW = width * 0.86;
  const photoH = photoW;
  const topEdgeZ = -L / 2;
  const photoCenterZ = topEdgeZ + (width * 0.07) + (photoH / 2);
  const buffer = isPreview ? 0 : 0.03;

  return (
    <group>
      <mesh position={[0, thickness / 2 + buffer, 0]} castShadow renderOrder={1}>
        <boxGeometry args={[width, thickness, L]} />
        <meshStandardMaterial 
          color={color} 
          roughness={0.9} 
          metalness={0.0}
          polygonOffset
          polygonOffsetFactor={1}
          polygonOffsetUnits={1}
        />
      </mesh>
      
      <mesh
        position={[0, thickness + 0.005 + buffer, photoCenterZ]}
        rotation={[-Math.PI / 2, 0, 0]}
        castShadow
        renderOrder={2}
      >
        <planeGeometry args={[photoW, photoH]} />
        <meshStandardMaterial 
          key={photoTex ? photoTex.uuid : 'empty'}
          map={photoTex}
          color={photoTex ? '#fff' : '#1a1a1f'}
          roughness={0.12}
          metalness={0.1}
          side={FrontSide}
          polygonOffset
          polygonOffsetFactor={-1}
          polygonOffsetUnits={-1}
          depthWrite={true}
        />
      </mesh>

      <Text
        font="/fonts/Lato-Regular.ttf"
        position={[0, thickness + 0.006 + buffer, L / 2 - (width * 0.16)]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={Math.max(0.08, 0.095 * (size / 3))}
        color="#1d1d21"
        maxWidth={width - 0.1}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
        renderOrder={3}
      >
        {label}
      </Text>
    </group>
  );
});
