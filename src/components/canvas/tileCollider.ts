import type { Tile } from '../../store/types';
import { getRotatedBoxExtents } from '../../utils/boxExtents';

export interface TileColliderConfig {
  args: [number, number, number];
  position: [number, number, number];
}

export const getTileColliderConfig = (tile: Tile): TileColliderConfig => {
  const size = tile.size ?? 1;

  if (tile.isFlatText) {
    const str = tile.text || 'TEXT';
    const approxW = Math.max(0.5, (str.length * (size * 0.22)) / 2);
    const approxH = Math.max(0.2, (size * 0.4) / 2);
    return {
      args: [approxW, 0.01, approxH],
      position: [0, 0.005, 0],
    };
  }

  if (tile.isModel) {
    const rot = tile.modelRotation || [0, 0, 0];
    const radX = (rot[0] * Math.PI) / 180;
    const radY = (rot[1] * Math.PI) / 180;
    const radZ = (rot[2] * Math.PI) / 180;
    const modelW = 0.35;
    const modelH = tile.modelType === 'head' ? 0.48 : 0.7;
    const modelD = tile.modelType === 'head' ? 0.35 : 0.06;
    const extents = getRotatedBoxExtents(modelW, modelH, modelD, radX, radY, radZ);
    const scale = 2.4 * (tile.iconScale ?? 1);

    return {
      args: [size / 2, (extents.height * scale) / 2, size / 2],
      position: [0, (extents.height * scale) / 2, 0],
    };
  }

  if (tile.isInstax) {
    return {
      args: [size / 2, 0.04, (size * 1.15) / 2],
      position: [0, 0.04, 0],
    };
  }

  if (tile.isRectanglePhoto || tile.isRoundedRectanglePhoto) {
    return {
      args: [size / 2, 0.04, (size * 1.4142) / 2],
      position: [0, 0.04, 0],
    };
  }

  return {
    args: [size / 2, 0.04, size / 2],
    position: [0, 0.04, 0],
  };
};
