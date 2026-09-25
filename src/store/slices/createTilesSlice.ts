import type { StateCreator } from 'zustand';
import { sectionTilesMap } from '../../data';
import type { PortfolioStore, TilesSlice, Tile } from '../types';

const SECTIONS = ['hero', 'projects', 'achievements', 'hobby', 'contact'] as const;

export const createTilesSlice: StateCreator<PortfolioStore, [], [], TilesSlice> = (set, get) => ({
  tiles: [],
  tilesLoaded: false,
  draggingTileId: null,

  setDraggingTileId: (id: string | null) => set({ draggingTileId: id }),

  updateTileGridPos: (id: string, gridPos: [number, number]) => {
    set((state) => ({
      tiles: state.tiles.map((tile) => (tile.id === id ? { ...tile, gridPos } : tile))
    }));
    return gridPos;
  },

  loadTiles: async () => {
    try {
      const allTiles: Tile[] = [];

      SECTIONS.forEach((sec) => {
        const rawTiles = sectionTilesMap[sec] || [];
        const processed = rawTiles.map((t) => ({
          ...t,
          section: sec,
          defaultGridPos: (t.gridPos ? [t.gridPos[0], t.gridPos[1]] : [0, 0]) as [number, number],
          defaultCurrentY: t.currentY !== undefined ? t.currentY : 0.01
        }));
        allTiles.push(...processed);
      });

      set({
        tiles: allTiles,
        tilesLoaded: true
      });

      const totalDuration = (get().introDuration || 2.2) * 1000 + 2500;
      setTimeout(() => {
        set({ isIntroActive: false });
      }, totalDuration);
    } catch (e) {
      console.error('Failed to load section tiles from data:', e);
      set({ tilesLoaded: true });
    }
  },

  changeSection: async (sectionName: string) => {
    if (get().isTransitioning) return;
    if (get().activeSection === sectionName) return;

    set({ isTransitioning: true });

    const restoredTiles = get().tiles.map((tile) => {
      if ((tile.section || 'hero') === sectionName && tile.defaultGridPos) {
        return {
          ...tile,
          gridPos: [tile.defaultGridPos[0], tile.defaultGridPos[1]] as [number, number],
          currentY: tile.defaultCurrentY !== undefined ? tile.defaultCurrentY : tile.currentY
        };
      }
      return tile;
    });

    set({
      tiles: restoredTiles,
      activeSection: sectionName,
      isIntroActive: true
    });

    const targetSectionTiles = restoredTiles.filter(
      (tile) => (tile.section || 'hero') === sectionName
    );
    const tileCount = targetSectionTiles.length;
    const transitionMs = Math.max(900, Math.round((0.85 + Math.max(0, tileCount - 1) * 0.06 + 0.15) * 1000));
    setTimeout(() => {
      set({ isIntroActive: false, isTransitioning: false });
    }, transitionMs);
  },
});
