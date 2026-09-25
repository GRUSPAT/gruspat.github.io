import { useState, useRef, useMemo, useCallback, useLayoutEffect, useEffect, type RefObject } from 'react';
import type { Group, Quaternion } from 'three';
import type { RapierRigidBody } from '@react-three/rapier';
import gsap from 'gsap';
import type { Tile } from '../../store/types';

interface UseTileEntranceAnimationParams {
  tile: Tile;
  visible: boolean;
  assetsLoaded: boolean;
  staggerIndex: number;
  rbRef: RefObject<RapierRigidBody>;
  groupRef: RefObject<Group | null>;
  baseQuaternion: Quaternion;
}

export const useTileEntranceAnimation = ({
  tile,
  visible,
  assetsLoaded,
  staggerIndex,
  rbRef,
  groupRef,
  baseQuaternion,
}: UseTileEntranceAnimationParams) => {
  const [isSlidingIn, setIsSlidingIn] = useState(false);
  const [hasLanded, setHasLanded] = useState(false);
  const isSlidingInRef = useRef(false);
  const prevVisibleRef = useRef(false);
  const animTweenRef = useRef<gsap.core.Tween | null>(null);

  const homePos = tile.defaultGridPos || tile.gridPos || [0, 0];
  const targetX = homePos[0];
  const targetZ = homePos[1];
  const targetY = tile.defaultCurrentY !== undefined ? tile.defaultCurrentY : (tile.currentY || 0.02);

  const spawnCoords = useMemo(() => {
    const side = targetX >= 0 ? 1 : -1;
    const sX = targetX + side * (35 + ((Math.abs(targetX) * 7.3) % 8));
    const sZ = targetZ + (((Math.abs(targetZ) * 5.1) % 8) - 4);
    const fY = tile.isFlatText ? 0.005 : Math.max(0.02, targetY);
    return { x: sX, y: fY, z: sZ };
  }, [targetX, targetZ, tile.isFlatText, targetY]);

  const initialPosition = useMemo<[number, number, number]>(() => {
    return [spawnCoords.x, spawnCoords.y, spawnCoords.z];
  }, [spawnCoords.x, spawnCoords.y, spawnCoords.z]);

  const resetSavedRotation = useCallback(() => {
    if (!rbRef.current) return;
    try {
      rbRef.current.setRotation(baseQuaternion, true);
    } catch {}
  }, [baseQuaternion, rbRef]);

  useEffect(() => {
    return () => {
      if (animTweenRef.current) {
        animTweenRef.current.kill();
        animTweenRef.current = null;
      }
    };
  }, []);

  useLayoutEffect(() => {
    const isEffectivelyVisible = visible && assetsLoaded;
    const becameVisible = !prevVisibleRef.current && isEffectivelyVisible;
    prevVisibleRef.current = isEffectivelyVisible;

    if (!isEffectivelyVisible) {
      if (animTweenRef.current) {
        animTweenRef.current.kill();
        animTweenRef.current = null;
      }
      setIsSlidingIn(false);
      isSlidingInRef.current = false;
      setHasLanded(false);

      try {
        if (rbRef.current) {
          rbRef.current.setTranslation({ x: spawnCoords.x, y: spawnCoords.y, z: spawnCoords.z }, true);
          rbRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
          rbRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
          rbRef.current.resetForces(true);
          rbRef.current.resetTorques(true);
          resetSavedRotation();
          rbRef.current.wakeUp();
        }
      } catch {}
      if (groupRef.current?.parent) {
        groupRef.current.parent.position.set(spawnCoords.x, spawnCoords.y, spawnCoords.z);
      }
      return;
    }

    if (becameVisible) {
      setHasLanded(false);
      isSlidingInRef.current = true;
      setIsSlidingIn(true);

      try {
        if (rbRef.current) {
          rbRef.current.setTranslation({ x: spawnCoords.x, y: spawnCoords.y, z: spawnCoords.z }, true);
          rbRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
          rbRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
          rbRef.current.wakeUp();
        }
      } catch {}

      if (groupRef.current?.parent) {
        groupRef.current.parent.position.set(spawnCoords.x, spawnCoords.y, spawnCoords.z);
      }

      const staggerYOffset = tile.isFlatText ? 0 : (staggerIndex || 0) * 0.45;
      const slideY = (tile.isFlatText ? 0.005 : Math.max(0.02, tile.currentY || 0.02)) + staggerYOffset;

      const animObj = {
        x: spawnCoords.x,
        y: slideY,
        z: spawnCoords.z,
      };

      const delay = (staggerIndex || 0) * 0.06;

      if (animTweenRef.current) {
        animTweenRef.current.kill();
      }

      animTweenRef.current = gsap.to(animObj, {
        x: targetX,
        y: slideY,
        z: targetZ,
        duration: 0.85,
        delay,
        ease: 'power3.out',
        onStart: () => {
          resetSavedRotation();
          try {
            if (rbRef.current) {
              rbRef.current.setTranslation({ x: spawnCoords.x, y: slideY, z: spawnCoords.z }, true);
            }
          } catch {}
          if (groupRef.current?.parent) {
            groupRef.current.parent.position.set(spawnCoords.x, slideY, spawnCoords.z);
          }
        },
        onUpdate: () => {
          try {
            if (rbRef.current) {
              rbRef.current.setTranslation({ x: animObj.x, y: animObj.y, z: animObj.z }, true);
            }
          } catch {}
          if (groupRef.current?.parent) {
            groupRef.current.parent.position.set(animObj.x, animObj.y, animObj.z);
          }
        },
        onComplete: () => {
          isSlidingInRef.current = false;
          const landingY = tile.isFlatText ? 0.005 : Math.max(0.02, tile.currentY || 0.02) + staggerYOffset;
          try {
            if (rbRef.current) {
              rbRef.current.setTranslation({ x: targetX, y: landingY, z: targetZ }, true);
              rbRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
              rbRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
              rbRef.current.resetForces(true);
              rbRef.current.resetTorques(true);
              rbRef.current.wakeUp();
            }
          } catch {}
          if (groupRef.current?.parent) {
            groupRef.current.parent.position.set(targetX, landingY, targetZ);
          }
          setIsSlidingIn(false);
          setHasLanded(true);
        },
      });
    }

    return () => {
      if (!visible) {
        if (animTweenRef.current) {
          animTweenRef.current.kill();
          animTweenRef.current = null;
        }
        isSlidingInRef.current = false;
        setIsSlidingIn(false);
        setHasLanded(false);
      }
    };
  }, [
    visible,
    assetsLoaded,
    spawnCoords.x,
    spawnCoords.y,
    spawnCoords.z,
    targetX,
    targetZ,
    tile.isFlatText,
    tile.currentY,
    staggerIndex,
    resetSavedRotation,
    groupRef,
    rbRef,
  ]);

  return {
    spawnCoords,
    initialPosition,
    isSlidingIn,
    isSlidingInRef,
    hasLanded,
    resetSavedRotation,
  };
};
