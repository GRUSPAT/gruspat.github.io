import { memo } from 'react';
import type { Tile } from '../../store/types';
import { Model as IphoneModel } from './IphoneModel';
import { Model as HeadModel } from './HeadModel';
import { getRotatedBoxExtents } from '../../utils/boxExtents';

export interface ModelTileProps {
  tile: Tile;
  isPreview?: boolean;
}

export const ModelTile = memo(({
  tile,
  isPreview = false,
}: ModelTileProps) => {
  const {
    modelType,
    modelRotation = [0, 0, 0],
    iconScale = 1,
    color,
    imagePath,
    targetMaterial,
    textureRepeat,
    textureScale,
    textureScaleX,
    textureScaleY,
    textureOffsetX,
    textureOffsetY,
    materialOpacity,
    materialRoughness,
    textureFit,
    colorTargetMaterial,
  } = tile;

  const radX = (modelRotation[0] * Math.PI) / 180;
  const radY = (modelRotation[1] * Math.PI) / 180;
  const radZ = (modelRotation[2] * Math.PI) / 180;

  const modelW = 0.35;
  const modelH = modelType === 'head' ? 0.48 : 0.7;
  const modelD = modelType === 'head' ? 0.35 : 0.06;

  let scale: number;
  let position: [number, number, number];

  if (isPreview) {
    scale = modelType === 'head' ? (1.0 * iconScale) : (1.8 * iconScale);
    position = [0, 0, 0];
  } else {
    scale = 2.4 * iconScale;
    const extents = getRotatedBoxExtents(modelW, modelH, modelD, radX, radY, radZ);
    const minY = extents.minY * scale;
    position = [0, -minY, 0];
  }

  return (
    <group
      position={position}
      rotation={[radX, radY, radZ]}
      scale={[scale, scale, scale]}
    >
      {modelType === 'head' ? (
        <HeadModel color={color || '#888888'} />
      ) : (
        <IphoneModel
          imagePath={imagePath}
          targetMaterial={targetMaterial}
          textureRepeat={textureRepeat}
          textureScale={textureScale}
          textureScaleX={textureScaleX}
          textureScaleY={textureScaleY}
          textureOffsetX={textureOffsetX}
          textureOffsetY={textureOffsetY}
          materialOpacity={materialOpacity}
          materialRoughness={materialRoughness}
          textureFit={textureFit}
          color={color}
          colorTargetMaterial={colorTargetMaterial}
        />
      )}

      {!isPreview && (
        <mesh>
          <boxGeometry args={[modelW, modelH, modelD]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      )}
    </group>
  );
});

export default ModelTile;
