import { Suspense, useEffect, useRef, useMemo } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { PCFShadowMap, type PerspectiveCamera } from 'three';
import { useProgress, Preload } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import gsap from 'gsap';

import { usePortfolioStore } from '../../store/usePortfolioStore';
import { CuttingMatGrid } from './CuttingMatGrid';
import { DraggableTile } from './DraggableTile';
import { DynamicLighting } from './DynamicLighting';

function LoaderBridge() {
  const { active, progress } = useProgress();
  const tilesLoaded = usePortfolioStore((state) => state.tilesLoaded);
  const setAssetsLoaded = usePortfolioStore((state) => state.setAssetsLoaded);
  const setLoadingProgress = usePortfolioStore((state) => state.setLoadingProgress);
  const { gl, scene, camera } = useThree();
  const compiledRef = useRef<boolean>(false);

  useEffect(() => {
    if (!tilesLoaded) {
      setLoadingProgress(20);
      return;
    }

    const currentProgress = Math.max(20, Math.round(progress));
    setLoadingProgress(currentProgress);

    if (progress === 100 && !active && tilesLoaded) {
      if (!compiledRef.current) {
        compiledRef.current = true;
        try {
          gl.compile(scene, camera);
        } catch (err) {
          console.warn('WebGL precompile skipped:', err);
        }
      }

      const timer = setTimeout(() => {
        setAssetsLoaded(true);
      }, 700);

      return () => clearTimeout(timer);
    }
  }, [progress, active, tilesLoaded, gl, scene, camera, setAssetsLoaded, setLoadingProgress]);

  return null;
}

interface CameraAnimObj {
  x: number;
  y: number;
  z: number;
  tx: number;
  tz: number;
  fov: number;
}

const COLS_X = [-18.333, 0.0, 18.333];
const ROWS_Z = [-12.833, 0.5, 13.833];

function CameraController() {
  const activeCameraGrid = usePortfolioStore((state) => state.activeCameraGrid || [1, 1]);
  const cameraHeight = usePortfolioStore((state) => state.cameraHeight);
  const cameraFov = usePortfolioStore((state) => state.cameraFov);
  const animDuration = usePortfolioStore((state) => state.animDuration);
  const animEase = usePortfolioStore((state) => state.animEase);
  const introDuration = usePortfolioStore((state) => state.introDuration);
  const introDelay = usePortfolioStore((state) => state.introDelay);
  const introEase = usePortfolioStore((state) => state.introEase);
  const introCameraHeight = usePortfolioStore((state) => state.introCameraHeight);
  const introCameraFov = usePortfolioStore((state) => state.introCameraFov);
  const assetsLoaded = usePortfolioStore((state) => state.assetsLoaded);

  const { camera, size } = useThree();
  const perspCamera = camera as PerspectiveCamera;

  const aspect = size.width / (size.height || 1);
  const heightMultiplier = aspect < 1.0 ? 1.0 / aspect : 1.0;

  const playedIntroRef = useRef<boolean>(false);
  const lastTargetXRef = useRef<number>(0);
  const lastTargetZRef = useRef<number>(0.5);
  const activeTweenRef = useRef<gsap.core.Tween | null>(null);
  const resizeTweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    return () => {
      activeTweenRef.current?.kill();
      resizeTweenRef.current?.kill();
    };
  }, []);

  useEffect(() => {
    if (!assetsLoaded || !playedIntroRef.current) return;

    const dynamicTargetY = cameraHeight * heightMultiplier;

    resizeTweenRef.current?.kill();
    resizeTweenRef.current = gsap.to(perspCamera.position, {
      y: dynamicTargetY,
      duration: 0.2,
      ease: 'power2.out',
      onUpdate: () => {
        perspCamera.updateProjectionMatrix();
      },
    });
  }, [heightMultiplier, cameraHeight, assetsLoaded, perspCamera]);

  const gridCol = activeCameraGrid[0] ?? 1;
  const gridRow = activeCameraGrid[1] ?? 1;

  useEffect(() => {
    if (!assetsLoaded) return;

    const targetX = COLS_X[gridCol] ?? 0;
    const targetZ = ROWS_Z[gridRow] ?? 0.5;
    const targetY = cameraHeight * heightMultiplier;
    const targetIntroY = introCameraHeight * heightMultiplier;

    perspCamera.up.set(0, 0, -1);

    if (!playedIntroRef.current) {
      playedIntroRef.current = true;

      perspCamera.position.set(0, targetIntroY, 5);
      perspCamera.lookAt(0, 0, 0.5);
      perspCamera.fov = introCameraFov;
      perspCamera.updateProjectionMatrix();

      const animObj: CameraAnimObj = {
        x: 0,
        y: targetIntroY,
        z: 5,
        tx: 0,
        tz: 0.5,
        fov: introCameraFov,
      };

      activeTweenRef.current?.kill();
      activeTweenRef.current = gsap.to(animObj, {
        x: targetX,
        y: targetY,
        z: targetZ,
        tx: targetX,
        tz: targetZ,
        fov: cameraFov,
        duration: introDuration,
        ease: introEase,
        delay: introDelay,
        onUpdate: () => {
          perspCamera.position.set(animObj.x, animObj.y, animObj.z);
          perspCamera.lookAt(animObj.tx, 0, animObj.tz);
          perspCamera.fov = animObj.fov;
          perspCamera.updateProjectionMatrix();
          lastTargetXRef.current = animObj.tx;
          lastTargetZRef.current = animObj.tz;
        },
      });
      return;
    }

    const animObj: CameraAnimObj = {
      x: perspCamera.position.x,
      y: perspCamera.position.y,
      z: perspCamera.position.z,
      tx: lastTargetXRef.current,
      tz: lastTargetZRef.current,
      fov: perspCamera.fov,
    };

    activeTweenRef.current?.kill();
    activeTweenRef.current = gsap.to(animObj, {
      x: targetX,
      y: targetY,
      z: targetZ,
      tx: targetX,
      tz: targetZ,
      fov: cameraFov,
      duration: animDuration,
      ease: animEase,
      onUpdate: () => {
        perspCamera.position.set(animObj.x, animObj.y, animObj.z);
        perspCamera.lookAt(animObj.tx, 0, animObj.tz);
        perspCamera.fov = animObj.fov;
        perspCamera.updateProjectionMatrix();
        lastTargetXRef.current = animObj.tx;
        lastTargetZRef.current = animObj.tz;
      },
    });
  }, [
    gridCol,
    gridRow,
    assetsLoaded,
    perspCamera,
    cameraHeight,
    cameraFov,
    animDuration,
    animEase,
    introCameraHeight,
    introCameraFov,
    introDuration,
    introEase,
    introDelay,
    heightMultiplier,
  ]);

  return null;
}

export const SceneCanvas = () => {
  const tiles = usePortfolioStore((state) => state.tiles);
  const activeSection = usePortfolioStore((state) => state.activeSection || 'hero');
  const cameraFov = usePortfolioStore((state) => state.cameraFov);
  const assetsLoaded = usePortfolioStore((state) => state.assetsLoaded);

  const staggerIndexMap = useMemo(() => {
    const map = new Map<string, number>();
    let idx = 0;
    for (const t of tiles) {
      if ((t.section || 'hero') === activeSection) {
        map.set(t.id, idx++);
      }
    }
    return map;
  }, [tiles, activeSection]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', zIndex: 1 }}>
      <Canvas
        dpr={[1, 2]}
        shadows={{ type: PCFShadowMap }}
        camera={{ position: [0, 42, 5], fov: cameraFov }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        <color
          attach="background"
          args={['#0a0a0c']}
        />

        {!assetsLoaded && <LoaderBridge />}
        <CameraController />

        <Suspense fallback={null}>
          <DynamicLighting />

          <Physics gravity={[0, -9.81, 0]}>
            <CuttingMatGrid />

            {tiles.map((tile) => {
              const isVisible = (tile.section || 'hero') === activeSection;
              const staggerIndex = isVisible ? (staggerIndexMap.get(tile.id) ?? 0) : 0;
              return (
                <DraggableTile
                  key={tile.id}
                  tile={tile}
                  visible={isVisible}
                  staggerIndex={staggerIndex}
                />
              );
            })}
          </Physics>

          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
};
