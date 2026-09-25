import { useRef, useEffect, useMemo, useCallback, memo } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { Euler, Quaternion, type Group } from 'three';
import { usePortfolioStore } from '../../store/usePortfolioStore';
import type { Tile } from '../../store/types';
import { RigidBody, CuboidCollider, type RapierRigidBody } from '@react-three/rapier';
import { TileContent } from '../tiles/TileContent';
import { FlatTextTile } from '../tiles/FlatTextTile';
import { getTileColliderConfig } from './tileCollider';
import { useTileEntranceAnimation } from './useTileEntranceAnimation';
import { useTileDrag } from './useTileDrag';
import { useDirectTexture } from './useDirectTexture';

export interface DraggableTileProps {
  tile: Tile;
  visible?: boolean;
  staggerIndex?: number;
}

export const DraggableTile = memo(({ 
  tile, 
  visible = true,
  staggerIndex = 0 
}: DraggableTileProps) => {
  const { 
    imagePath, isInstax, instaxRotationY, isRectanglePhoto, rectangleRotationY, 
    isRoundedRectanglePhoto, roundedRectangleRotationY, textRotationY,
  } = tile;

  const imageTexture = useDirectTexture(
    imagePath, 
    Boolean(imagePath && (isRectanglePhoto || isRoundedRectanglePhoto))
  );

  const updateTileGridPos = usePortfolioStore((state) => state.updateTileGridPos);
  const setDraggingTileId = usePortfolioStore((state) => state.setDraggingTileId);
  const triggerGlobalSpin = usePortfolioStore((state) => state.triggerGlobalSpin);
  const dragStyle = usePortfolioStore((state) => state.dragStyle);
  const liftHeight = usePortfolioStore((state) => state.liftHeight || 0.3);
  const setCameraGrid = usePortfolioStore((state) => state.setCameraGrid);
  const changeSection = usePortfolioStore((state) => state.changeSection);
  const setPreviewTile = usePortfolioStore((state) => state.setPreviewTile);
  const isTransitioning = usePortfolioStore((state) => state.isTransitioning);
  const assetsLoaded = usePortfolioStore((state) => state.assetsLoaded);

  const rotYDeg = useMemo(() => {
    if (tile.isFlatText && textRotationY !== undefined) return textRotationY;
    if (isInstax && instaxRotationY !== undefined) return instaxRotationY;
    if (isRectanglePhoto && rectangleRotationY !== undefined) return rectangleRotationY;
    if (isRoundedRectanglePhoto && roundedRectangleRotationY !== undefined) return roundedRectangleRotationY;
    return 0;
  }, [tile.isFlatText, textRotationY, isInstax, instaxRotationY, isRectanglePhoto, rectangleRotationY, isRoundedRectanglePhoto, roundedRectangleRotationY]);

  const rotYRad = useMemo(() => (rotYDeg * Math.PI) / 180, [rotYDeg]);

  const baseQuaternion = useMemo(() => {
    return new Quaternion().setFromEuler(new Euler(0, rotYRad, 0));
  }, [rotYRad]);

  const groupRef = useRef<Group>(null);
  const rbRef = useRef<RapierRigidBody>(null!);

  const { initialPosition, isSlidingIn, isSlidingInRef, hasLanded } = useTileEntranceAnimation({
    tile,
    visible,
    assetsLoaded,
    staggerIndex,
    rbRef,
    groupRef,
    baseQuaternion,
  });

  const { bind, isDragging, draggedRef } = useTileDrag({
    tile,
    visible,
    isSlidingIn,
    isTransitioning,
    rbRef,
    baseQuaternion,
    dragStyle,
    liftHeight,
    setDraggingTileId,
    updateTileGridPos,
  });

  useEffect(() => {
    if (rbRef.current) {
      rbRef.current.setRotation(baseQuaternion, true);
    }
  }, [baseQuaternion]);

  const handleDoubleClick = useCallback((e: ThreeEvent<MouseEvent>) => {
    if (!visible || isSlidingIn || isTransitioning) return;
    e.stopPropagation();
    if (tile.disablePreview || tile.isFlatText) return;
    setPreviewTile(tile);
  }, [visible, isSlidingIn, isTransitioning, tile, setPreviewTile]);

  const handleClick = useCallback((e: ThreeEvent<MouseEvent>) => {
    if (!visible || isSlidingIn || isTransitioning) return;
    e.stopPropagation();
    if (draggedRef.current) return;

    if (tile.clickAction && tile.clickAction.type !== 'none') {
      if (tile.clickAction.type === 'setCameraGrid') {
        const [col, row] = tile.clickAction.payload;
        setCameraGrid(col, row);
      } else if (tile.clickAction.type === 'changeSection') {
        changeSection(tile.clickAction.payload);
      }
      return;
    }

    if (!tile.isFlatText) {
      triggerGlobalSpin();
    }
  }, [visible, isSlidingIn, isTransitioning, tile, setCameraGrid, changeSection, triggerGlobalSpin, draggedRef]);

  useFrame(() => {
    if (tile.isFlatText || !visible || isSlidingIn || isSlidingInRef.current || isTransitioning || !rbRef.current) return;

    if (rbRef.current.translation().y < -30) {
      rbRef.current.sleep();
      return;
    }

    if (isDragging) {
      rbRef.current.setNextKinematicRotation(baseQuaternion);
    }
  });

  const colliderConfig = useMemo(() => getTileColliderConfig(tile), [tile]);

  return (
    <group visible={visible}>
      <RigidBody
        ref={rbRef}
        type={
          !visible
            ? 'kinematicPosition'
            : !hasLanded || isSlidingIn || isDragging || tile.isFlatText
              ? 'kinematicPosition'
              : 'dynamic'
        }
        colliders={false}
        linearDamping={1.0}
        angularDamping={1.0}
        enabledRotations={[false, true, false]}
        restitution={0.1}
        ccd={true}
        gravityScale={tile.isFlatText || isSlidingIn || !hasLanded ? 0 : 1}
        position={initialPosition}
        rotation={[0, rotYRad, 0]}
      >
        <CuboidCollider 
          args={colliderConfig.args} 
          position={colliderConfig.position} 
          sensor={Boolean(tile.isFlatText) || !visible || isSlidingIn || !hasLanded}
        />
        <group
          ref={groupRef}
          {...bind()}
          onDoubleClick={handleDoubleClick}
          onClick={handleClick}
        >
          {tile.isFlatText ? (
            <FlatTextTile tile={tile} />
          ) : (
            <TileContent
              tile={tile}
              isPreview={false}
              imageTexture={imageTexture}
            />
          )}
        </group>
      </RigidBody>
    </group>
  );
});
