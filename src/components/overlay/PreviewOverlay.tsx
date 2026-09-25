import { useMemo, useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { PCFShadowMap, ACESFilmicToneMapping } from 'three';
import { usePortfolioStore } from '../../store/usePortfolioStore';
import type { Tile } from '../../store/types';
import { tagsData } from '../../data';
import { PreviewObject } from '../canvas/PreviewObject';
import { PreviewSidebar } from '../ui/PreviewSidebar';
import { PreviewDock } from '../ui/PreviewDock';
import styles from './PreviewOverlay.module.scss';

export const PreviewOverlay = () => {
  const previewTile = usePortfolioStore((state) => state.previewTile);
  const setPreviewTile = usePortfolioStore((state) => state.setPreviewTile);
  const tiles = usePortfolioStore((state) => state.tiles);

  const [isDescriptionCollapsed, setIsDescriptionCollapsed] = useState(false);

  const currentTag = useMemo(() => {
    if (!previewTile) return null;
    return previewTile.tags?.[0] ?? previewTile.tag ?? (previewTile.modelType === 'head' ? 'photogrammetry' : null);
  }, [previewTile]);

  const tagInfo = currentTag ? (tagsData[currentTag] ?? null) : null;

  const filteredTiles = useMemo<Tile[]>(() => {
    if (!previewTile) return [];
    if (!currentTag) return [previewTile];

    return tiles.filter((t) => (t.tags?.[0] ?? t.tag) === currentTag);
  }, [previewTile, tiles, currentTag]);

  const currentIdx = previewTile
    ? filteredTiles.findIndex((t) => t.id === previewTile.id)
    : -1;

  const handleClose = useCallback(() => setPreviewTile(null), [setPreviewTile]);

  const handlePrev = useCallback(() => {
    if (filteredTiles.length <= 1 || currentIdx === -1) return;
    const prevIdx = (currentIdx - 1 + filteredTiles.length) % filteredTiles.length;
    setPreviewTile(filteredTiles[prevIdx]);
  }, [filteredTiles, currentIdx, setPreviewTile]);

  const handleNext = useCallback(() => {
    if (filteredTiles.length <= 1 || currentIdx === -1) return;
    const nextIdx = (currentIdx + 1) % filteredTiles.length;
    setPreviewTile(filteredTiles[nextIdx]);
  }, [filteredTiles, currentIdx, setPreviewTile]);

  const handleSelectImage = useCallback((screenPath: string) => {
    if (!previewTile) return;
    setPreviewTile({ ...previewTile, imagePath: screenPath });
  }, [previewTile, setPreviewTile]);

  if (!previewTile) return null;

  const isHeadModel = previewTile.modelType === 'head';
  const cameraPos: [number, number, number] = isHeadModel ? [0, 0, 5.5] : [0, 5.5, 0.0001];

  return (
    <div className={styles.overlay}>
      <div className={styles.canvasContainer}>
        <Canvas
          dpr={[1, 2]}
          key={previewTile.id + (isHeadModel ? '-head' : '-normal')}
          camera={{ position: cameraPos, fov: 45 }}
          shadows={{ type: PCFShadowMap }}
          gl={{ toneMapping: ACESFilmicToneMapping, toneMappingExposure: 0.9, powerPreference: 'high-performance' }}
        >
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 10, 5]} intensity={0.6} />
          <pointLight position={[-10, 5, -10]} intensity={0.25} />
          <Environment preset="city" environmentIntensity={0.3} />

          <PreviewObject
            key={`${previewTile.id}-${previewTile.imagePath || ''}`}
            tile={previewTile}
          />

          <OrbitControls
            enableZoom
            enablePan={false}
            minDistance={2.0}
            maxDistance={12}
            target={[0, 0, 0]}
          />
        </Canvas>
      </div>

      <PreviewSidebar
        tagInfo={tagInfo}
        isCollapsed={isDescriptionCollapsed}
        onToggleCollapse={setIsDescriptionCollapsed}
        currentImagePath={previewTile.imagePath}
        onSelectImage={handleSelectImage}
      />

      <PreviewDock
        onPrev={handlePrev}
        onNext={handleNext}
        onClose={handleClose}
        currentIndex={currentIdx}
        totalCount={filteredTiles.length}
      />
    </div>
  );
};

