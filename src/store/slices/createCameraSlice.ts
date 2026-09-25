import type { StateCreator } from 'zustand';
import type { PortfolioStore, CameraSlice } from '../types';
import { globalSettings } from '../../data';

export const createCameraSlice: StateCreator<PortfolioStore, [], [], CameraSlice> = (set) => {
  const { cameraSettings, introSettings } = globalSettings;

  return {
    activeCameraGrid: (cameraSettings?.activeCameraGrid as [number, number]) || [1, 1],
    cameraHeight: cameraSettings?.cameraHeight ?? 18,
    cameraFov: cameraSettings?.cameraFov ?? 50,
    animDuration: introSettings?.animDuration ?? 1.0,
    animEase: introSettings?.animEase || 'back.out(1.5)',
    introDuration: introSettings?.introDuration ?? 2.2,
    introDelay: introSettings?.introDelay ?? 1.5,
    introEase: introSettings?.introEase || 'power3.inOut',
    introTrigger: 0,
    introCameraHeight: introSettings?.introCameraHeight ?? 42,
    introCameraFov: introSettings?.introCameraFov ?? 60,
    introZoomToTile: introSettings?.introZoomToTile ?? true,
    introDropHeight: introSettings?.introDropHeight ?? 0.3,
    enableDropAnimation: true,
    isIntroActive: true,
    cameraZoomedOut: false,

    setCameraGrid: (col: number, row: number) => set({ activeCameraGrid: [col, row], cameraZoomedOut: false }),
  };
};
