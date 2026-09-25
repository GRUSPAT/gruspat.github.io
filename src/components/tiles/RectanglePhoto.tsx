import { useMemo, useEffect, memo } from 'react';
import {
  Shape,
  ShapeGeometry,
  Float32BufferAttribute,
  DoubleSide,
  FrontSide,
  type Texture,
} from 'three';

export interface RectanglePhotoProps {
  size?: number;
  color?: string;
  imageTexture?: Texture | null;
  isPreview?: boolean;
  isRounded?: boolean;
  cornerRadius?: number;
  roundedRectangleCornerRadius?: number;
}

const ISO_ASPECT_RATIO = Math.SQRT2;
const THICKNESS = 0.02;

export const RectanglePhoto = memo(({
  size = 1,
  color = '#ffffff',
  imageTexture = null,
  isPreview = false,
  isRounded = false,
  cornerRadius = 0.05,
  roundedRectangleCornerRadius,
}: RectanglePhotoProps) => {
  const width = size;
  const length = size * ISO_ASPECT_RATIO;
  const buffer = isPreview ? 0 : 0.03;
  const rootOffset = isPreview ? -THICKNESS / 2 : 0;

  const activeRadius = roundedRectangleCornerRadius ?? cornerRadius;
  const isRoundedActive = Boolean(
    isRounded || (roundedRectangleCornerRadius !== undefined && roundedRectangleCornerRadius > 0.001)
  );

  const geometry = useMemo(() => {
    if (!isRoundedActive) return null;

    const s = new Shape();
    const x = -width / 2;
    const y = -length / 2;
    const w = width;
    const h = length;
    const rad = Math.max(0.001, Math.min(activeRadius, w / 2, h / 2));

    s.moveTo(x + rad, y);
    s.lineTo(x + w - rad, y);
    s.quadraticCurveTo(x + w, y, x + w, y + rad);
    s.lineTo(x + w, y + h - rad);
    s.quadraticCurveTo(x + w, y + h, x + w - rad, y + h);
    s.lineTo(x + rad, y + h);
    s.quadraticCurveTo(x, y + h, x, y + h - rad);
    s.lineTo(x, y + rad);
    s.quadraticCurveTo(x, y, x + rad, y);

    const geom = new ShapeGeometry(s);
    const pos = geom.attributes.position;
    const uvs: number[] = [];
    for (let i = 0; i < pos.count; i++) {
      const px = pos.getX(i);
      const py = pos.getY(i);
      const u = (px + width / 2) / width;
      const v = (py + length / 2) / length;
      uvs.push(u, v);
    }
    geom.setAttribute('uv', new Float32BufferAttribute(uvs, 2));
    geom.attributes.uv.needsUpdate = true;

    return geom;
  }, [width, length, isRoundedActive, activeRadius]);

  useEffect(() => {
    return () => {
      geometry?.dispose();
    };
  }, [geometry]);

  if (isRoundedActive && geometry) {
    return (
      <group position={[0, rootOffset, 0]}>
        <mesh
          castShadow
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, buffer, 0]}
          geometry={geometry}
        >
          <meshStandardMaterial color={color || '#ffffff'} roughness={0.8} side={DoubleSide} />
        </mesh>

        {imageTexture && (
          <mesh
            geometry={geometry}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, buffer + 0.0005, 0]}
          >
            <meshStandardMaterial
              map={imageTexture}
              roughness={0.2}
              side={FrontSide}
              polygonOffset
              polygonOffsetFactor={-1}
              polygonOffsetUnits={-1}
            />
          </mesh>
        )}
      </group>
    );
  }

  return (
    <group position={[0, rootOffset, 0]}>
      <mesh
        castShadow
        position={[0, THICKNESS / 2 + buffer, 0]}
      >
        <boxGeometry args={[width, THICKNESS, length]} />
        <meshStandardMaterial color={color || '#ffffff'} roughness={0.8} />
      </mesh>

      {imageTexture && (
        <mesh
          position={[0, THICKNESS + buffer + 0.001, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[width - 0.005, length - 0.005]} />
          <meshStandardMaterial
            map={imageTexture}
            roughness={0.2}
            side={FrontSide}
            polygonOffset
            polygonOffsetFactor={-1}
            polygonOffsetUnits={-1}
          />
        </mesh>
      )}
    </group>
  );
});

