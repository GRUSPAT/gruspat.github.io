import type { Tile } from '../store/types';
import type {
  BaseTileConfig,
  ModelTileConfig,
  InstaxTileConfig,
  RectanglePhotoTileConfig,
  TextTileConfig,
} from './types';

export type {
  BaseTileConfig,
  ModelTileConfig,
  InstaxTileConfig,
  RectanglePhotoTileConfig,
  TextTileConfig,
};

export function defineModelTile(config: ModelTileConfig): Tile {
  const { gridPos, currentY = 0.01, defaultGridPos, defaultCurrentY, tag, tags, ...rest } = config;
  const resolvedTag = tag ?? (tags && tags.length > 0 ? tags[0] : undefined);
  const resolvedTags = tags ?? (resolvedTag ? [resolvedTag] : undefined);

  return {
    ...rest,
    gridPos,
    currentY,
    defaultGridPos: defaultGridPos ?? gridPos,
    defaultCurrentY: defaultCurrentY ?? currentY,
    materialType: 'customModel',
    isModel: true,
    tag: resolvedTag,
    tags: resolvedTags,
  };
}

export function defineInstaxTile(config: InstaxTileConfig): Tile {
  const { gridPos, currentY = 0.01, defaultGridPos, defaultCurrentY, tag, tags, color = '#f5f5f7', iconScale = 1, ...rest } = config;
  const resolvedTag = tag ?? (tags && tags.length > 0 ? tags[0] : undefined);
  const resolvedTags = tags ?? (resolvedTag ? [resolvedTag] : undefined);

  return {
    ...rest,
    color,
    iconScale,
    gridPos,
    currentY,
    defaultGridPos: defaultGridPos ?? gridPos,
    defaultCurrentY: defaultCurrentY ?? currentY,
    materialType: 'instax',
    isInstax: true,
    tag: resolvedTag,
    tags: resolvedTags,
  };
}

export function defineRectanglePhotoTile(config: RectanglePhotoTileConfig): Tile {
  const { gridPos, currentY = 0.01, defaultGridPos, defaultCurrentY, tag, tags, color = '#ffffff', roundedRectangleCornerRadius, ...rest } = config;
  const resolvedTag = tag ?? (tags && tags.length > 0 ? tags[0] : undefined);
  const resolvedTags = tags ?? (resolvedTag ? [resolvedTag] : undefined);
  const isRounded = Boolean(roundedRectangleCornerRadius !== undefined && roundedRectangleCornerRadius > 0);

  return {
    ...rest,
    color,
    gridPos,
    currentY,
    defaultGridPos: defaultGridPos ?? gridPos,
    defaultCurrentY: defaultCurrentY ?? currentY,
    roundedRectangleCornerRadius,
    materialType: isRounded ? 'roundedRectanglePhoto' : 'rectanglePhoto',
    isRectanglePhoto: !isRounded,
    isRoundedRectanglePhoto: isRounded,
    tag: resolvedTag,
    tags: resolvedTags,
  };
}

export function defineTextTile(config: TextTileConfig): Tile {
  const {
    gridPos,
    currentY = 0.01,
    defaultGridPos,
    defaultCurrentY,
    color = '#ffffff',
    size = 2,
    disablePreview = true,
    isLocked = false,
    textRotationY = 0,
    text,
    clickAction = { type: 'none' },
    ...rest
  } = config;

  return {
    ...rest,
    text,
    label: text,
    color,
    size,
    disablePreview,
    isLocked,
    textRotationY,
    clickAction,
    gridPos,
    currentY,
    defaultGridPos: defaultGridPos ?? gridPos,
    defaultCurrentY: defaultCurrentY ?? currentY,
    materialType: 'flatText',
    isFlatText: true,
  };
}
