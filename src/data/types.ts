import type { TileClickAction } from '../store/types';

export type TagId =
  | 'certification'
  | 'graphicDesign'
  | 'hackathon'
  | 'hoodie'
  | 'mgmg'
  | 'photogrammetry'
  | 'tarnow1000'
  | 'thesis';

export interface ScreenItemObject {
  path?: string;
  url?: string;
  src?: string;
  label?: string;
}

export type ScreenItem = string | ScreenItemObject;

export interface TagInfo {
  tag: TagId | string;
  title: string;
  description: string;
  icon?: string;
  screens?: ScreenItem[];
}

export interface BaseTileConfig {
  id: string;
  gridPos: [number, number];
  currentY?: number;
  defaultGridPos?: [number, number];
  defaultCurrentY?: number;
  size?: number;
  color?: string;
  section?: string;
  tag?: TagId | string;
  tags?: (TagId | string)[];
  isLocked?: boolean;
  disablePreview?: boolean;
  clickAction?: TileClickAction;
}

export interface ModelTileConfig extends BaseTileConfig {
  modelType: string;
  modelRotation?: [number, number, number];
  iconScale?: number;
  imagePath?: string;
  targetMaterial?: string;
  textureScale?: number;
  textureRepeat?: boolean;
  materialOpacity?: number;
  materialRoughness?: number;
  textureFit?: string;
  textureScaleX?: number;
  textureScaleY?: number;
  textureOffsetX?: number;
  textureOffsetY?: number;
}

export interface InstaxTileConfig extends BaseTileConfig {
  label?: string;
  imagePath?: string;
  iconScale?: number;
  instaxRotationY?: number;
  snapToGrid?: boolean;
}

export interface RectanglePhotoTileConfig extends BaseTileConfig {
  imagePath?: string;
  rectangleRotationY?: number;
  roundedRectangleRotationY?: number;
  roundedRectangleCornerRadius?: number;
}

export interface TextTileConfig extends BaseTileConfig {
  text: string;
  textRotationY?: number;
}
