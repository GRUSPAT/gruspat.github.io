import { memo } from 'react';
import { Text } from '@react-three/drei';
import { preloadFont } from 'troika-three-text';
import type { Tile } from '../../store/types';

const FONT_PATH = '/fonts/Lato-Regular.ttf';
preloadFont({ font: FONT_PATH }, () => {});

interface FlatTextTileProps {
  tile: Tile;
}

export const FlatTextTile = memo(({ tile }: FlatTextTileProps) => {
  const size = tile.size ?? 1;
  const textStr = tile.text || 'SAMPLE TEXT';

  return (
    <group position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <Text
        font={FONT_PATH}
        fontSize={size * 0.4}
        color={tile.color || '#ffffff'}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.06}
      >
        {textStr}
      </Text>
      <mesh position={[0, 0, -0.001]}>
        <planeGeometry args={[Math.max(1, textStr.length * size * 0.25), Math.max(0.4, size * 0.5)]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
});

export default FlatTextTile;
