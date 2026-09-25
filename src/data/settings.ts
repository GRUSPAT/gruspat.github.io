import type { CameraSettingsPayload, IntroSettingsPayload } from '../store/types';

export interface GlobalSettings {
  activeLightType: string;
  activeFilter: string;
  useGoboTexture: boolean;
  goboIntensity: number;
  goboScale: number;
  cameraSettings: CameraSettingsPayload;
  introSettings: IntroSettingsPayload;
}

export const globalSettings: GlobalSettings = {
  activeLightType: 'gobos',
  activeFilter: '001.png',
  useGoboTexture: true,
  goboIntensity: 6,
  goboScale: 1,
  cameraSettings: {
    activeCameraGrid: [1, 1],
    cameraHeight: 18,
    cameraFov: 50,
  },
  introSettings: {
    animDuration: 1,
    animEase: 'back.out(1.5)',
    introDuration: 2.2,
    introDelay: 1.5,
    introEase: 'power3.inOut',
    introCameraHeight: 42,
    introCameraFov: 60,
    introZoomToTile: true,
    introDropHeight: 0.3,
  },
};
