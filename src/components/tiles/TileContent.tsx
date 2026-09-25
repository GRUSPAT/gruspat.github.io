import React, { memo } from 'react';
import type { Texture } from 'three';
import type { Tile } from '../../store/types';
import { InstaxPhoto } from './InstaxPhoto';
import { RectanglePhoto } from './RectanglePhoto';
import { ModelTile } from '../models/ModelTile';

export type TileType =
  | 'instax'
  | 'rectanglePhoto'
  | 'roundedRectanglePhoto'
  | 'model';

export function getTileType(tile?: Tile | null): TileType | null {
  if (!tile) return null;
  if (tile.isInstax) return 'instax';
  if (tile.isRectanglePhoto) return 'rectanglePhoto';
  if (tile.isRoundedRectanglePhoto) return 'roundedRectanglePhoto';
  if (tile.isModel) return 'model';
  return null;
}

export interface TileContentProps {
  tile: Tile;
  isPreview?: boolean;
  imageTexture?: Texture | null;
}

const TILE_REGISTRY: Record<TileType, (props: TileContentProps) => React.ReactNode> = {
  instax: ({ tile, isPreview }) => (
    <group position={isPreview ? [0, -0.004, 0] : [0, 0, 0]}>
      <InstaxPhoto
        size={tile.size}
        color={tile.color}
        label={tile.label}
        imagePath={tile.imagePath}
        isPreview={isPreview}
      />
    </group>
  ),

  rectanglePhoto: ({ tile, isPreview, imageTexture }) => (
    <RectanglePhoto
      size={tile.size}
      color={tile.color}
      imageTexture={imageTexture}
      isRounded={Boolean(tile.roundedRectangleCornerRadius && tile.roundedRectangleCornerRadius > 0)}
      cornerRadius={tile.roundedRectangleCornerRadius ?? 0}
      isPreview={isPreview}
    />
  ),

  roundedRectanglePhoto: ({ tile, isPreview, imageTexture }) => (
    <RectanglePhoto
      size={tile.size}
      color={tile.color}
      imageTexture={imageTexture}
      isRounded
      cornerRadius={tile.roundedRectangleCornerRadius ?? 0.05}
      isPreview={isPreview}
    />
  ),

  model: ({ tile, isPreview }) => (
    <ModelTile
      tile={tile}
      isPreview={isPreview}
    />
  ),
};

export const TileContent = memo(({
  tile,
  isPreview = false,
  imageTexture = null,
}: TileContentProps) => {
  const type = getTileType(tile);
  if (!type) return null;

  const Renderer = TILE_REGISTRY[type];
  return (
    <Renderer
      tile={tile}
      isPreview={isPreview}
      imageTexture={imageTexture}
    />
  );
});

