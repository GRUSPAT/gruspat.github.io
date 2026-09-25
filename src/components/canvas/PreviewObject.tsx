import { useState, useEffect, memo } from 'react';
import { TextureLoader, SRGBColorSpace, type Texture } from 'three';
import type { Tile } from '../../store/types';
import { TileContent } from '../tiles/TileContent';
import { getImageUrl } from '../../utils/imageAssets';

export interface PreviewObjectProps {
  tile: Tile;
}

export const PreviewObject = memo(({ tile }: PreviewObjectProps) => {
  const { size = 1, imagePath } = tile;
  const [imageTexture, setImageTexture] = useState<Texture | null>(null);
  const [loaded, setLoaded] = useState<boolean>(!imagePath);

  useEffect(() => {
    if (!imagePath) {
      setImageTexture(null);
      setLoaded(true);
      return;
    }

    setLoaded(false);
    let active = true;
    let loadedTexture: Texture | null = null;

    const loader = new TextureLoader();
    loader.load(
      getImageUrl(imagePath),
      (tex) => {
        if (active) {
          tex.colorSpace = SRGBColorSpace;
          tex.needsUpdate = true;
          setImageTexture(tex);
          loadedTexture = tex;
          setLoaded(true);
        } else {
          tex.dispose();
        }
      },
      undefined,
      (err) => {
        console.error('Failed to load image texture:', err);
        if (active) {
          setLoaded(true);
        }
      }
    );

    return () => {
      active = false;
      if (loadedTexture) {
        loadedTexture.dispose();
      }
    };
  }, [imagePath]);

  const normScale = 1.8 / (size > 0 ? size : 1);

  return (
    <group scale={[normScale, normScale, normScale]} visible={loaded}>
      <TileContent
        tile={tile}
        isPreview={true}
        imageTexture={imageTexture}
      />
    </group>
  );
});
