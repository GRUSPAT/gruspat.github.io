import type { StateCreator } from 'zustand';
import type { PortfolioStore, UISlice, Tile } from '../types';
import { globalSettings } from '../../data';

export const createUISlice: StateCreator<PortfolioStore, [], [], UISlice> = (set) => ({
  dragStyle: 'lift',
  liftHeight: 0.3,
  previewTile: null,
  assetsLoaded: false,
  loadingProgress: 0,
  activeLightType: globalSettings.activeLightType || 'gobos',
  activeFilter: globalSettings.activeFilter || '001.png',
  useGoboTexture: globalSettings.useGoboTexture !== undefined ? globalSettings.useGoboTexture : true,
  goboIntensity: globalSettings.goboIntensity ?? 6,
  goboScale: globalSettings.goboScale ?? 1,
  activeSection: 'hero',
  isTransitioning: false,
  spinTrigger: 0,

  setPreviewTile: (previewTile: Tile | null) => set({ previewTile }),
  setAssetsLoaded: (assetsLoaded: boolean) => set({ assetsLoaded }),
  setLoadingProgress: (loadingProgress: number) => set({ loadingProgress }),
  triggerGlobalSpin: () => set((state) => ({
    spinTrigger: state.spinTrigger + 1
  })),
});
