import { create } from 'zustand';
import { createCameraSlice } from './slices/createCameraSlice';
import { createUISlice } from './slices/createUISlice';
import { createTilesSlice } from './slices/createTilesSlice';
import type { PortfolioStore, CameraSlice, UISlice, TilesSlice, Tile } from './types';

export type { PortfolioStore, CameraSlice, UISlice, TilesSlice, Tile };

export const usePortfolioStore = create<PortfolioStore>()((...a) => ({
  ...createCameraSlice(...a),
  ...createUISlice(...a),
  ...createTilesSlice(...a),
}));

export default usePortfolioStore;
