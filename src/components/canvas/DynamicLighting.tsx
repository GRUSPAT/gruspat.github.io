import { Suspense, useRef, useEffect, useState, useMemo, memo } from 'react';
import {
  TextureLoader,
  CanvasTexture,
  SRGBColorSpace,
  RepeatWrapping,
  Object3D,
  type SpotLight,
} from 'three';
import { usePortfolioStore } from '../../store/usePortfolioStore';

export interface GoboSpotLightProps {
  filterFile: string;
  goboIntensity: number;
  useGoboTexture: boolean;
  goboScale: number;
}

export const GoboSpotLight = memo(({
  filterFile,
  goboIntensity,
  useGoboTexture,
  goboScale,
}: GoboSpotLightProps) => {
  const [processedTexture, setProcessedTexture] = useState<CanvasTexture | null>(null);
  const lightRef = useRef<SpotLight>(null);
  const targetObj = useMemo(() => new Object3D(), []);

  useEffect(() => {
    let active = true;
    let canvasTexture: CanvasTexture | null = null;

    const loader = new TextureLoader();
    loader.load(
      `/shadows/${filterFile}`,
      (texture) => {
        if (!active) {
          texture.dispose();
          return;
        }

        const image = texture.image as (HTMLImageElement & { width?: number; height?: number }) | undefined;
        if (!image) return;

        const canvas = document.createElement('canvas');
        canvas.width = image.width || 512;
        canvas.height = image.height || 512;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(image, 0, 0);
        
        try {
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imgData.data;
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const a = data[i + 3];
            
            const brightness = (r + g + b) / 3;
            const alphaNormalized = a / 255;
            const finalVal = Math.round(255 * (1 - alphaNormalized) + brightness * alphaNormalized);
            
            data[i] = finalVal;
            data[i + 1] = finalVal;
            data[i + 2] = finalVal;
            data[i + 3] = 255;
          }
          ctx.putImageData(imgData, 0, 0);
        } catch (e) {
          console.warn('Failed to process gobo image pixels directly:', e);
        }

        canvasTexture = new CanvasTexture(canvas);
        canvasTexture.colorSpace = SRGBColorSpace;
        canvasTexture.wrapS = RepeatWrapping;
        canvasTexture.wrapT = RepeatWrapping;

        const scale = Math.max(0.001, goboScale || 1);
        canvasTexture.repeat.set(1 / scale, 1 / scale);
        canvasTexture.offset.set((1 - 1 / scale) / 2, (1 - 1 / scale) / 2);
        canvasTexture.needsUpdate = true;
        setProcessedTexture(canvasTexture);

        texture.dispose();
      },
      undefined,
      (err) => console.error('Failed to load Gobo texture:', err)
    );

    return () => {
      active = false;
      if (canvasTexture) {
        canvasTexture.dispose();
      }
    };
  }, [filterFile]);

  useEffect(() => {
    if (!processedTexture) return;
    const scale = Math.max(0.001, goboScale || 1);
    processedTexture.repeat.set(1 / scale, 1 / scale);
    processedTexture.offset.set((1 - 1 / scale) / 2, (1 - 1 / scale) / 2);
    processedTexture.needsUpdate = true;
  }, [processedTexture, goboScale]);

  return (
    <>
      <primitive object={targetObj} position={[0, 0, 0]} />
      <spotLight
        ref={lightRef}
        target={targetObj}
        castShadow
        position={[-8, 18, -6]}
        distance={40}
        angle={0.8}
        penumbra={0.6}
        intensity={goboIntensity}
        decay={0}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0025}
        shadow-camera-near={8}
        shadow-camera-far={32}
        map={useGoboTexture && processedTexture ? processedTexture : null}
      />
    </>
  );
});

export const DynamicLighting = memo(() => {
  const activeLightType = usePortfolioStore((state) => state.activeLightType);
  const activeFilter = usePortfolioStore((state) => state.activeFilter);
  const useGoboTexture = usePortfolioStore((state) => state.useGoboTexture);
  const goboIntensity = usePortfolioStore((state) => state.goboIntensity);
  const goboScale = usePortfolioStore((state) => state.goboScale);

  if (activeLightType === 'gobos') {
    return (
      <>
        <ambientLight intensity={0.4} />
        
        <directionalLight
          position={[10, 12, 10]}
          intensity={0.6}
          color="#ffffff"
        />

        <Suspense fallback={null}>
          <GoboSpotLight 
            filterFile={activeFilter} 
            goboIntensity={goboIntensity} 
            useGoboTexture={useGoboTexture} 
            goboScale={goboScale}
          />
        </Suspense>
      </>
    );
  }

  return (
    <>
      <ambientLight intensity={0.5} />
      
      <directionalLight
        castShadow
        position={[6, 15, 5]}
        intensity={1.2}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={30}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-bias={-0.0035}
      />
      
      <pointLight position={[-15, 8, -15]} intensity={0.4} color="#4facfe" />
      <pointLight position={[15, 8, 15]} intensity={0.4} color="#ff0844" />
    </>
  );
});
