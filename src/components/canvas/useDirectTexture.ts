import { useState, useEffect } from 'react';
import { TextureLoader, SRGBColorSpace, type Texture } from 'three';
import { getImageUrl } from '../../utils/imageAssets';

export const useDirectTexture = (imagePath?: string, enabled = false): Texture | null => {
  const [imageTexture, setImageTexture] = useState<Texture | null>(null);

  useEffect(() => {
    if (!enabled || !imagePath) {
      setImageTexture(null);
      return;
    }

    let active = true;
    let loadedTexture: Texture | null = null;

    const loader = new TextureLoader();
    loader.load(
      getImageUrl(imagePath),
      (tex) => {
        if (active) {
          tex.colorSpace = SRGBColorSpace;
          setImageTexture(tex);
          loadedTexture = tex;
        } else {
          tex.dispose();
        }
      },
      undefined,
      (err) => console.error('Failed to load image texture:', err)
    );

    return () => {
      active = false;
      if (loadedTexture) {
        loadedTexture.dispose();
      }
    };
  }, [enabled, imagePath]);

  return imageTexture;
};
