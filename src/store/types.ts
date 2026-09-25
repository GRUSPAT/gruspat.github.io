export interface TileClickAction {
  type?: string;
  url?: string;
  target?: string;
  [key: string]: any;
}

export interface Tile {
  id: string;
  gridPos?: [number, number];
  defaultGridPos?: [number, number];
  defaultCurrentY?: number;
  size?: number;
  color?: string;
  iconColor?: string;
  materialType?: string;
  svgPath?: string | null;
  imagePath?: string | null;
  iconScale?: number;
  clickAction?: TileClickAction | any;
  modelRotation?: [number, number, number];
  label?: string;
  tag?: string | null;
  tags?: string[];
  section?: string;
  isInstax?: boolean;
  isRectanglePhoto?: boolean;
  isRoundedRectanglePhoto?: boolean;
  isFlatText?: boolean;
  isModel?: boolean;
  modelType?: string;
  targetMaterial?: string;
  textureScale?: number;
  textureRepeat?: boolean;
  materialOpacity?: number;
  materialRoughness?: number;
  textureFit?: string;
  currentY?: number;
  rectangleRotationY?: number;
  roundedRectangleRotationY?: number;
  roundedRectangleCornerRadius?: number;
  text?: string;
  textRotationY?: number;
  isLocked?: boolean;
  disablePreview?: boolean;
  [key: string]: any;
}

export interface CameraSettingsPayload {
  activeCameraGrid?: [number, number];
  cameraHeight?: number;
  cameraFov?: number;
}

export interface IntroSettingsPayload {
  animDuration?: number;
  animEase?: string;
  introDuration?: number;
  introDelay?: number;
  introEase?: string;
  introCameraHeight?: number;
  introCameraFov?: number;
  introZoomToTile?: boolean;
  introDropHeight?: number;
}

export interface CameraSlice {
  activeCameraGrid: [number, number];
  cameraHeight: number;
  cameraFov: number;
  animDuration: number;
  animEase: string;
  introDuration: number;
  introDelay: number;
  introEase: string;
  introTrigger: number;
  introCameraHeight: number;
  introCameraFov: number;
  introZoomToTile: boolean;
  introDropHeight: number;
  enableDropAnimation: boolean;
  isIntroActive: boolean;
  cameraZoomedOut: boolean;

  setCameraGrid: (col: number, row: number) => void;
}

export interface UISlice {
  dragStyle: string;
  liftHeight: number;
  previewTile: Tile | null;
  assetsLoaded: boolean;
  loadingProgress: number;
  activeLightType: string;
  activeFilter: string;
  useGoboTexture: boolean;
  goboIntensity: number;
  goboScale: number;
  activeSection: string;
  isTransitioning: boolean;
  spinTrigger: number;

  setPreviewTile: (previewTile: Tile | null) => void;
  setAssetsLoaded: (assetsLoaded: boolean) => void;
  setLoadingProgress: (loadingProgress: number) => void;
  triggerGlobalSpin: () => void;
}

export interface TilesSlice {
  tiles: Tile[];
  tilesLoaded: boolean;
  draggingTileId: string | null;

  setDraggingTileId: (id: string | null) => void;
  updateTileGridPos: (id: string, gridPos: [number, number]) => [number, number];
  loadTiles: () => Promise<void>;
  changeSection: (sectionName: string) => Promise<void>;
}

export type PortfolioStore = CameraSlice & UISlice & TilesSlice;
